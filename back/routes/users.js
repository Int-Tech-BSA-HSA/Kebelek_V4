var express = require('express');
var router = express.Router();
const Chat = require('../models/Chat');
const jwt = require('jsonwebtoken');

// <-- TOKEN VERIFICATION MIDDLEWARE -->
router.use((req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - Bearer token missing' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Replace "YOUR_SECRET_HERE" with your actual JWT secret or process.env.JWT_SECRET
    const decoded = jwt.verify(token, 'YOUR_SECRET_HERE');
    // e.g., your JWT might embed userId: ...
    // So we attach that to req.user
    if (!decoded.userId) {
      return res.status(400).json({ error: 'Token invalid - no userId' });
    }
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden - invalid token' });
  }
});

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// Save a new chat
router.post('/chats', async (req, res) => {
  try {
    const userId = req.user._id;  // NOW DEFINED thanks to the JWT middleware
    const { chatName, chatContent } = req.body;

    const newChat = new Chat({ userId, chatName, chatContent });
    await newChat.save();
    return res.status(201).json({ message: 'Chat saved successfully', chat: newChat });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/chats', async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
    return res.json(chats);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/chats/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.id;
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    return res.json(chat);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/chats/:id', async (req, res) => {
  try {
    const userId = req.user._id;
    const chatId = req.params.id;
    const deleted = await Chat.findOneAndDelete({ _id: chatId, userId });
    if (!deleted) {
      return res.status(404).json({ error: 'Chat not found or not authorized' });
    }
    return res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
