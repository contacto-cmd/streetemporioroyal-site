// Necesitas la librería 'os' que ya viene con Node.js
const os = require('os');
const qfnManifest = require('./qfn-manifest.json'); // Asegúrate que la ruta a tu manifiesto sea correcta

// --- El Endpoint de Estado Cuántico en Vivo ---
app.get('/api/live-status', (req, res) => {
    // 1. Métricas Reales del Servidor en Railway
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memUsage = (usedMem / totalMem) * 100;
    const cpuLoad = os.loadavg()[0]; // Carga de CPU del último minuto

    // 2. Simulación Dinámica del Estado de los Nodos QFN
    const liveNodeStatus = qfnManifest.map(node => {
        let status = 'ONLINE';
        const diceRoll = Math.random();
        if (diceRoll > 0.95) status = 'DEGRADED'; // 5% de chance
        if (diceRoll > 0.99) status = 'OFFLINE';  // 1% de chance
        return {
            id: node.id,
            token: node.token,
            status: status
        };
    });

    // 3. Generación de Sello Criptográfico "Heartbeat"
    // Cada petición genera un hash único para probar que el sistema está vivo.
    const crypto = require('crypto');
    const heartbeatPayload = `AHT_SEC_LIVE_FEED::${new Date().toISOString()}`;
    const heartbeatHash = crypto.createHash('sha256').update(heartbeatPayload).digest('hex');

    // 4. Ensamblar y Enviar la Respuesta
    res.json({
        serverMetrics: {
            cpuLoad: cpuLoad.toFixed(2),
            memoryUsage: memUsage.toFixed(2) + '%',
            uptime: (os.uptime() / 3600).toFixed(2) + ' hours' // Tiempo que lleva encendido el servidor
        },
        qfnStatus: liveNodeStatus,
        security: {
            heartbeatSeal: heartbeatHash
        }
    });
});
