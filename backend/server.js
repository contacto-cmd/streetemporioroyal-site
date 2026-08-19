// backend/server.js
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const redis = require("redis");
const { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const app = express();
app.use(express.json());

// Vercel and Cloudflare can send API traffic as /api/*; keep the local
// Express routes defined once while accepting both /health and /api/health.
app.use((req, _res, next) => {
  if (req.url === "/api") {
    req.url = "/";
  } else if (req.url.startsWith("/api/")) {
    req.url = req.url.slice(4);
  }
  next();
});

app.use(express.static(__dirname));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// ============================================
// CONFIGURACIÓN: PostgreSQL
// ============================================
const pgPool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

if (pgPool) {
  pgPool.on("error", (err) => {
    console.error("PostgreSQL error:", err);
  });
}

function dbQuery(...args) {
  if (!pgPool) {
    throw new Error("DATABASE_URL is not configured");
  }
  return pgPool.query(...args);
}

// ============================================
// CONFIGURACIÓN: Redis
// ============================================
const redisClient = process.env.REDIS_URL
  ? redis.createClient({ url: process.env.REDIS_URL })
  : null;

if (redisClient) {
  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  redisClient.connect().catch(console.error);
}

function getRedisClient() {
  if (!redisClient) {
    throw new Error("REDIS_URL is not configured");
  }
  return redisClient;
}

// ============================================
// CONFIGURACIÓN: S3 (AWS SDK v3)
// ============================================
const bucketName = process.env.BUCKET_NAME || process.env.AWS_S3_BUCKET;
const bucketRegion = process.env.BUCKET_REGION || process.env.AWS_REGION || "us-east-1";
const bucketEndpoint = process.env.BUCKET_ENDPOINT;
const bucketAccessKey = process.env.BUCKET_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
const bucketSecretKey = process.env.BUCKET_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

const s3Client = new S3Client({
  region: bucketRegion,
  endpoint: bucketEndpoint,
  credentials: bucketAccessKey && bucketSecretKey
    ? {
        accessKeyId: bucketAccessKey,
        secretAccessKey: bucketSecretKey
      }
    : undefined
});

// ============================================
// HEALTH CHECK
// ============================================
app.get("/health", async (req, res) => {
  const checks = {
    postgres: "not_configured",
    redis: "not_configured",
    s3: bucketName ? "configured" : "not_configured"
  };

  try {
    if (pgPool) {
      const pgResult = await dbQuery("SELECT NOW()");
      checks.postgres = pgResult.rows[0].now ? "connected" : "error";
    }

    if (redisClient) {
      const redisTest = await getRedisClient().ping();
      checks.redis = redisTest === "PONG" ? "connected" : "error";
    }

    const requiredChecks = [checks.postgres, checks.redis];
    const healthy = requiredChecks.every((check) => check === "connected" || check === "not_configured");

    res.status(healthy ? 200 : 500).json({
      status: healthy ? "healthy" : "unhealthy",
      timestamp: new Date().toISOString(),
      ...checks
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      ...checks
    });
  }
});

// ============================================
// ENDPOINTS: Estado vivo
// ============================================
app.get("/dominionLiveState", async (req, res) => {
  try {
    // Guardar en Redis
    await getRedisClient().set("lastState", JSON.stringify({
      status: "ACTIVE_MOBILE",
      timestamp: new Date().toISOString()
    }), { EX: 3600 });

    res.json({
      status: "ACTIVE_MOBILE",
      message: "Dominio soberano activo",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS: Directiva
// ============================================
app.get("/directiva", async (req, res) => {
  try {
    // Obtener de Redis si existe
    const cached = await getRedisClient().get("directiva");
    if (cached) {
      return res.json({ source: "cache", data: JSON.parse(cached) });
    }

    // Si no, obtener de PostgreSQL
    const result = await dbQuery(
      "SELECT * FROM directivas ORDER BY created_at DESC LIMIT 1"
    );

    const directiva = result.rows[0] || {
      content: "// DIRECTIVA SOBERANA // Dominio protegido y optimizado."
    };

    // Guardar en Redis
    await getRedisClient().set("directiva", JSON.stringify(directiva), { EX: 3600 });

    res.json({ source: "database", data: directiva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/buildDirectiva", async (req, res) => {
  try {
    const { content } = req.body;

    // Guardar en PostgreSQL
    const result = await dbQuery(
      "INSERT INTO directivas (content) VALUES ($1) RETURNING *",
      [content]
    );

    // Invalidar cache
    await getRedisClient().del("directiva");

    res.json({
      directiva: "Directiva creada",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS: Archivos (S3)
// ============================================
app.post("/upload", async (req, res) => {
  try {
    const { filename, content } = req.body;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: filename,
      Body: content,
      ContentType: "application/octet-stream"
    });

    await s3Client.send(command);

    // Guardar referencia en PostgreSQL
    await dbQuery(
      "INSERT INTO files (filename, bucket_key) VALUES ($1, $2)",
      [filename, filename]
    );

    res.json({
      status: "uploaded",
      filename,
      bucket: bucketName
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/files", async (req, res) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName
    });

    const response = await s3Client.send(command);

    res.json({
      files: response.Contents || [],
      count: response.Contents?.length || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/download/:filename", async (req, res) => {
  try {
    const { filename } = req.params;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: filename
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    res.json({
      filename,
      downloadUrl: url,
      expiresIn: 3600
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS: Eventos
// ============================================
app.post("/logEvent", async (req, res) => {
  try {
    const { event_type, data } = req.body;

    // Guardar en PostgreSQL
    const result = await dbQuery(
      "INSERT INTO events (event_type, data) VALUES ($1, $2) RETURNING *",
      [event_type, JSON.stringify(data)]
    );

    // Guardar en Redis (últimos 100 eventos)
    await getRedisClient().lPush("events", JSON.stringify(result.rows[0]));
    await getRedisClient().lTrim("events", 0, 99);

    res.json({
      status: "logged",
      event: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/events", async (req, res) => {
  try {
    // Obtener de Redis
    const events = await getRedisClient().lRange("events", 0, -1);

    res.json({
      events: events.map(e => JSON.parse(e)),
      count: events.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS: Discord (mantener compatibilidad)
// ============================================
app.post("/notifyDiscord", async (req, res) => {
  try {
    const { texto } = req.body;

    // Guardar en PostgreSQL
    await dbQuery(
      "INSERT INTO notifications (type, content) VALUES ($1, $2)",
      ["discord", texto]
    );

    console.log("Notificando a Discord:", texto);

    res.json({
      status: "sent",
      texto,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/royal_push_directiva", async (req, res) => {
  try {
    // Obtener última directiva
    const result = await dbQuery(
      "SELECT * FROM directivas ORDER BY created_at DESC LIMIT 1"
    );

    res.json({
      status: "pushed",
      target: "Discord",
      directiva: result.rows[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ENDPOINTS: Compatibilidad
// ============================================
app.post("/sendJSON", (req, res) => {
  res.json(req.body);
});

// ============================================
// INICIALIZACIÓN DE BASE DE DATOS
// ============================================
async function initializeDatabase() {
  try {
    // Crear tabla: directivas
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS directivas (
        id SERIAL PRIMARY KEY,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla: files
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        bucket_key VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla: events
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        event_type VARCHAR(100) NOT NULL,
        data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Crear tabla: notifications
    await dbQuery(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Base de datos inicializada");
  } catch (error) {
    console.error("❌ Error inicializando base de datos:", error);
  }
}

// ============================================
// INICIO DEL SERVIDOR
// ============================================
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Servidor soberano corriendo en puerto ${PORT}`);
      console.log(`📊 PostgreSQL: ${process.env.DATABASE_URL ? "✅" : "❌"}`);
      console.log(`🔴 Redis: ${process.env.REDIS_URL ? "✅" : "❌"}`);
      console.log(`📦 S3: ${bucketName ? "✅" : "❌"}`);
    });
  } catch (error) {
    console.error("❌ Error iniciando servidor:", error);
    process.exit(1);
  }
}

if (require.main === module && !process.env.VERCEL) {
  startServer();
}

module.exports = app;
module.exports.default = app;

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM recibido, cerrando conexiones...");
  if (pgPool) {
    await pgPool.end();
  }
  if (redisClient) {
    await redisClient.quit();
  }
  process.exit(0);
});

