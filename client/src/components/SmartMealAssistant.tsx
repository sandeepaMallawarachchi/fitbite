"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Image, Send, ArrowDown, ThumbsUp, ThumbsDown, EllipsisVertical } from "lucide-react";
import { marked } from "marked";

interface SmartMealAssistantProps {
    userId: string;
    userName?: string;
    readOnly?: boolean;
}

const SmartMealAssistant: React.FC<SmartMealAssistantProps> = ({ userId, userName, readOnly = false }) => {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<{ picture?: string } | null>(null);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const formData = !readOnly ? JSON.parse(localStorage.getItem("formData") || "{}") : {};
    const token = localStorage.getItem("token");
    const coachId = localStorage.getItem("coachId") ?? "";
    const resolvedUserId = formData.userId || userId;

    const fetchChatHistory = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/chat/getMessages/${resolvedUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChatHistory(res.data);
        } catch (error) {
            console.error("Failed to load chat history", error);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/user/getUserById/${resolvedUserId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUser(res.data?.userDetails || {});
        } catch (error) {
            console.error("Failed to load user data", error);
        }
    };

    useEffect(() => {
        fetchChatHistory();
        fetchUser();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { role: "user", content: message };
        setChatHistory((prev) => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            await axios.post(
                "http://localhost:5000/chat/saveMessage",
                {
                    userId: formData.userId,
                    role: "user",
                    content: message,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const res = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4-1106-preview",
                    messages: [
                        {
                            role: "system",
                            content: `
              You're a professional smart meal tracking assistant for a fitness client with the following profile:
                - Name: ${formData.name}
                - Email: ${formData.email}
                - Phone: ${formData.phone}
                - Gender: ${formData.gender}
                - Height: ${formData.height} cm
                - Weight: ${formData.weight} kg
                - Birthday: ${formData.birthday}
                - TDEE: ${formData.TDEE} kcal
                - Primary Goal: ${formData.fitnessGoal?.primaryGoal}
                - Goal Weight: ${formData.fitnessGoal?.goalWeight}
                - Progress: ${formData.fitnessGoal?.progress || "N/A"}
                - Meal Frequency: ${formData.mealHabits?.dailyMeals}
                - Dietary Preference: ${formData.dietaryDetails?.preference}
                - Medical Conditions: ${formData.medicalDetails?.medicalConditions}

                The user will log meals with food names and portion sizes.

                Respond ONLY in this exact structured format:

                1. **Meal Breakdown** – List each item with standard macros per 100g, then show the user's quantity and scaled macros (Calories, Carbs, Protein, Fat) with clear multiplication.
                2. **Total for this Meal** – Sum Calories, Carbs, Protein, Fat for the meal.
                3. **Updated Daily Totals** – Show totals so far vs daily targets (Calories, Protein, Carbs, Fat).
                4. **Remaining Calories** – Show kcal left for the day.
                5. **Suggestion** – Give 1 short, goal-based recommendation (e.g., “Add more protein to your next meal”).

                Rules:
                - Use bullet points and clean markdown formatting.
                - Perform precise calculations (show equations where relevant).
                - No extra commentary or greetings.
                - Keep suggestion to 1 sentence only.
            `,
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
            let index = 0;
            const fullText = reply;
            const typedTextRef = { current: "" };

            const typeWriter = () => {
                typedTextRef.current += fullText.charAt(index);
                index++;

                setChatHistory((prev) => {
                    const updated = [...prev];
                    if (updated[updated.length - 1]?.role === "assistant") {
                        updated[updated.length - 1].content = typedTextRef.current;
                    } else {
                        updated.push({ role: "assistant", content: typedTextRef.current });
                    }
                    return updated;
                });

                if (index < fullText.length) {
                    requestAnimationFrame(typeWriter);
                } else {
                    setLoading(false);
                    axios.post(
                        "http://localhost:5000/chat/saveMessage",
                        {
                            userId: formData.userId,
                            role: "assistant",
                            content: fullText,
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                        }
                    );
                }
            };

            requestAnimationFrame(typeWriter);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory]);

    const renderMessage = (msg: any, idx: number) => {
        const isUser = msg.role === "user";
        const userReaction = coachId
            ? msg.reactions?.[coachId] || null
            : Object.values(msg.reactions || {})[0] || null;

        const handleReaction = async (reactionType: "like" | "dislike") => {
            const newReaction = userReaction === reactionType ? null : reactionType;

            try {
                await axios.patch(
                    `http://localhost:5000/chat/reactMessage/${userId}/${idx}`,
                    { coachId, reaction: newReaction },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setChatHistory((prev) => {
                    const updated = [...prev];
                    const msgToUpdate = updated[idx];
                    if (!msgToUpdate.reactions) msgToUpdate.reactions = {};
                    if (newReaction) {
                        msgToUpdate.reactions[coachId] = newReaction;
                    } else {
                        delete msgToUpdate.reactions[coachId];
                    }
                    return updated;
                });
            } catch (err) {
                console.error("Reaction failed", err);
            }
        };

        return (
            <div key={idx} className={`flex flex-col gap-1 px-2 ${isUser ? "items-end" : "items-start"}`}>
                <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow 
                        ${isUser
                            ? "bg-white text-gray-900 rounded-br-none"
                            : "bg-[#F0F2F5] text-gray-800 rounded-bl-none"}`}
                    dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                />

                <div className="flex gap-3 mt-1">
                    {readOnly ? (
                        <>
                            <button
                                title="Helpful"
                                className='text-sm cursor-pointer transition hover:scale-110 text-[#8FE289]'
                                onClick={() => handleReaction("like")}
                            >
                                <ThumbsUp
                                    size={18}
                                    fill={userReaction === "like" ? "#8FE289" : "none"}
                                />
                            </button>
                            <button
                                title="Unhelpful"
                                className='text-sm cursor-pointer transition hover:scale-110 text-[#F87171]'
                                onClick={() => handleReaction("dislike")}
                            >
                                <ThumbsDown
                                    size={18}
                                    fill={userReaction === "dislike" ? "#F87171" : "none"}
                                />
                            </button>
                        </>
                    ) : (
                        userReaction === "like" ? (
                            <div className="flex items-center gap-1 text-[#8FE289] text-sm">
                                <ThumbsUp size={16} fill="#8FE289" />
                                <span className="text-xs">Coach marked this helpful</span>
                            </div>
                        ) : userReaction === "dislike" ? (
                            <div className="flex items-center gap-1 text-[#F87171] text-sm">
                                <ThumbsDown size={16} fill="#F87171" />
                                <span className="text-xs">Coach marked this unhelpful</span>
                            </div>
                        ) : null
                    )}
                </div>
            </div>
        );
    };

    useEffect(() => {
        if (readOnly && userId) {
            axios.patch(`http://localhost:5000/chat/mark-read/${userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
        }
    }, [readOnly, userId]);

    return (
        <section className={`flex flex-col w-full max-w-4xl mx-auto px-4 py-6 h-[calc(95vh-100px)] transition-all duration-300 ${chatHistory.length || loading ? "justify-between" : "justify-center"}`}>

            {readOnly ? (
                <div className="flex  justify-between items-center gap-4 mb-6 px-2 bg-white rounded-full shadow-md py-1">
                    <div className="flex flex-row justify-center items-center gap-4">
                        <img
                            src={user?.picture || "/avatar.webp"}
                            alt="User Avatar"
                            className="w-10 h-10 rounded-full border border-gray-300 object-cover"
                        />
                        <div className="text-sm font-medium text-gray-800">{userName}</div>
                    </div>
                    <EllipsisVertical className="text-[#898989]" />
                </div>
            ) : (

                <h1 className="md:text-2xl text-lg font-semibold mb-6 text-black text-center">
                    Let's start tracking...
                </h1>
            )}

            <AnimatePresence mode="wait">
                {(chatHistory.length || loading) && (
                    <motion.div
                        key="chat"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto mb-5 space-y-3"
                    >
                        {chatHistory.map((msg, idx) => renderMessage(msg, idx))}
                        {loading && <div className="text-sm text-gray-500 text-center">Analyzing...</div>}
                    </motion.div>
                )}
            </AnimatePresence>

            {chatHistory.length > 0 && (
                <div className="absolute bottom-44 left-1/2 z-20" style={{ transform: "translateX(-50%) translateX(50px)" }}>
                    <button
                        onClick={() => {
                            scrollRef.current?.scrollTo({
                                top: scrollRef.current.scrollHeight,
                                behavior: "smooth",
                            });
                        }}
                        className="bg-white shadow-lg cursor-pointer !rounded-full p-2 border border-gray-200 hover:bg-gray-100 transition-all"
                    >
                        <ArrowDown size={16} />
                    </button>
                </div>
            )}

            {!readOnly && (
                <form onSubmit={handleSend} className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col gap-4 sticky bottom-0">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Log your meals by typing here"
                        className="w-full outline-none placeholder-gray-400 text-gray-800 text-sm"
                    />
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex gap-2">
                            <button type="button" className="w-10 h-10 flex items-center justify-center !rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500">
                                <Mic className="w-5 h-5" />
                            </button>
                            <button type="button" className="w-10 h-10 flex items-center justify-center !rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500">
                                <Image className="w-5 h-5" />
                            </button>
                        </div>
                        {message.trim() && !loading && (
                            <button
                                type="submit"
                                className="w-10 h-10 flex items-center justify-center !rounded-full bg-[#EFEFEF] hover:bg-[#DADBDF] cursor-pointer text-gray-500"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
            )}
        </section>
    );
};

export default SmartMealAssistant;
