"use client";
import { useState } from "react";
import { Mic, Image, Send } from "lucide-react";
import axios from "axios";

const DashboardHome = () => {
    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        setLoading(true);
        try {
            const res = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4-1106-preview",
                    messages: [
                        {
                            role: "system",
                            content:
                                "You are a nutrition assistant. Parse the user's input and return a summary with total calories, protein, carbs, and fat. Then, update the daily total out of 2400 kcal, protein 93-128g, carbs 278-407g, fat 56-97g.",
                        },
                        {
                            role: "user",
                            content: message,
                        },
                    ],
                    temperature: 0.7,
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const reply = res.data.choices[0].message.content;
            setResponse(reply);
        } catch (err) {
            setResponse("⚠️ Failed to generate summary.");
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <section className="flex flex-col items-center justify-center flex-1 px-4 py-10">
            <h1 className="text-2xl font-semibold mb-8 text-black text-center">
                Let's start tracking...
            </h1>

            <div className="w-full max-w-2xl bg-white p-4 rounded-xl shadow-md flex flex-col gap-5">
                {/* Input */}
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Log your meals by typing here"
                    className="w-full outline-none placeholder-gray-400 text-gray-800 text-sm"
                />

                {/* Bottom icons and send */}
                <div className="flex flex-row justify-between items-center">
                    <div className="flex gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500">
                            <Mic className="w-5 h-5" />
                        </button>
                        <button className="p-2 rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500">
                            <Image className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={handleSend}
                        className="p-2 rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Response Section */}
            {loading ? (
                <div className="mt-6 text-sm text-gray-500">Analyzing...</div>
            ) : response ? (
                <div className="mt-6 w-full max-w-2xl bg-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap text-gray-700">
                    {response}
                </div>
            ) : null}
        </section>
    );
};

export default DashboardHome;