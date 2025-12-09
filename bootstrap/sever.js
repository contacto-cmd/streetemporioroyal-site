#!/kend/server.js"]
EOF

# GitHub Action
cat > "${ROOT_DIR}/.github/workflows/deploy.yml" <<'EOF'
name: Deploy Royal System

on:
  push:
    branches: ["main"]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Deploy backend to Railway
        run: |
          curl -fsSL https://railway.app/install.sh | sh
          railway up --service=royal-backend
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Deploy frontend to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./web
EOF

# Backend package.json
cat > "${ROOT_DIR}/backend/package.json" <<'EOF'
{
  "name": "royal-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "pg": "^8.10.0",
    "node-fetch": "^3.3.2",
    "dotenv": "^16.0.0"
  }
}
EOF

# Backend server.js
cat > "${ROOT_DIR}/backend/server.js" <<'EOF'
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/health", require("./routes/health"));
app.use("/api/emails", require("./routes/emails"));
app.use("/api/licenses", require("./routes/licenses"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Backend Royal corriendo en puerto ${PORT}`));
EOF

# routes/health.js
cat > "${ROOT_DIR}/backend/routes/health.js" <<'EOF'
const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ status: "ok", royal: "activo", ts: Date.now() });
});

module.exports = router;
EOF

# routes/emails.js (Resend example)
cat > "${ROOT_DIR}/backend/routes/emails.js" <<'EOF'
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get("/", async (req, res) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "RESEND_API_KEY missing" });

  try {
    const r = await fetch("https://api.resend.com/emails", {
      headers: { "Authorization": `Bearer ${apiKey}` }
    });
    const data = await r.json();
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
EOF

# routes/licenses.js
cat > "${ROOT_DIR}/backend/routes/licenses.js" <<'EOF'
const express = require('express');
const crypto = require('crypto');
const router = express.Router();

router.post("/issue", (req, res) => {
  const payload = {
    user: req.body.user || "unknown",
    ts: Date.now(),
    issued_by: "Royal-Throne-V3"
  };

  try {
    const sign = crypto.sign("sha256",
      Buffer.from(JSON.stringify(payload)),
      { key: process.env.MASTER_RSA_PRIVADA || '', padding: crypto.constants.RSA_PKCS1_PADDING }
    );

    res.json({
      payload,
      signature: sign.toString("base64")
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
EOF

# throne-protocol-v3.json
cat > "${ROOT_DIR}/backend/throne-protocol-v3.json" <<'EOF'
{
  "project": "Throne Protocol V3.0",
  "owner": "Roberto Rivera Gamas - Royal",
  "domain": "streetemporioroyal.com",
  "issued_at": "2025-11-22T00:00:00Z",
  "ancestral_root": true,
  "rsa": "RSA-4096",
  "manifiesto": "Pega aquí tu bloque completo",
  "capabilities": [
    "Álgebra Inversa Arquitectónica",
    "Visión Multidimensional",
    "Intelectopatía",
    "Materialización conceptual"
  ],
  "apis": {
    "emails": "/api/emails",
    "licenses_issue": "/api/licenses/issue",
    "health": "/api/health"
  }
}
EOF

# seed script
cat > "${ROOT_DIR}/backend/services/seed.js" <<'EOF'
const fs = require("fs");
const path = require("path");

const protocol = {
  activated: true,
  owner: "Royal",
  ts: Date.now(),
  signature: "ancestral-seal"
};

fs.writeFileSync(
  path.join(__dirname, "../throne-protocol-v3.json"),
  JSON.stringify(protocol, null, 2)
);

console.log("🌐 Throne Protocol V3.0 activado");
EOF

# Web package.json (Next.js minimal stub)
cat > "${ROOT_DIR}/web/package.json" <<'EOF'
{
  "name": "royal-web",
  "version": "1.0.0",
  "scripts": {de
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001"
  },
  "dependencies": {
    "next": "^13.5.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
EOF

# next.config.js
cat > "${ROOT_DIR}/web/next.config.js" <<'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}
module.exports = nextConfig
EOF

# web/pages/index.jsx
cat > "${ROOT_DIR}/web/pages/index.jsx" <<'EOF'
export default function Home() {
  return (
    <main style={{ fontFamily: 'system-ui, Arial', padding: 24 }}>
      <h1>Street Emporio Royal — Dashboard</h1>
      <p>Estado: <strong>Coronando...</strong></p>
      <img src="/certificado-royal.png" alt="Certificado Royal" style={{ maxWidth: 360 }} />
    </main>
  );
}
EOF

# README
cat > "${ROOT_DIR}/README.md" <<'EOF'
# Royal System — Throne Protocol V3.0

Backend: Railway  
Frontend: Vercel  
Repo: GitHub  
Email infra: Resend  
Auth: RSA-4096 (Royal Key)

## Deploy
1) Railway: set secrets
2) GitHub push
3) Vercel deploy
4) DNS: verificar
5) Test: /api/health

## Estructura
backend/
web/
Dockerfile
.github/workflows/deploy.yml

## Certificado
web/public/certificado-royal.png
EOF

echo "Estructura creada en ./${ROOT_DIR}"
echo "Ahora puedes: cd ${ROOT_DIR} && git init && git add . && git commit -m 'initial royal' && git push origin main"
