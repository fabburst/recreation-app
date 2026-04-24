export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const key = process.env.GEMINI_KEY_API;
  if (!key) return res.status(500).json({ error: 'GEMINI_KEY_API not set' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const { query, type } = body || {};
  if (!query) return res.status(400).json({ error: 'missing query' });

  const typeHint = type && type !== 'all'
    ? `La catégorie probable est "${type}", mais corrige si c'est évident.`
    : 'Détermine automatiquement si c\'est un film, une série, un jeu vidéo ou un livre.';

  const prompt = `Tu es un assistant qui identifie des œuvres culturelles (films, séries TV, jeux vidéo, livres) depuis une recherche partielle ou complète.
L'utilisateur tape : "${query}". ${typeHint}

RÈGLE IMPORTANTE : Si la requête ressemble à un titre complet ou à une œuvre récente/à venir que tu ne connais pas, inclus-la QUAND MÊME en première position avec les métadonnées déduites du contexte (studio probable, année probable, etc.). Ne rejette jamais la requête de l'utilisateur.

Réponds UNIQUEMENT par un tableau JSON valide de 4 à 6 suggestions, sans markdown ni commentaire.
Format strict : { "title": string, "type": "film"|"serie"|"jeu"|"livre", "year": number|null, "dir": string, "runtime": string }
- "dir" = réalisateur (film/série), studio (jeu), auteur (livre)
- "runtime" = "1h 48" / "6 épisodes" / "~20h" / "320 p."
- Si tu n'es pas sûr d'une valeur, donne une estimation raisonnable plutôt que de l'omettre.`;

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 },
        }),
      }
    );

    const data = await r.json();
    if (!r.ok) {
      console.error('Gemini error:', JSON.stringify(data));
      return res.status(502).json({ error: 'Gemini error', detail: data });
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    const clean = raw.trim().replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/, '').trim();
    const parsed = JSON.parse(clean);
    res.json(Array.isArray(parsed) ? parsed.slice(0, 6) : []);
  } catch (e) {
    console.error('ai-search error:', e);
    res.status(500).json({ error: e.message });
  }
}
