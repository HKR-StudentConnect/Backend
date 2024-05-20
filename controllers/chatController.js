const chatMessages = require("../models/chatMessages");

exports.saveMessage = async (req, res) => {
    const { chatSessionId, senderId, content } = req.body;

    try {
        const message = new ChatMessage({
            chatSession: chatSessionId,
            sender: senderId,
            content: content
        });
        await message.save();
        res.status(201).json({ message: 'Message saved', data: message });
    } catch (error) {
        res.status(500).json({ message: 'Error saving message', error: error.message });
    }
};

exports.getmessages = async (req,res) => {
    try {
        const messages = await ChatMessage.find({ chatSession: req.params.sessionId }).populate('sender').sort('createdAt');
        res.json(messages);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
};

exports.createmessages = async (req,res) =>{
    const message = new ChatMessage({
        chatSession: req.body.chatSession,
        sender: req.body.sender,
        content: req.body.content
      });
    
      try {
        const newMessage = await message.save();
        res.status(201).json(newMessage);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    }

