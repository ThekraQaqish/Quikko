const admin = require("firebase-admin");
const serviceAccount = require("../../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://qwikko-b7ace.firebaseio.com"
});

const db = admin.firestore();

const saveToFirebase = async (message) => {
  const chatId = `chat_${message.sender_id}_${message.receiver_id}`;
  const docRef = db.collection('chats').doc(chatId).collection('messages').doc();
  await docRef.set({
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    message: message.message,
    read_status: message.read_status,
    created_at: message.created_at
  });
};
module.exports = { db, saveToFirebase };


