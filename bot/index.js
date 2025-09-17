import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares enterprise
app.use(helmet());
app.use(compression());
app.use(cors({ origin: '*' }));
app.use(morgan('combined'));
app.use(express.json());

// Healthchecks
app.get('/health', (_, res) => res.status(200).json({ ok: true }));
app.get('/ready',  (_, res) => res.status(200).json({ ready: true }));

// Home
app.get('/', (_, res) => {
  res.send('👑 Royal backend vivo (Railway) — enterprise build');
});

// Graceful shutdown
const server = app.listen(PORT, () => {
  console.log(`🚂 Railway on :${PORT}`);
});
for (const sig of ['SIGTERM', 'SIGINT']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
