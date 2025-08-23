"use client";
import { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";

interface CoachInputProps {
  userId: string;
  token: string;
  onMessageSent: (msg: any) => void;
}

const CoachInput: React.FC<CoachInputProps> = ({ userId, token, onMessageSent }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const coachMsg = { role: "coach", content: message };

    onMessageSent(coachMsg);
    setMessage("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:5000/chat/saveMessage",
        { userId, role: "coach", content: coachMsg.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to send coach message", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col gap-4 sticky bottom-0">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Send a message as coach..."
        className="w-full outline-none placeholder-gray-400 text-gray-800 text-sm"
      />
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="w-10 h-10 flex items-center justify-center !rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

export default CoachInput;
