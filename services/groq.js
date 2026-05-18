const fetch = require("node-fetch");

async function extractDetails(message) {
  const prompt = `Extract the following from the user message:

- name
- room_type

Rules:
- name = person name if mentioned
- room_type = things like "AC single", "AC sharing", "non AC", etc
- If not present, return empty string

User message:
${message}

Output ONLY JSON:

{
  "name": "",
  "room_type": ""
}`;

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0,
      }),
    });

    const data = await res.json();
    const raw = data?.choices?.[0]?.message?.content || "{}";

    // Strip markdown code fences if present
    const clean = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return {
      name: parsed.name || "",
      room_type: parsed.room_type || "",
    };
  } catch (err) {
    console.error("Groq extraction error:", err);
    return { name: "", room_type: "" };
  }
}

module.exports = { extractDetails };