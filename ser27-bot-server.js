import express from 'express';
import { Octokit } from '@octokit/rest';
import twilio from 'twilio';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize APIs
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ============================================
// 🧠 DEEP THINKING ENGINE
// ============================================

class DeepThinkingAnalyzer {
  async analyzeCommit(commit) {
    const analysis = {
      timestamp: new Date().toISOString(),
      commit_sha: commit.sha.substring(0, 7),
      message: commit.commit.message,
      author: commit.commit.author.name,
      insights: []
    };

    // Parse commit message for keywords
    const msg = commit.commit.message.toLowerCase();
    
    if (msg.includes('fix') || msg.includes('bug')) {
      analysis.insights.push('🐛 BUG FIX DETECTED');
    }
    if (msg.includes('feat') || msg.includes('feature')) {
      analysis.insights.push('✨ NEW FEATURE ADDED');
    }
    if (msg.includes('perf') || msg.includes('optimize')) {
      analysis.insights.push('⚡ PERFORMANCE IMPROVEMENT');
    }
    if (msg.includes('deploy') || msg.includes('release')) {
      analysis.insights.push('🚀 DEPLOYMENT READY');
    }

    return analysis;
  }

  async scanCodeQuality(files) {
    const metrics = {
      files_changed: files.length,
      additions: files.reduce((sum, f) => sum + (f.additions || 0), 0),
      deletions: files.reduce((sum, f) => sum + (f.deletions || 0), 0),
      risk_score: 0,
      recommendations: []
    };

    // Calculate risk score
    const largeFiles = files.filter(f => (f.additions + f.deletions) > 500);
    if (largeFiles.length > 0) {
      metrics.risk_score += 30;
      metrics.recommendations.push('⚠️ Large file changes detected');
    }

    if (metrics.additions > metrics.deletions * 2) {
      metrics.risk_score += 20;
      metrics.recommendations.push('📊 More additions than deletions');
    }

    return metrics;
  }
}

// ============================================
// 🚀 DEPLOYMENT ORCHESTRATOR
// ============================================

class DeploymentOrchestrator {
  async deployToRailway() {
    try {
      const response = await fetch('https://api.railway.app/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RAILWAY_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `mutation {
            projectDeploy(input: {
              projectId: "${process.env.RAILWAY_PROJECT_ID}"
            }) {
              deployment {
                id
                status
              }
            }
          }`
        })
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async deployToVercel() {
    try {
      const response = await fetch('https://api.vercel.com/v13/deployments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectId: process.env.VERCEL_PROJECT_ID,
          production: true
        })
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }

  async deployToRender() {
    try {
      const response = await fetch(`https://api.render.com/v1/services/${process.env.RENDER_SERVICE_ID}/deploys`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RENDER_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clearCache: 'do_not_clear'
        })
      });
      return await response.json();
    } catch (error) {
      return { error: error.message };
    }
  }
}

// ============================================
// 📱 WHATSAPP NOTIFIER
// ============================================

class WhatsAppNotifier {
  async sendStatus(message, metrics = {}) {
    const fullMessage = `
🤖 SER27-BOT-24/7 STATUS
━━━━━━━━━━━━━━━━━━━━
${message}

📊 METRICS:
• Deployments: ${metrics.deployments || 0}
• Success Rate: ${metrics.success_rate || 0}%
• Response Time: ${metrics.response_time || 0}ms
• Status: ✅ ACTIVE

Timestamp: ${new Date().toISOString()}
    `.trim();

    try {
      await twilioClient.messages.create({
        body: fullMessage,
        from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
        to: `whatsapp:${process.env.TWILIO_WHATSAPP_TO}`
      });
      return { success: true };
    } catch (error) {
      console.error('WhatsApp error:', error);
      return { error: error.message };
    }
  }

  async sendAlert(alertType, details) {
    const messages = {
      'deployment_success': `✅ Deployment successful!\n${details}`,
      'deployment_failure': `❌ Deployment failed!\n${details}`,
      'security_warning': `🔒 Security issue detected!\n${details}`,
      'performance_alert': `⚡ Performance issue!\n${details}`
    };

    return this.sendStatus(messages[alertType] || details);
  }
}

// ============================================
// 📡 WEBHOOK HANDLERS
// ============================================

app.post('/webhook/github', async (req, res) => {
  const signature = req.headers['x-hub-signature-256'];
  const payload = JSON.stringify(req.body);
  
  // Verify webhook signature
  const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  
  if (signature !== digest) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const analyzer = new DeepThinkingAnalyzer();
    const orchestrator = new DeploymentOrchestrator();
    const notifier = new WhatsAppNotifier();

    if (req.body.pusher) {
      // Push event
      const commits = req.body.commits;
      
      for (const commit of commits) {
        const analysis = await analyzer.analyzeCommit(commit);
        
        // Deploy automatically
        await Promise.all([
          orchestrator.deployToRailway(),
          orchestrator.deployToVercel(),
          orchestrator.deployToRender()
        ]);

        // Notify
        await notifier.sendAlert('deployment_success', 
          `Branch: ${req.body.ref.split('/').pop()}\n${analysis.insights.join(', ')}`
        );
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 🎛️ CONTROL ENDPOINTS
// ============================================

app.post('/test-whatsapp', async (req, res) => {
  const notifier = new WhatsAppNotifier();
  const result = await notifier.sendStatus('🧪 Test message from SER27-BOT');
  res.json(result);
});

app.get('/status', (req, res) => {
  res.json({
    bot_name: 'SER27-BOT-24/7',
    status: 'ACTIVE',
    uptime: process.uptime(),
    integrations: {
      github: !!process.env.GITHUB_TOKEN,
      railway: !!process.env.RAILWAY_TOKEN,
      vercel: !!process.env.VERCEL_TOKEN,
      render: !!process.env.RENDER_API_KEY,
      twilio: !!process.env.TWILIO_ACCOUNT_SID
    },
    timestamp: new Date().toISOString()
  });
});

app.post('/deploy/manual', async (req, res) => {
  const orchestrator = new DeploymentOrchestrator();
  const notifier = new WhatsAppNotifier();

  try {
    const results = await Promise.all([
      orchestrator.deployToRailway(),
      orchestrator.deployToVercel(),
      orchestrator.deployToRender()
    ]);

    await notifier.sendAlert('deployment_success', 'Manual deployment triggered');
    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// 🚀 START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║     🤖 SER27-BOT-24/7 ACTIVATED                ║
║     Autonomous Robotic Agent Running           ║
║     Listening on port ${PORT}                      ║
║     Status: ✅ PRODUCTION ACTIVE               ║
╚════════════════════════════════════════════════╝
  `);
});

export default app;
