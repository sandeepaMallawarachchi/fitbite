const User = require('../models/User');
const Fitness = require('../models/FitnessDetails');
const ChatHistory = require('../models/ChatHistory');

exports.saveMessage = async (req, res) => {
    const { userId, role, content } = req.body;
    try {
        let chat = await ChatHistory.findOne({ userId });
        if (!chat) {
            chat = new ChatHistory({ userId, messages: [] });
        }

        chat.messages.push({ role, content });
        await chat.save();

        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMessages = async (req, res) => {
    const { userId } = req.params;

    try {
        const chat = await ChatHistory.findOne({ userId });
        res.json(chat?.messages || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.reactMessage = async (req, res) => {
    const { userId, messageIndex } = req.params;
    const { coachId, reaction } = req.body;

    try {
        const chat = await ChatHistory.findOne({ userId });
        if (!chat) return res.status(404).json({ error: "Chat not found" });

        const msg = chat.messages[messageIndex];
        if (!msg) return res.status(404).json({ error: "Message not found" });

        if (!["like", "dislike", null].includes(reaction)) {
            return res.status(400).json({ error: "Invalid reaction" });
        }

        if (reaction) {
            msg.reactions.set(coachId, reaction);
        } else {
            msg.reactions.delete(coachId);
        }

        await chat.save();
        res.json({ success: true, reactions: msg.reactions });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markMessagesRead = async (req, res) => {
  const { userId } = req.params;

  try {
    const chat = await ChatHistory.findOne({ userId });
    if (!chat) return res.status(404).json({ error: "Chat not found" });

    chat.messages.forEach((msg) => {
      if (msg.role === "user" && !msg.readByCoach) {
        msg.readByCoach = true;
      }
    });

    await chat.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
