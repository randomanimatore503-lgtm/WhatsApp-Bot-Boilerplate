const { getUser, setUser } = require("../services/firebase");
const { sendWhatsApp } = require("../services/whatsapp");
const { extractDetails } = require("../services/groq");
const { sendEmail } = require("../services/email");

const WELCOME_MESSAGE = `Welcome to Ipcowala Naturopathy & Yoga Centre ðŸŒ¿

Rooms & Prices:
Ananda (single): â‚¹3800/day
Ananda (sharing): â‚¹3400/day

Sattva (single): â‚¹2400/day

Swastha (AC-single): â‚¹2300/day  
Swastha (AC-sharing): â‚¹2000/day  
Swastha (non-AC-single): â‚¹1900/day
Swastha (non-AC-sharing): â‚¹1600/day

Arogya: â‚¹1300/day

*Registration + consultation charges â‚¹1100*

Includes stay, food, yoga & treatments.

Which type of room would you like? (AC/non-AC/single/sharing)

Also please share your Name, Room type and Age.

example: Rahul, 45, AC

*this is an automated reply*

For further inquiry
Call/WhatsApp: +91 72111 12814
Website: https://jagajinaturopathy.com`;

const THANK_YOU_MESSAGE = `Thank you! Your inquiry has been received. Our team will contact you shortly.

*this is an automated reply*

For further inquiry:
Call/WhatsApp: +91 72111 12814
Website: https://jagajinaturopathy.com`;

async function handleIncoming(sender, message) {
  const userData = await getUser(sender);
  const step = userData?.step || 0;

  if (step === 0) {
    // First contact â€” send welcome message
    await sendWhatsApp(sender, WELCOME_MESSAGE);
    await setUser(sender, { step: 1 });
  } else if (step === 1) {
    // Second message â€” they replied with their details
    // Extract info with Groq
    const { name, room_type } = await extractDetails(message);

    // Send thank you
    await sendWhatsApp(sender, THANK_YOU_MESSAGE);

    // Send email notification
    await sendEmail({ sender, message, name, room_type });

    // Cap at step 2 so repeat messages don't re-trigger
    await setUser(sender, { step: 2 });
  } else {
    // Step 2+ â€” already handled, just send thank you again
    await sendWhatsApp(sender, THANK_YOU_MESSAGE);
  }
}

module.exports = { handleIncoming };