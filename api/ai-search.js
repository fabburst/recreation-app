export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { query, type } = req.body || {};
  if (!query) return res.status(400).json({ error: 'missing query' });

  const key = process.env.GEMINI_KEY_API;
  if (!key) return res.status(500).json({ error: 'GEMINI_KEY_API not set' });

  const typeHint = type && type !== 'all'
    ? `La catégorie probable est "${type}" (film|serie|jeu|livre), mais corrige si c'est évident.`
    : '';

  const prompt = `Tu es un assistant qui reconnaît des œuvres (films, séries, jeux vidéo, livres) à partir d'une recherche partielle.
L'utilisateur tape : "${query}". ${typeHint}
Renvoie un JSON strict (sans markdown, sans commentaire) de 3 à 5 suggestions plausibles, triées par pertinence.
Chaque suggestion : { "title": string, "type": "film"|"serie"|"jeu"|"livre", "year": number, "dir": string, "runtime": string }
- "dir" = réalisateur (film/série), studio (jeu), auteur (livre).
- "runtime" = durée courte ("1h 48"), nombre d'épisodes ("6 épisodes"), pages ("288 p.") ou durée estimée ("~20h").
Réponds uniquement par le JSON.`;

  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    }
  );

  if (!r.ok) return res.status(502).json({ error: 'Gemini error', status: r.status });

  const data = await r.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
  const clean = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();

  try {
    const parsed = JSON.parse(clean);
    res.json(Array.isArray(parsed) ? parsed.slice(0, 6) : []);
  } catch {
    res.json([]);
  }
}
