// src/modules/chat/chatService.js
const ChatModel = require('./chatModel');
const { saveToFirebase } = require('../../infrastructure/firebase');

/**
 * @module ChatService
 * @desc Handles business logic for chat messages, integrating database operations with Firebase real-time updates.
 */

/**
 * @function getMessages
 * @desc Retrieves all chat messages between two users.
 *
 * @param {string|number} user1 - ID of the first user
 * @param {string|number} user2 - ID of the second user
 * @returns {Promise<Array<Object>>} Array of chat message objects
 *
 * @example
 * const messages = await ChatService.getMessages(1, 2);
 * console.log(messages);
 */
exports.getMessages = async (user1, user2) => {
  return await ChatModel.getAllMessages(user1, user2);
};

/**
 * @function sendMessage
 * @desc Sends a new chat message from one user to another.
 *       Saves it in PostgreSQL and triggers a Firebase real-time update.
 *
 * @param {string|number} sender_id - ID of the sender
 * @param {string|number} receiver_id - ID of the receiver
 * @param {string} message - Message content
 * @returns {Promise<Object>} The newly created chat message object
 *
 * @example
 * const newMessage = await ChatService.sendMessage(1, 2, "Hello!");
 * console.log(newMessage);
 */
exports.sendMessage = async (sender_id, receiver_id, message) => {
  const chatMessage = await ChatModel.createMessage(sender_id, receiver_id, message);
  await saveToFirebase(chatMessage); // Trigger real-time update in Firebase
  return chatMessage;
};
