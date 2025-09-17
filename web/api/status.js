export default async function handler(_req, res) {
  try {
    const r = await fetch(process.env.BACKEND_URL + '/health', { cache: 'no-store' });
    const data = await r.json();
    res.status(200).json({ upstream: data, ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
}
