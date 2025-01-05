const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  chatName: {
    type: String,
    required: true
  },
  chatContent: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', ChatSchema);
