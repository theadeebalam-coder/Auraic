import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const MODE = "gemini"; // "gemini" OR "sonar"

// ====== API KEYS ======
const GEMINI_KEY = "PASTE_GEMINI_KEY";
const SONAR_KEY = "PASTE_SONAR_KEY";

// ====== ROUTE ======
app.post("/api/ai", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    if (MODE === "gemini") {
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const d = await r.json();
      const reply = d.candidates[0].content.parts[0].text;
      return res.json({ reply });
    }

    if (MODE === "sonar") {
      const r = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${SONAR_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "sonar-small-online",
            messages: [{ role: "user", content: prompt }]
          })
        }
      );

      const d = await r.json();
      const reply = d.choices[0].message.content;
      return res.json({ reply });
    }

  } catch (e) {
    res.json({ reply: "Error from AI" });
  }
});

app.listen(3000, () => console.log("AI running"));
