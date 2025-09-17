# Street Emperio Royal Bot  
Proyecto oficial conectado con GitHub, Railway y Vercel.
// server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Ruta principal
app.get("/", (req, res) => {
  res.send("🤖 Street Emperio Royal Bot está en línea 🚀");
});

// Mantener el bot vivo
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
