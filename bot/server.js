import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import { startBot } from './index.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (_, res) => res.status(200).json({ ok: true, service: 'bot', health: 'green' }));
app.get('/ready',  (_, res) => res.status(200).json({ ok: true, ready: true  }));

const server = app.listen(PORT, () => {
  console.log(`🚂 Railway HTTP on :${PORT}`);
  startBot().catch(err => console.error('Bot start error:', err));
});

for (const sig of ['SIGTERM','SIGINT']) {
  process.on(sig, () => server.close(() => process.exit(0)));
}
