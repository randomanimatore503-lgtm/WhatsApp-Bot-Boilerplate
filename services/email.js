const { Resend } = require("resend");

let resend;
function getResend() {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
}

async function sendContactEmail({ sender }) {
  const to = process.env.NOTIFICATION_EMAIL;

  try {
    const { data, error } = await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject: `New WhatsApp Lead: +${sender}`,
      html: `
        <h2>New WhatsApp Lead 🌿</h2>
        <p>Someone just messaged the bot for the first time.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Contact</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">+${sender}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Status</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">Waiting for details (Step 1)</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Sent by INYC WhatsApp Bot
        </p>
      `,
    });

    if (error) console.error("Resend error:", error);
    else console.log("Contact email sent:", data?.id);
  } catch (err) {
    console.error("Contact email send failed:", err);
  }
}

async function sendEmail({ sender, message, name, room_type }) {
  const to = process.env.NOTIFICATION_EMAIL;

  try {
    const { data, error } = await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to,
      subject: `New Inquiry from ${name || sender}`,
      html: `
        <h2>New WhatsApp Inquiry 🌿</h2>
        <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Contact</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">+${sender}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Name</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${name || "Not provided"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Room Type</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${room_type || "Not specified"}</td>
          </tr>
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd; background: #f9f9f9;"><strong>Message</strong></td>
            <td style="padding: 8px; border: 1px solid #ddd;">${message}</td>
          </tr>
        </table>
        <p style="color: #888; font-size: 12px; margin-top: 20px;">
          Sent by INYC WhatsApp Bot
        </p>
      `,
    });

    if (error) console.error("Resend error:", error);
    else console.log("Email sent:", data?.id);
  } catch (err) {
    console.error("Email send failed:", err);
  }
}

module.exports = { sendContactEmail, sendEmail };