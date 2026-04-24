export default async function handler(req, res) {
  const { title, author } = req.query;
  if (!title) return res.status(400).json({ url: null });

  const q = encodeURIComponent(`intitle:${title}${author ? ` inauthor:${author}` : ''}`);

  try {
    const r = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&printType=books`
    );
    const data = await r.json();
    const item = (data.items || [])[0];
    const links = item?.volumeInfo?.imageLinks;
    const thumb = links?.extraLarge || links?.large || links?.medium || links?.thumbnail || links?.smallThumbnail;
    if (!thumb) return res.json({ url: null });
    const url = thumb.replace('http://', 'https://').replace('zoom=1', 'zoom=3');
    res.json({ url });
  } catch (e) {
    res.json({ url: null });
  }
}
