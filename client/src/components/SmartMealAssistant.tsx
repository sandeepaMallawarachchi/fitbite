"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Image, Send, ArrowDown } from "lucide-react";
import { marked } from "marked";

const SmartMealAssistant = () => {
    const [message, setMessage] = useState("");
    const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const formData = JSON.parse(localStorage.getItem("formData") || "{}");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    console.log(formData)

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/chat/getMessages/${user.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setChatHistory(res.data);
            } catch (error) {
                console.error("Failed to load chat history", error);
            }
        };
        fetchChatHistory();
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { role: "user", content: message };
        setChatHistory((prev) => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            await axios.post("http://localhost:5000/chat/saveMessage", {
                userId: user.id,
                role: "user",
                content: message
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const res = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4-1106-preview",
                    messages: [
                        {
                            role: "system",
                            content: `
                            You are a professional smart meal tracking assistant helping a fitness client stay on track with their goals.

                            Here is the user's full profile (use this for answering if relevant):
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

                            The user will give food items and their portion sizes. You are provided with:
                            - Pre-processed food names and quantities (in grams).
                            - A food-to-macros dictionary (per 100g).
                            - Current daily total of calories, protein, carbs, and fat.
                            - Target daily macros for calories, protein, carbs, and fat.

                            Your task is to:
                            1. Calculate total macros for each food item by scaling values based on portion size.
                            2. Show total for the meal.
                            3. Update the daily totals.
                            4. Provide friendly, goal-based suggestions.
                            5. Respond based on system mode: "meal_breakdown", "daily_update", or "suggestion".

                            Always use markdown formatting.
                            Examples:
                            **Meal Breakdown**
                            • White Rice (100g) – 130 kcal (28g carbs, 2.5g protein, 0.3g fat)
                            ...
                            **Total for this Meal:**  
                            Calories: X kcal  
                            Carbs: Xg  
                            Protein: Xg  
                            Fat: Xg

                            Let me know when you're ready for the daily update.
                        `
                        },
                        {
                            role: "user",
                            content: message
                        }
                    ],
                    temperature: 0.7
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                        "Content-Type": "application/json"
                    }
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
                    axios.post("http://localhost:5000/chat/saveMessage", {
                        userId: user.id,
                        role: "assistant",
                        content: fullText
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
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

    return (
        <section className={`flex flex-col w-full max-w-4xl mx-auto px-4 py-6 h-[calc(95vh-100px)] transition-all duration-300 ${chatHistory.length || loading ? "justify-between" : "justify-center"}`}>
            <h1 className="md:text-2xl text-lg font-semibold mb-6 text-black text-center">
                Let's start tracking...
            </h1>

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
                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === "user" ? "text-black self-end text-right" : "text-gray-700"}`}
                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.content) }}
                            />
                        ))}
                        {loading && (
                            <div className="text-sm text-gray-500 text-center">Analyzing...</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {chatHistory.length > 0 && (
                <div
                    className="absolute bottom-44 left-1/2 z-20"
                    style={{ transform: "translateX(-50%) translateX(50px)" }}
                >                    <button
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

            <form
                onSubmit={handleSend}
                className="w-full bg-white p-4 rounded-3xl shadow-md flex flex-col gap-4 sticky bottom-0"
            >
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
        </section>
    );
};

export default SmartMealAssistant;