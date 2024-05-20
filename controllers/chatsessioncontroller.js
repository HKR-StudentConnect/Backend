const ChatSession = require('../models/ChatSession');
exports.getSessions = async (req, res) => {
  try {
    const sessions = await ChatSession.find({ participants: req.params.userId }).populate('participants');
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createSession = async (req, res) => {
  const session = new ChatSession({
    participants: req.body.participants,
    status: 'active',
    startedAt: new Date(),
  });

  try {
    const newSession = await session.save();
    res.status(201).json(newSession);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
