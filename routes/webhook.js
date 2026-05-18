const express = require("express");
const router = express.Router();
const { handleIncoming } = require("../controllers/messageController");

// Meta webhook verification (GET)
router.get("/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified!");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Incoming WhatsApp messages (POST)
router.post("/whatsapp", async (req, res) => {
  // Acknowledge immediately so Meta doesn't retry
  res.sendStatus(200);

  try {
    const entry = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!entry) return;

    const sender = entry.from;
    const message = entry.text?.body?.trim();

    if (!sender || !message) return;

    await handleIncoming(sender, message);
  } catch (err) {
    console.error("Webhook error:", err);
  }
});

module.exports = router;