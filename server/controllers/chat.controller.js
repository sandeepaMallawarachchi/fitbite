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
