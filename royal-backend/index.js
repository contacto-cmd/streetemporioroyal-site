// index.js - Royal Backend (Node/Express) - add/merge into tu servidor
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors()); // ajustar orígenes si quieres más restricción
app.use(bodyParser.json({ limit: '1mb' }));

const PORT = process.env.PORT || 3000;

// --- HEALTH ---
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

// --- EXECUTE ENDPOINT ---
/**
 * Expect headers:
 *   X-AHT-Signature: signature string (placeholder)
 * Body:
 *   { payload: "COMMAND|ISO_TIMESTAMP" }
 */
app.post('/api/execute', async (req, res) => {
  try {
    const signature = req.headers['x-aht-signature'] || '';
    const { payload } = req.body || {};

    if (!payload) return res.status(400).json({ ok: false, error: 'Missing payload' });

    // -----------------------------------
    // VERIFY SIGNATURE (STUB)
    // Aquí debes reemplazar por verificación real con la clave pública ECC/RSA.
    // Ejemplo futuro: import verifySignature from './crypto-utils' y await verifySignature(signature, payload)
    const isVerified = (signature && signature.startsWith('dummy')) ? true : false;
    // -----------------------------------

    if (!isVerified) {
      console.warn('EXECUTION DENIED: invalid signature', { payload, signature });
      return res.status(401).json({ ok: false, error: 'Invalid signature. Execution denied.' });
    }

    console.log('EXECUTION VERIFIED:', { payload });

    // Parse: tu payload puede venir "command target params|timestamp"
    const cmdPart = payload.split('|')[0] || '';
    const [command, target, ...rest] = cmdPart.split(' ');
    const params = rest.join(' ');

    // Aquí: orquesta acciones concretas. Ejemplos:
    // - llamar a Discord bot API
    // - encolar job en /jobs
    // - llamar al Colab worker (o poner registro en jobs.json)
    // - enviar notificación por correo
    // A modo de demo, devolvemos ack:
    return res.status(200).json({
      ok: true,
      status: 'acknowledged',
      message: `Command '${command || 'no-cmd'}' for target '${target || 'no-target'}' queued.`,
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('execute error', err);
    return res.status(500).json({ ok: false, error: 'internal error' });
  }
});

app.listen(PORT, () => console.log(`🔥 Royal backend listening on ${PORT}`));
