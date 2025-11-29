# 🧠 Royal EGI Blueprint

Sistema base del núcleo de IA conectado a Railway y GitHub.

## Endpoints
| Ruta | Descripción |
|------|--------------|
| `/health` | Verifica el estado del servicio |
| `/api/status` | Muestra configuración CORE + SYNAPSE |
| `/api/blueprint` | Devuelve el JSON de AEGIS_BLUEPRINT |
| `/api/anti` | Expone metadatos del Anti-Blindaje |

## Deploy en Railway
1. Subir repo a GitHub con nombre **royal-egi-blueprint**
2. En Railway: `New → Deploy from GitHub`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Variables de entorno:
   - CORE_DOMAIN
   - CORE_MODE
   - CORE_SIGNATURE
   - AEGIS_BLUEPRINT
   - ANTI_MODE
   - ANTI_BLINDAJE_CORE
   - SYNAPSE_REGION
   - SYNAPSE_VECTOR
   - ALLOW_ORIGINS

## real time backend AI
GET https://api.streetemporioroyal.com/health
→ `{ "ok": true, "service": "royal-egi-blueprint" }`
