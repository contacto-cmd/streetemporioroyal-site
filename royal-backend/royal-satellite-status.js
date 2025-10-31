// royal-backend/royal-satellite-status.js
import fetch from "node-fetch";

export async function royalLiveStatus() {
  const now = new Date().toISOString();
  const domain = process.env.DOMINIO_ROYAL || "api.streetemporioroyal.com";
  const correo = process.env.ROYAL_EMAIL || "contacto@streetemporioroyal.com";

  const status = {
    dominio: domain,
    fecha: now,
    energia: "ACTIVA",
    estado: "SOBERANO",
    ubicacion: "Rosarito HQ",
    satelite: "LIVE_STATUS",
  };

  // Enviar el estado a un endpoint o correo
  try {
    await fetch(`https://${domain}/api/logStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(status),
    });
    console.log(`🛰️  Satélite Royal activo → ${correo}`);
  } catch (err) {
    console.error("⚠️  Error al transmitir el estado satelital:", err);
  }
}

// Ejecutar en cuanto se levante el backend
royalLiveStatus();
