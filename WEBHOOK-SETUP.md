# 🚀 GITHUB WEBHOOK SETUP GUIDE

## Step-by-Step Instructions

### 1. Generate Webhook Secret

```bash
# Run this in your terminal
openssl rand -hex 32

# Example output:
# a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

Save this secret - you'll need it for both GitHub and your `.env` file.

---

### 2. Get Your Render Bot URL

After deploying to Render, you'll get a URL like:
```
https://ser27-bot-24-7.onrender.com
```

---

### 3. Configure GitHub Webhook

1. Go to your repository: **https://github.com/contacto-cmd/streetemporioroyal-site**
2. Click **Settings** → **Webhooks** → **Add webhook**
3. Fill in the following:

| Field | Value |
|-------|-------|
| **Payload URL** | `https://ser27-bot-24-7.onrender.com/webhook/github` |
| **Content type** | `application/json` |
| **Secret** | Paste your generated secret here |
| **Events** | Select **Let me select individual events** |

---

### 4. Select Events to Trigger

Check these boxes:
- ✅ **Pushes**
- ✅ **Pull requests**
- ✅ **Releases**
- ✅ **Commits**

---

### 5. Enable Webhook

- ✅ **Active** (check the box)
- Click **Add webhook**

---

### 6. Test the Webhook

#### Method 1: GitHub UI
1. Go to Settings → Webhooks → Your webhook
2. Scroll down to "Recent Deliveries"
3. Click the most recent one
4. Click **Redeliver** to test

#### Method 2: Manual Test
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"test": true}' \
  https://ser27-bot-24-7.onrender.com/webhook/github
```

#### Method 3: WhatsApp Test
```bash
curl -X POST \
  https://ser27-bot-24-7.onrender.com/test-whatsapp
```

Check WhatsApp at **6611149896** for response.

---

### 7. Monitor Webhook Deliveries

GitHub shows all webhook events in:
**Settings → Webhooks → [Your webhook] → Recent Deliveries**

Green ✅ = Successful  
Red ❌ = Failed  

---

## 🐛 Troubleshooting

### Webhook Not Triggering?
1. Verify **Secret** matches in GitHub and `.env`
2. Check Render deployment is **active**
3. Verify **Payload URL** is correct
4. Check Recent Deliveries for error messages

### Response Code 401?
- Secret mismatch
- Check `GITHUB_WEBHOOK_SECRET` in `.env`

### Response Code 500?
- Bot server error
- Check Render logs: `render logs ser27-bot-24-7`
- Verify all env variables are set

### WhatsApp Not Working?
- Verify `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`
- Ensure WhatsApp is enabled in Twilio
- Check `TWILIO_WHATSAPP_TO` = `+526611149896`

---

## ✅ Successful Setup Checklist

- [ ] Generated webhook secret
- [ ] Deployed to Render
- [ ] Added GitHub webhook
- [ ] Selected correct events
- [ ] Webhook is Active
- [ ] Test delivery successful
- [ ] WhatsApp notification received

---

**🎉 READY TO GO! Your bot will now automatically:**
- 🔍 Monitor commits
- 🧠 Analyze code
- 🚀 Deploy to all platforms
- 📱 Send WhatsApp updates

