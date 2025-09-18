const pool = require('../../config/db');
const { saveToFirebase } = require('../../infrastructure/firebase');

const getMessages = async (user1, user2) => {
  const { rows } = await pool.query(
    `SELECT * FROM chat_messages
     WHERE (sender_id=$1 AND receiver_id=$2)
        OR (sender_id=$2 AND receiver_id=$1)
     ORDER BY created_at ASC`,
    [user1, user2]
  );
  return rows;
};

const sendMessage = async (sender_id, receiver_id, message) => {
  const { rows } = await pool.query(
    `INSERT INTO chat_messages (sender_id, receiver_id, message) 
     VALUES ($1, $2, $3) RETURNING *`,
    [sender_id, receiver_id, message]
  );
  await saveToFirebase(rows[0]); // real-time update in Firebase
  return rows[0];
};

module.exports = { getMessages, sendMessage };
