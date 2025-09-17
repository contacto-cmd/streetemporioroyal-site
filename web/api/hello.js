export default function handler(_req, res) {
  res.status(200).json({ ok: true, env: 'vercel', brand: 'Street Emporio Royal' });
}
