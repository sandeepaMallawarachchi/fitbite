"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Mic, Image, Send, ArrowDown, ThumbsUp, ThumbsDown, EllipsisVertical } from "lucide-react";
import ReactMarkdown from "react-markdown";
import CoachInput from "./CoachInput";
import DailyTrackingPanel from "./DailyTrackingPanel";

interface SmartMealAssistantProps {
    userId: string;
    userName?: string;
    readOnly?: boolean;
}

interface DailyNutrition {
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber?: number;
}

interface DailyTrackingData {
    date: string;
    totalNutrition: DailyNutrition;
    remainingTDEE: number;
    originalTDEE: number;
    meals: Array<{
        id: string;
        content: string;
        nutrition: DailyNutrition;
        timestamp: number;
    }>;
}

const SmartMealAssistant: React.FC<SmartMealAssistantProps> = ({ userId, userName, readOnly = false }) => {
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<{ picture?: string } | null>(null);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [dailyTracking, setDailyTracking] = useState<DailyTrackingData | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const formData = !readOnly ? JSON.parse(localStorage.getItem("formData") || "{}") : {};
    const token = localStorage.getItem("token");
    const coachId = localStorage.getItem("coachId") ?? "";
    const resolvedUserId = formData.userId || userId;

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0];
    };

    const initializeDailyTracking = () => {
        const today = getTodayString();
        const storedData = localStorage.getItem(`dailyTracking_${resolvedUserId}_${today}`);

        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed.date === today) {
                setDailyTracking(parsed);
                return;
            }
        }

        const newTracking: DailyTrackingData = {
            date: today,
            totalNutrition: { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 },
            remainingTDEE: formData.TDEE || 0,
            originalTDEE: formData.TDEE || 0,
            meals: []
        };

        setDailyTracking(newTracking);
        localStorage.setItem(`dailyTracking_${resolvedUserId}_${today}`, JSON.stringify(newTracking));
    };

    const updateDailyTracking = async (updatedTracking: DailyTrackingData) => {
        setDailyTracking(updatedTracking);

        localStorage.setItem(
            `dailyTracking_${resolvedUserId}_${updatedTracking.date}`,
            JSON.stringify(updatedTracking)
        );

        try {
            await axios.post(
                "http://localhost:5000/dailyTracking/saveDailyTracking",
                { userId: resolvedUserId, ...updatedTracking },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err) {
            console.error("Failed to update DB dailyTracking", err);
        }
    };

    const parseNutritionFromResponse = (response: string): DailyNutrition | null => {
        try {

            const totalMealMatch = response.match(/\*\*Total for this Meal\*\*[^]*?Calories:[^]*?(\d+(?:\.\d+)?)\s*kcal[^]*?Carbs:[^]*?(\d+(?:\.\d+)?)g[^]*?Protein:[^]*?(\d+(?:\.\d+)?)g[^]*?Fat:[^]*?(\d+(?:\.\d+)?)g/i);

            if (totalMealMatch) {
                const nutrition = {
                    calories: parseFloat(totalMealMatch[1]),
                    carbs: parseFloat(totalMealMatch[2]),
                    protein: parseFloat(totalMealMatch[3]),
                    fat: parseFloat(totalMealMatch[4]),
                    fiber: 0
                };
                return nutrition;
            }

            const updatedTotalsSection = response.match(/\*\*Updated Daily Totals\*\*[^]*?Calories:\s*\d+\s*kcal\s*\+\s*(\d+(?:\.\d+)?)\s*kcal[^]*?Carbs:\s*[\d.]+g\s*\+\s*([\d.]+)g[^]*?Protein:\s*[\d.]+g\s*\+\s*([\d.]+)g[^]*?Fat:\s*[\d.]+g\s*\+\s*([\d.]+)g/i);

            if (updatedTotalsSection) {
                const nutrition = {
                    calories: parseFloat(updatedTotalsSection[1]),
                    carbs: parseFloat(updatedTotalsSection[2]),
                    protein: parseFloat(updatedTotalsSection[3]),
                    fat: parseFloat(updatedTotalsSection[4]),
                    fiber: 0
                };
                return nutrition;
            }

            const calorieMatch = response.match(/(\d+(?:\.\d+)?)\s*(?:kcal|calories)/i);
            const carbMatch = response.match(/(\d+(?:\.\d+)?)g[^]*?carbs?/i);
            const proteinMatch = response.match(/(\d+(?:\.\d+)?)g[^]*?protein/i);
            const fatMatch = response.match(/(\d+(?:\.\d+)?)g[^]*?fat/i);

            if (calorieMatch) {
                const nutrition = {
                    calories: parseFloat(calorieMatch[1]),
                    carbs: carbMatch ? parseFloat(carbMatch[1]) : 0,
                    protein: proteinMatch ? parseFloat(proteinMatch[1]) : 0,
                    fat: fatMatch ? parseFloat(fatMatch[1]) : 0,
                    fiber: 0
                };
                return nutrition;
            }

        } catch (error) {
            console.error("Error parsing nutrition:", error);
        }
        return null;
    };

    const findExistingMeal = (messageContent: string): string | null => {
        if (!dailyTracking) return null;

        const editKeywords = ['change', 'edit', 'update', 'actually', 'correction', 'instead'];
        const hasEditKeyword = editKeywords.some(keyword =>
            messageContent.toLowerCase().includes(keyword)
        );

        if (hasEditKeyword && dailyTracking.meals.length > 0) {
            return dailyTracking.meals[dailyTracking.meals.length - 1].id;
        }

        return null;
    };

    const fetchChatHistory = async () => {
        try {
            const res = await axios.get(`https://fitbite-roan.vercel.app/chat/getMessages/${resolvedUserId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setChatHistory(res.data);
        } catch (error) {
            console.error("Failed to load chat history", error);
        }
    };

    const fetchUser = async () => {
        try {
            const res = await axios.get(`https://fitbite-roan.vercel.app/user/getUserById/${resolvedUserId}`, {
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
        initializeDailyTracking();
    }, []);

    useEffect(() => {
        const checkForNewDay = () => {
            if (dailyTracking && dailyTracking.date !== getTodayString()) {
                initializeDailyTracking();
            }
        };

        const interval = setInterval(checkForNewDay, 60000);
        return () => clearInterval(interval);
    }, [dailyTracking]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !dailyTracking) return;

        const userMsg = { role: "user", content: message };
        setChatHistory((prev) => [...prev, userMsg]);
        const currentMessage = message;
        setMessage("");
        setLoading(true);

        try {
            await axios.post(
                "https://fitbite-roan.vercel.app/chat/saveMessage",
                {
                    userId: formData.userId,
                    role: "user",
                    content: currentMessage,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const systemPrompt = `
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

                CURRENT DAILY TOTALS (so far today):
                - Calories: ${dailyTracking.totalNutrition.calories} kcal
                - Carbs: ${dailyTracking.totalNutrition.carbs}g
                - Protein: ${dailyTracking.totalNutrition.protein}g  
                - Fat: ${dailyTracking.totalNutrition.fat}g
                - Remaining TDEE: ${dailyTracking.remainingTDEE} kcal

                The user will log meals with food names and portion sizes.

                Respond ONLY in this exact structured format:

                1. **Meal Breakdown** – List each item with standard macros per 100g, then show the user's quantity and scaled macros (Calories, Carbs, Protein, Fat) with clear multiplication.
                2. **Total for this Meal** – Sum Calories, Carbs, Protein, Fat for the meal.
                3. **Updated Daily Totals** – Show totals so far vs daily targets (Calories, Protein, Carbs, Fat).
                4. **Remaining Calories** – Show kcal left for the day.
                5. **Suggestion** – Give 1 short, goal-based recommendation (e.g., "Add more protein to your next meal").

                Rules:
                - Use bullet points and clean markdown formatting.
                - Perform precise calculations (show equations where relevant).
                - No extra commentary or greetings.
                - Keep suggestion to 1 sentence only.
                - When showing Updated Daily Totals, add the new meal to existing totals.

                CRITICAL TRACKING REQUIREMENTS:
                - Always calculate and display the EXACT remaining TDEE calories after subtracting this meal
                - Maintain running totals for protein, carbs, and fat throughout the entire day
                - Show cumulative progress toward daily macro targets in Updated Daily Totals
                - Ensure all calculations are mathematically accurate and consistent
                - Track and preserve nutritional data across all meals for continuous monitoring
            `;

            const res = await axios.post(
                "https://api.openai.com/v1/chat/completions",
                {
                    model: "gpt-4-1106-preview",
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt,
                        },
                        {
                            role: "user",
                            content: currentMessage,
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

                    const mealNutrition = parseNutritionFromResponse(fullText);
                    if (mealNutrition) {
                        const existingMealId = findExistingMeal(currentMessage);

                        let updatedTracking = { ...dailyTracking };

                        if (existingMealId) {
                            const existingMeal = updatedTracking.meals.find(m => m.id === existingMealId);
                            if (existingMeal) {
                                updatedTracking.remainingTDEE += existingMeal.nutrition.calories;

                                updatedTracking.totalNutrition.calories -= existingMeal.nutrition.calories;
                                updatedTracking.totalNutrition.carbs -= existingMeal.nutrition.carbs;
                                updatedTracking.totalNutrition.protein -= existingMeal.nutrition.protein;
                                updatedTracking.totalNutrition.fat -= existingMeal.nutrition.fat;

                                updatedTracking.meals = updatedTracking.meals.filter(m => m.id !== existingMealId);
                            }
                        }

                        const newMeal = {
                            id: Date.now().toString(),
                            content: currentMessage,
                            nutrition: mealNutrition,
                            timestamp: Date.now()
                        };

                        updatedTracking.meals.push(newMeal);

                        updatedTracking.totalNutrition.calories += mealNutrition.calories;
                        updatedTracking.totalNutrition.carbs += mealNutrition.carbs;
                        updatedTracking.totalNutrition.protein += mealNutrition.protein;
                        updatedTracking.totalNutrition.fat += mealNutrition.fat;

                        updatedTracking.remainingTDEE -= mealNutrition.calories;

                        updateDailyTracking(updatedTracking);
                    }

                    axios.post(
                        "https://fitbite-roan.vercel.app/chat/saveMessage",
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
        const isCoach = msg.role === "coach";
        const userReaction = coachId
            ? msg.reactions?.[coachId] || null
            : Object.values(msg.reactions || {})[0] || null;

        const handleReaction = async (reactionType: "like" | "dislike") => {
            const newReaction = userReaction === reactionType ? null : reactionType;

            try {
                await axios.patch(
                    `https://fitbite-roan.vercel.app/chat/reactMessage/${userId}/${idx}`,
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
                    className={`sm:max-w-[80%] max-w-[90%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed shadow 
                        ${isUser
                            ? "bg-white text-gray-900 rounded-br-none self-end"
                            : isCoach
                                ? "bg-blue-100 text-blue-900 rounded-bl-none self-start"
                                : "bg-[#F0F2F5] text-gray-800 rounded-bl-none self-start"}`}
                >
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>

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
            axios.patch(`https://fitbite-roan.vercel.app/chat/mark-read/${userId}`, {}, {
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
                <div className="text-center mb-6">
                    <h1 className="md:text-2xl text-lg font-semibold text-black mb-2">
                        Let's start tracking...
                    </h1>
                    {dailyTracking && (
                        <DailyTrackingPanel userId={resolvedUserId} TDEE={formData.TDEE} token={token ?? ""} tracking={dailyTracking}/>
                    )}
                </div>
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

            {!readOnly ? (
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
            ) : (
                <CoachInput
                    userId={userId}
                    token={token ?? ""}
                    onMessageSent={(msg) => setChatHistory((prev) => [...prev, msg])}
                />
            )}
        </section>
    );
};

export default SmartMealAssistant;