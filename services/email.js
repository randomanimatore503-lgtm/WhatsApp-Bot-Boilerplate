const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail({ sender, message, name, room_type }) {
  const to = process.env.NOTIFICATION_EMAIL; // your email to receive leads

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL, // e.g. "INYC Bot <noreply@yourdomain.com>"
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

module.exports = { sendEmail };