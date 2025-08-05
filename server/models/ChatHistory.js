const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  role: { type: String, enum: ["user", "assistant"], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reactions: {
    type: Map,
    of: String,
    default: {}
  },
  readByCoach: { type: Boolean, default: false }
});

const chatHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  messages: [messageSchema]
});

module.exports = mongoose.model("ChatHistory", chatHistorySchema);