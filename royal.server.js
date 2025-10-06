import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 Royal Server Online — Beast Mode Activated");
});

// 🦾 Endpoint IA
app.post("/api/ask", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: process.env.MODEL_ID || "gpt-4",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error("🔥 Royal Server Error:", error.response?.data || error);
    res.status(500).json({ error: "Error en Royal Server" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🟢 Royal Beast corriendo en puerto ${PORT}`);
});
