# Live coordination map

This repository is expected to coordinate three live surfaces:

## Cloudflare

Cloudflare should stay authoritative for DNS when Workers or Pages are serving the public apex domains.

Current domains to coordinate:

- `streetemporioroyal.com`
- `fusion-throne.com`

If Cloudflare Worker/Page is the public edge, keep the domains routed in Cloudflare and do not delegate nameservers to Vercel. Vercel will report the domains as externally configured unless the Cloudflare DNS records point directly to Vercel.

## Vercel

Use Vercel for the deployable Express/front-end app in `backend/`.

Important project expectations:

- Vercel project root directory: `backend`
- Entrypoint: `backend/server.js`
- Static frontend: `backend/index.html`
- Health endpoints: `/health` and `/api/health`

The backend exports the Express app for Vercel and only calls `app.listen()` during local/Railway-style process execution.

Required production environment variables for full API functionality:

- `DATABASE_URL`
- `REDIS_URL`
- `AWS_S3_BUCKET` or `BUCKET_NAME`
- `AWS_REGION` or `BUCKET_REGION`
- `AWS_ACCESS_KEY_ID` or `BUCKET_ACCESS_KEY`
- `AWS_SECRET_ACCESS_KEY` or `BUCKET_SECRET_KEY`

Without database or Redis variables, `/health` still responds and reports those checks as `not_configured`, but data-backed endpoints return configuration errors.

## Railway / Render / SER27-BOT

The SER27 bot files in this repo are designed as long-running Node services, not as Vercel Functions:

- `ser27-bot-server.js`
- `ser27-bot-advanced.js`
- `package-bot.json`
- `package-advanced.json`

Expected Render service names from docs:

- `ser27-bot-24-7`
- `ser27-bot-advanced`

Expected Render start command for advanced mode:

```bash
node ser27-bot-advanced.js
```

Expected health/status URL after Render deployment:

```txt
https://ser27-bot-advanced.onrender.com/status
```

Required bot orchestration variables live in Render/Railway, not in Vercel:

- `GITHUB_TOKEN`
- `GITHUB_WEBHOOK_SECRET`
- `RAILWAY_TOKEN`
- `RAILWAY_PROJECT_ID`
- `VERCEL_TOKEN`
- `VERCEL_PROJECT_ID`
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_ZONE_ID`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_WHATSAPP_FROM`
- `TWILIO_WHATSAPP_TO`

Do not commit real secret values. Configure them in each provider dashboard.
