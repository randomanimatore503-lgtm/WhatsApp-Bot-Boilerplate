const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const webhookRouter = require("./routes/webhook");
app.use("/webhook", webhookRouter);

app.get("/", (req, res) => res.send("INYC WhatsApp Bot is running 🌿"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;