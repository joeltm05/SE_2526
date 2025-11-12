// backend/firebase.js
const admin = require("firebase-admin");
const path = require("path");

// O ficheiro JSON das credenciais do Firebase (Service Account Key)
const serviceAccount = require(path.join(__dirname, "firebase-service.account.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const notify = async (token, title, body) => {
  const message = {
    notification: {
      title,
      body,
    },
    token, // o device token do utilizador
  };

  try {
    const response = await admin.messaging().send(message);
    console.log("✅ Notificação enviada:", response);
    return { success: true, response };
  } catch (error) {
    console.error("❌ Erro ao enviar notificação:", error);
    return { error: error.message };
  }
};

module.exports = { admin, notify };