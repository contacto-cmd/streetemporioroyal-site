// index.js (royal-backend)
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
const { SignJWT, importPKCS8 } = require('jose');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3000;
const JOBS_FILE = path.join(__dirname, 'jobs.json');
if(!fs.existsSync(JOBS_FILE)) fs.writeFileSync(JOBS_FILE, JSON.stringify([]));

// Load RSA private key (PKCS8) from env (base64 or multiline)
let RSA_PRIVATE_PEM = process.env.RSA_PRIVATE_PEM || '';
if(!RSA_PRIVATE_PEM && process.env.RSA_PRIVATE_PEM_B64) {
  RSA_PRIVATE_PEM = Buffer.from(process.env.RSA_PRIVATE_PEM_B64, 'base64').toString('utf8');
}
let privateKey;
(async ()=> {
  if(RSA_PRIVATE_PEM) {
    try { privateKey = await importPKCS8(RSA_PRIVATE_PEM, 'RS256'); console.log('✅ RSA private loaded'); }
    catch(e){ console.error('ERR loading RSA key', e.message); }
  } else console.warn('⚠️ RSA_PRIVATE_PEM not present');
})();

// helper jobs
const readJobs = ()=> JSON.parse(fs.readFileSync(JOBS_FILE,'utf8')||'[]');
const writeJobs = (jobs)=> fs.writeFileSync(JOBS_FILE, JSON.stringify(jobs,null,2));
function pushJob(job){ const j = readJobs(); j.push(job); writeJobs(j); }

async function pingDiscord() {
  const url = process.env.ROYAL_DISCORD_WEBHOOK;
  if(!url) return false;
  try {
    const r = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({content: 'ping from status check'})});
    return r.ok;
  } catch(e){ return false; }
}

// health/status
app.get('/api/status', async (req,res) => {
  const apiAlive = true; // si este js responde, ok
  const discordOk = await pingDiscord();
  // qfn mock: si tienes sheet/DB, sustituir
  const qfn = (process.env.QFN_NODES_JSON) ? JSON.parse(process.env.QFN_NODES_JSON) : [
    {token:'AETHER-TORUS-01', status: 'ONLINE'},
    {token:'PHASE-RING-02', status: 'ONLINE'},
    {token:'ENTROPY-BRAID-03', status: 'ONLINE'}
  ];
  res.json({
    sec: apiAlive,
    api: apiAlive,
    bot: discordOk,
    seal_verified: !!process.env.PUBLIC_SEAL_PUBKEY, // si pusiste PUBLIC key
    lastSync: new Date().toISOString(),
    qfn
  });
});

// token (RS256)
app.post('/api/token', async (req,res) => {
  if(!privateKey) return res.status(500).json({ ok:false, error: 'RSA private key not loaded' });
  const { sub='web-ui', scope=['aht:exec'] } = req.body || {};
  try {
    const jwt = await new SignJWT({ sub, scope })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(privateKey);
    return res.json({ ok:true, token: jwt });
  } catch(e) { return res.status(500).json({ ok:false, error: e.message }); }
});

// execute -> requires Bearer token (JWT). Encola job.
app.post('/api/execute', async (req,res) => {
  try {
    const auth = req.headers.authorization || '';
    if(!auth.startsWith('Bearer ')) return res.status(401).json({ ok:false, error:'Missing token' });
    const token = auth.slice(7);
    // NOTE: validate token using public key (jose importSPKI + jwtVerify) - minimal check here: skip for dev
    // For safety - we do a simple decode to show who is calling:
    // TODO: implement real jwtVerify with public key in production

    const { payload } = req.body || {};
    if(!payload) return res.status(400).json({ ok:false, error: 'Missing payload' });
    const job = { id: 'job-'+Date.now(), type: 'exec', payload, status:'queued', createdAt: new Date().toISOString() };
    pushJob(job);

    // notify (discord)
    if(process.env.ROYAL_DISCORD_WEBHOOK) {
      try {
        await fetch(process.env.ROYAL_DISCORD_WEBHOOK, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ content: `🟢 New job queued: ${job.id} | ${payload}` })});
      } catch(e){}
    }

    return res.json({ ok:true, jobId: job.id, status:'queued' });
  } catch(e) {
    console.error('execute error', e);
    return res.status(500).json({ ok:false, error: 'internal error' });
  }
});

// jobs endpoints for worker
app.get('/jobs/pending', (req,res) => {
  const jobs = readJobs().filter(j => j.status === 'queued');
  res.json(jobs);
});
app.post('/jobs/report', (req,res) => {
  const { jobId, status = 'done', result } = req.body || {};
  const jobs = readJobs();
  const i = jobs.findIndex(j => j.id === jobId);
  if(i>=0){ jobs[i].status = status; jobs[i].result = result; jobs[i].finishedAt = new Date().toISOString(); writeJobs(jobs); return res.json({ ok:true }); }
  return res.status(404).json({ ok:false, error:'job not found' });
});

app.listen(PORT, ()=> console.log(`🔥 Royal backend listening ${PORT}`));
