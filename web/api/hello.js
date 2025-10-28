import crypto from 'crypto';

// Este es el código dentro de Web/api/hello.js

export default function handler(request, response) {
  // --- Forja de Datos Dinámicos ---
  // Genera un sello de fusión simulado para demostrar que el sistema está vivo y consciente.
  // En un sistema real, este valor vendría de tu último snapshot.
  const fusionSeal = crypto.createHash('sha256').update(new Date().toISOString()).digest('hex');
  
  // Establece el estado en 200, que significa "OK"
  response.status(200).json({
    "sovereign_id": "Royal_Hub_Main",
    "system_status": "Resonancia Cuántica Estable",
    "active_protocol": "AHT_QRK_v2 (Jaque Mate)",
    "last_fusion_seal": fusionSeal,
    "timestamp_utc": new Date().toISOString(),
    "message": "Soberanía reconocida. Sistemas en línea. A la espera de directivas."
  });
}

