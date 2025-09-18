const chatService = require('./chatService');

const getChatMessages = async (req, res) => {
  const { user1, user2 } = req.query;
  try {
    const messages = await chatService.getMessages(user1, user2);
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const postChatMessage = async (req, res) => {
  const { sender_id, receiver_id, message } = req.body;
  try {
    const newMessage = await chatService.sendMessage(sender_id, receiver_id, message);
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getChatMessages, postChatMessage };
