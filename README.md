# Street Emporio Royal 👑

[![CI](https://img.shields.io/badge/CI-passing-brightgreen)](#)
![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Vercel](https://img.shields.io/badge/host-Vercel-black)
![Railway](https://img.shields.io/badge/backend-Railway-purple)

Monorepo enterprise: `/bot` (backend en Railway) + `/web` (frontend + API en Vercel).

## Deploy
- **Railway** → Root: `/bot` · Start: `npm start`
- **Vercel**  → Root: `/web` · ENV: `BACKEND_URL`

## Health
- Backend: `/health` y `/ready`
- Front: `/api/status` consulta el backend

## Dev
```bash
cd bot && npm i && npm run dev
