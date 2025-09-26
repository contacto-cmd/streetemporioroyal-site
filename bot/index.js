import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';

// OpenAI
import OpenAI from 'openai';

// PayPal
import checkout from '@paypal/checkout-server-sdk';

// Mercado Pago
import mercadopago from 'mercadopago';

// (Opcional) Discord
import { Client, GatewayIntentBits, Partials } from 'discord.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('tiny'));

// ----------- OpenAI -----------
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log('✅ OpenAI listo');
} else {
  console.log('⚠️ OPENAI_API_KEY no configurado (el bot seguirá, pero sin IA).');
}

// ----------- PayPal -----------
function getPayPalClient() {
  const envName = (process.env.PAYPAL_ENV || 'sandbox').toLowerCase();
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_SECRET;

  if (!clientId || !secret) throw new Error('Faltan llaves de PayPal');

  const environment =
    envName === 'live'
      ? new checkout.core.LiveEnvironment(clientId, secret)
      : new checkout.core.SandboxEnvironment(clientId, secret);

  return new checkout.core.PayPalHttpClient(environment);
}

// ----------- Mercado Pago -----------
if (process.env.MERCADOPAGO_ACCESS_TOKEN) {
  mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
  });
  console.log('✅ Mercado Pago listo');
} else {
  console.log('⚠️ MERCADOPAGO_ACCESS_TOKEN no configurado.');
}

// ----------- Health / Ready -----------
app.get('/', (_req, res) => res.send('Royal AI Workspace Bot ✅'));
app.get('/healthz', (_req, res) => res.status(200).json({ ok: true }));
app.get('/ready', (_req, res) => res.status(200).json({ ready: true }));

// ----------- PAYPAL: crear orden -----------
app.post('/pay/paypal', async (req, res) => {
  try {
    const { amount = '10.00', currency = 'MXN', description = 'Prueba Royal' } = req.body || {};
    const request = new checkout.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: { currency_code: currency, value: String(amount) },
          description,
        },
      ],
      application_context: {
        brand_name: 'Street Emperio Royal',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: 'https://example.com/success', // cámbialo luego a tu dominio
        cancel_url: 'https://example.com/cancel'
      }
    });

    const client = getPayPalClient();
    const order = await client.execute(request);
    const approveLink = order.result.links?.find(l => l.rel === 'approve')?.href;

    return res.json({
      id: order.result.id,
      status: order.result.status,
      approveLink
    });
  } catch (err) {
    console.error('PayPal error:', err.message);
    return res.status(500).json({ error: 'PayPal order failed', detail: err.message });
  }
});

// ----------- MERCADO PAGO: crear preferencia -----------
app.post('/pay/mp', async (req, res) => {
  try {
    const {
      title = 'Prueba Royal',
      quantity = 1,
      unit_price = 10,
      currency_id = 'MXN',
      description = 'Item de prueba'
    } = req.body || {};

    const preference = {
      items: [{ title, quantity, unit_price, currency_id, description }],
      back_urls: {
        success: 'https://example.com/success', // cámbialo luego a tu dominio
        failure: 'https://example.com/failure',
        pending: 'https://example.com/pending'
      },
      auto_return: 'approved'
    };

    const response = await mercadopago.preferences.create(preference);
    return res.json({
      id: response.body.id,
      init_point: response.body.init_point, // link de pago (producción)
      sandbox_init_point: response.body.sandbox_init_point // link sandbox
    });
  } catch (err) {
    console.error('MercadoPago error:', err.message);
    return res.status(500).json({ error: 'MP preference failed', detail: err.message });
  }
});

// ----------- COMMAND: IA que interpreta una orden y sugiere acción -----------
app.post('/command', async (req, res) => {
  try {
    const { prompt = '' } = req.body || {};
    if (!openai) return res.status(400).json({ error: 'OpenAI no configurado' });

    // Sencillo: sugerir si es pago PayPal o MP y cuánto.
    const sys = `Eres un orquestador. Dime si el usuario quiere "paypal" o "mp" y el monto MXN, en JSON {"via":"paypal|mp","amount": number}.`;
    const user = `Orden: ${prompt}`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: sys },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    });

    let payload = {};
    try {
      payload = JSON.parse(chat.choices[0].message.content.trim());
    } catch {
      payload = { via: 'mp', amount: 10 };
    }

    return res.json({ ok: true, suggestion: payload });
  } catch (err) {
    console.error('Command error:', err.message);
    return res.status(500).json({ error: 'Command failed', detail: err.message });
  }
});

// ----------- (OPCIONAL) DISCORD BOT -----------
if (process.env.DISCORD_TOKEN) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ],
    partials: [Partials.Channel]
  });

  client.on('ready', () => {
    console.log(`🤖 Discord online como ${client.user.tag}`);
  });

  client.on('messageCreate', async (msg) => {
    try {
      if (msg.author.bot) return;

      // Ping
      if (msg.content.trim().toLowerCase() === '!ping') {
        return msg.reply('Pong 🏓');
      }

      // !paypal 100
      if (msg.content.startsWith('!paypal')) {
        const [, raw] = msg.content.split(' ');
        const amount = Number(raw) || 10;
        // crear orden PayPal rápida
        try {
          const request = new checkout.orders.OrdersCreateRequest();
          request.prefer('return=representation');
          request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{ amount: { currency_code: 'MXN', value: String(amount) } }],
            application_context: {
              brand_name: 'Street Emperio Royal',
              user_action: 'PAY_NOW',
              return_url: 'https://example.com/success',
              cancel_url: 'https://example.com/cancel'
            }
          });
          const clientPP = getPayPalClient();
          const order = await clientPP.execute(request);
          const link = order.result.links?.find(l => l.rel === 'approve')?.href;
          return msg.reply(`Link PayPal (${amount} MXN): ${link}`);
        } catch (e) {
          console.error(e);
          return msg.reply('Error creando orden PayPal ❌');
        }
      }

      // !mp 100
      if (msg.content.startsWith('!mp')) {
        const [, raw] = msg.content.split(' ');
        const unit_price = Number(raw) || 10;
        try {
          const pref = await mercadopago.preferences.create({
            items: [{ title: 'Pago Royal', quantity: 1, unit_price, currency_id: 'MXN' }],
            back_urls: {
              success: 'https://example.com/success',
              failure: 'https://example.com/failure',
              pending: 'https://example.com/pending'
            },
            auto_return: 'approved'
          });
          return msg.reply(`Link MP (${unit_price} MXN): ${pref.body.init_point}`);
        } catch (e) {
          console.error(e);
          return msg.reply('Error creando preferencia MP ❌');
        }
      }
    } catch (e) {
      console.error('Discord handler error', e);
    }
  });

  client.login(process.env.DISCORD_TOKEN).catch(err => {
    console.error('Discord login error:', err.message);
  });
}

// ----------- START -----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Royal Bot corriendo en http://0.0.0.0:${PORT}`);
});
