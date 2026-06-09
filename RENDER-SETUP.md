# RENDER DEPLOYMENT STEP-BY-STEP

## 🚀 Complete Setup Guide for SER27-BOT-24/7 ADVANCED

---

## Step 1: Connect GitHub to Render

1. Go to **https://render.com**
2. Sign in with GitHub (or create account)
3. Click **New → Web Service**
4. Select **GitHub** as repository source
5. Connect your GitHub account
6. Select repository: **contacto-cmd/streetemporioroyal-site**

---

## Step 2: Configure Service

### Basic Settings:
- **Name:** `ser27-bot-advanced`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node ser27-bot-advanced.js`
- **Plan:** Standard ($7/month) or higher

### Advanced Settings:
- **Auto-deploy:** ON (auto-deploy on GitHub push)
- **Health Check Path:** `/status`
- **Health Check Interval:** 30s
- **Startup Failure Threshold:** 10

---

## Step 3: Add Environment Variables

In Render Dashboard:

1. Go to **Environment** tab
2. Add each variable from `.env.advanced.example`:

### Critical Variables (Get these first):

```
GITHUB_TOKEN=ghp_XXXXXXXXXXXX
GITHUB_WEBHOOK_SECRET=abcd1234efgh5678ijkl9012mnop3456
ANTHROPIC_API_KEY=sk_XXXXXXXXXXXX
AIRTABLE_API_TOKEN=patXXXXXXXXXXXXXX
AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### Deployment API Tokens:

```
RAILWAY_TOKEN=XXXXXXXXXXXX
RAILWAY_PROJECT_ID=XXXXXXXXXXXX
VERCEL_TOKEN=XXXXXXXXXXXX
VERCEL_PROJECT_ID=XXXXXXXXXXXX
VERCEL_ORG_ID=XXXXXXXXXXXX
RENDER_API_KEY=rndXXXXXXXXXXXXXX
RENDER_SERVICE_ID=XXXXXXXXXXXX
CLOUDFLARE_API_TOKEN=XXXXXXXXXXXX
CLOUDFLARE_ACCOUNT_ID=XXXXXXXXXXXX
CLOUDFLARE_ZONE_ID=XXXXXXXXXXXX
```

### Twilio WhatsApp:

```
TWILIO_ACCOUNT_SID=ACXXXXXXXXXXXX
TWILIO_AUTH_TOKEN=XXXXXXXXXXXX
TWILIO_WHATSAPP_FROM=+14155238886
TWILIO_WHATSAPP_TO=+526611149896
```

### Application:

```
NODE_ENV=production
PORT=3000
```

---

## Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Clone repository
   - Install dependencies
   - Start service
   - Assign URL: `https://ser27-bot-advanced.onrender.com`

Monitor deployment in **Logs** tab

---

## Step 5: Setup GitHub Webhook

Once deployed, Render gives you a URL:
```
https://ser27-bot-advanced.onrender.com/webhook/github
```

### In GitHub Repository:

1. Go to **Settings → Webhooks → Add webhook**
2. **Payload URL:** `https://ser27-bot-advanced.onrender.com/webhook/github`
3. **Content type:** `application/json`
4. **Secret:** Paste your `GITHUB_WEBHOOK_SECRET`
5. **Events:** Select "Let me select individual events"
   - ✅ Pushes
   - ✅ Pull requests
   - ✅ Releases

6. Click **Add webhook**

---

## Step 6: Test Everything

### Test 1: Health Check

```bash
curl https://ser27-bot-advanced.onrender.com/status
```

Expected response:
```json
{
  "bot_name": "SER27-BOT-24/7-ADVANCED",
  "version": "2.0-ENTERPRISE",
  "status": "ACTIVE",
  "features": [...],
  "integrations": {...}
}
```

### Test 2: Comprehensive Analysis

```bash
curl -X POST https://ser27-bot-advanced.onrender.com/test/comprehensive
```

### Test 3: Check WhatsApp

You should receive a message at **6611149896** from Twilio

### Test 4: Verify Airtable

Check your Airtable base → **Deployments** table (should have a test record)

---

## Step 7: Monitor Deployment

### Real-time Logs:

In Render Dashboard → **Logs** tab, you'll see:

```
╔════════════════════════════════════════════════════════════╗
║  🤖 SER27-BOT-24/7 ADVANCED INTELLIGENCE SYSTEM            ║
║  Version: 2.0 ENTERPRISE (Claude AI Powered)              ║
║  Listening on port 3000                                    ║
║  Status: 🟢 PRODUCTION ACTIVE                              ║
╚════════════════════════════════════════════════════════════╝
```

### Check Deployment Status:

```
Services → ser27-bot-advanced → Status
```

Should show: **Live** ✅

---

## Step 8: Keep Service Running 24/7

### Enable Cron Jobs (optional):

In `render-advanced.yaml`, bot includes auto-health checks every 5 minutes.

### Auto-Restart on Failure:

Render automatically restarts failed services.

### Monitor Uptime:

Render dashboard shows 99.9% uptime guarantee.

---

## Step 9: Scaling (if needed)

1. Go to **Settings**
2. Increase **Plan** to Professional ($12/month)
3. Enable **Auto-scaling** for high traffic

---

## 🔄 Integration Flow

```
GitHub Push
    ↓
Webhook triggers
    ↓
ser27-bot-advanced (Render)
    ↓
Claude AI Analysis
    ↓
DevSecOps Scan
    ↓
HPCA Performance
    ↓
├─→ Deploy to Railway
├─→ Deploy to Vercel
├─→ Deploy to Render
├─→ Deploy to Cloudflare
    ↓
Log to Airtable
    ↓
Send WhatsApp to 6611149896
    ↓
Complete ✅
```

---

## 🐛 Troubleshooting

### Bot not starting?
- Check logs: Render Dashboard → Logs
- Verify `NODE_ENV=production`
- Ensure `node ser27-bot-advanced.js` command

### Webhook not triggering?
- Check GitHub Webhook deliveries
- Verify secret matches
- Test with: `curl -X POST https://your-render-url/webhook/github`

### AI not analyzing?
- Verify `ANTHROPIC_API_KEY` is valid
- Check Claude API status
- Test with: `curl https://your-render-url/test/comprehensive`

### Deployments not happening?
- Verify all platform tokens (Railway, Vercel, Render, Cloudflare)
- Check Render logs for API errors
- Test manual deploy endpoint

### Airtable not logging?
- Verify `AIRTABLE_API_TOKEN` and `AIRTABLE_BASE_ID`
- Check Airtable base exists and has required tables
- Test with: `curl https://your-render-url/airtable/deployments`

### WhatsApp not working?
- Verify Twilio credentials
- Check WhatsApp is enabled in Twilio
- Verify phone number format: `+526611149896`

---

## ✅ Final Checklist

- [ ] Render account created
- [ ] GitHub connected
- [ ] Service deployed successfully
- [ ] Environment variables added
- [ ] GitHub webhook created
- [ ] Health check passing
- [ ] Claude AI responding
- [ ] Airtable logging working
- [ ] WhatsApp notifications received
- [ ] All platforms deployed successfully

---

**🎉 Your SER27-BOT-24/7 ADVANCED is now LIVE and OPERATIONAL!**

**Monitor Status:** https://render.com/dashboard  
**View Logs:** https://render.com/dashboard/web/ser27-bot-advanced/logs  
**Airtable Dashboard:** https://airtable.com/app[BASE_ID]
