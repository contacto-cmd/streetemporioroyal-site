const express = require('express');
const path = require('path');
const app = express();

// 1. EL PUERTO: Railway usa process.env.PORT, si no hay, usa 8080
const PORT = process.env.PORT || 8080;

// 2. MIDDLEWARE: Para entender datos JSON
app.use(express.json());

// 3. ARCHIVOS ESTÁTICOS: Servir todo lo que esté en la carpeta backend-web
app.use(express.static(__dirname));

// --- TUS RUTAS REALES ---

// Ruta 1: Tu página principal (El index.html largo de 1256 líneas)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta 2: Tu tablero de control (El status.html de las luces azules)
app.get('/status', (req, res) => {
    res.sendFile(path.join(__dirname, 'status.html'));
});

// 4. API ENDPOINTS (Tus nodos QFN)
const qfnNodesManifest = [
    { id: "NODE_01", location: "Rosarito", status: "Sovereign" }
];

app.get('/api/qfn-nodes', (req, res) => {
    res.json(qfnNodesManifest);
});

// 5. ARRANCAR EL MOTOR
app.listen(PORT, () => {
    console.log(`👑 Royal Dominion Engine running on port ${PORT}`);
});
