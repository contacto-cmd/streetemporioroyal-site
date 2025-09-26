export default async function handler(req, res) {
  try {
    const base = process.env.BACKEND_URL; // <-- pon esto en Vercel
    if (!base) return res.status(500).json({ error: 'Falta BACKEND_URL' });

    const r = await fetch(`${base.replace(/\/$/, '')}/health`, {
      headers: { 'user-agent': 'royal-web' },
      cache: 'no-store',
    });
    const data = await r.json();
    res.status(200).json({ ok: true, backend: data });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
}
