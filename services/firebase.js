const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

let db;

function getDb() {
  if (!db) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines in private key from env var
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
    db = getFirestore();
  }
  return db;
}

async function getUser(sender) {
  try {
    const doc = await getDb().collection("users").doc(sender).get();
    return doc.exists ? doc.data() : null;
  } catch (err) {
    console.error("Firebase getUser error:", err);
    return null;
  }
}

async function setUser(sender, data) {
  try {
    await getDb().collection("users").doc(sender).set(data, { merge: true });
  } catch (err) {
    console.error("Firebase setUser error:", err);
  }
}

module.exports = { getUser, setUser };