// Este es el código para web/api/status.js
// Actúa como un Gateway Soberano que reporta su propio estado y el del núcleo.

export default async function handler(request, response) {
  const GATEWAY_ID = "Vercel_Sovereign_Gateway";
  const startTime = Date.now(); // Inicia el cronómetro

  try {
    // Contacta al núcleo (Royal_Hub_Main en Railway) para obtener su reporte de soberanía
    const upstreamResponse = await fetch(process.env.BACKEND_URL + '/status');

    // Si el núcleo no responde correctamente, se declara una falla de sincronización
    if (!upstreamResponse.ok) {
      throw new Error(`Core Hub Sync Failure - Status ${upstreamResponse.status}`);
    }

    const coreHubReport = await upstreamResponse.json();
    const latency = Date.now() - startTime; // Calcula la latencia de la conexión

    // Envía un reporte completo que incluye el estado del Gateway y el reporte del núcleo
    response.status(200).json({
      gateway_id: GATEWAY_ID,
      gateway_status: "Operational",
      connection_latency_ms: latency,
      timestamp_utc: new Date().toISOString(),
      core_hub_report: coreHubReport, // Anida el reporte completo del núcleo
      message: "Gateway y Core Hub sincronizados. Soberanía confirmada."
    });

  } catch (error) {
    // En caso de fallo, el Gateway reporta una pérdida de conexión
    response.status(500).json({
      gateway_id: GATEWAY_ID,
      gateway_status: "Error",
      system_status: "Quantum Decoherence Detected",
      timestamp_utc: new Date().toISOString(),
      error_details: error.message,
      message: "Conexión con Royal_Hub_Main perdida. A la espera de re-sincronización."
    });
  }
}

