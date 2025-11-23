"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type Item = {
    id: string;
    name: string;
    amount?: string;
    grams?: string;
    kcal?: number;
};

type Meal = {
    id: string;
    title: string;
    kcal: number;
    items: Item[];
    macros: { carbs: number; protein: number; fat: number };
};

type MealPlan = {
    _id?: string;
    userId: string;
    date: string;
    totalCalories: number;
    totalCarbs: number;
    totalProtein: number;
    totalFat: number;
    meals: Meal[];
};

const API_BASE = "https://fitbite-roan.vercel.app";

export default function MealPlan() {
    const formData = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("formData") || "{}") : {};
    const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
    const userId = formData.userId || "";
    const headers = { Authorization: `Bearer ${token}` };

    const [plan, setPlan] = useState<MealPlan | null>(null);
    const [loading, setLoading] = useState(false);

    const defaultPlan = (uid: string): MealPlan => ({
        userId: uid,
        date: dayjs().format("YYYY-MM-DD"),
        totalCalories: 0,
        totalCarbs: 0,
        totalProtein: 0,
        totalFat: 0,
        meals: [
            { id: "m1", title: "Meal 1 - Breakfast", kcal: 0, items: [], macros: { carbs: 0, protein: 0, fat: 0 } },
            { id: "m2", title: "Meal 2 - Lunch", kcal: 0, items: [], macros: { carbs: 0, protein: 0, fat: 0 } },
            { id: "m3", title: "Meal 3 - Snack", kcal: 0, items: [], macros: { carbs: 0, protein: 0, fat: 0 } },
            { id: "m4", title: "Meal 4 - Dinner", kcal: 0, items: [], macros: { carbs: 0, protein: 0, fat: 0 } },
        ],
    });

    const fetchPlan = async () => {
        if (!userId || !token) return;
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/mealPlan/get/${userId}`, { headers });
            if (res.data) {
                setPlan(res.data);
            }
        } catch (err) {
            console.error("Error fetching meal plan:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId, token]);

    const topTotals = useMemo(() => {
        return {
            calories: plan?.totalCalories ?? 0,
            carbs: plan?.totalCarbs ?? 0,
            protein: plan?.totalProtein ?? 0,
            fat: plan?.totalFat ?? 0,
        };
    }, [plan]);

    if (loading) {
        return <div className="w-full p-6">Loading...</div>;
    }

    return (
        <div className="w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Daily Meal Plan</h1>

                <div className="bg-white px-4 py-2 rounded-2xl shadow flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <div className="text-sm text-gray-500">Calories:</div>
                        <div className="text-sm font-semibold text-blue-400">{topTotals.calories} kcal</div>
                        <div className="text-sm text-gray-500">Carbohydrate:</div>
                        <div className="text-sm font-semibold text-green-400">{topTotals.carbs}g</div>
                        <div className="text-sm text-gray-500">Protein:</div>
                        <div className="text-sm font-semibold text-yellow-400">{topTotals.protein}g</div>
                        <div className="text-sm text-gray-500">Fat:</div>
                        <div className="text-sm font-semibold text-[#C378DD]">{topTotals.fat}g</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {(plan?.meals ?? defaultPlan(userId).meals).map((meal) => (
                    <div key={meal.id} className="bg-white p-6 rounded-2xl shadow">
                        <div className="flex justify-between items-start">
                            <div className="text-lg font-semibold">{meal.title}</div>
                            <div className="text-blue-400 font-semibold">{meal.kcal} kcal</div>
                        </div>

                        <ul className="mt-4 space-y-2 text-sm text-gray-700">
                            {meal.items.length === 0 && <li className="text-gray-400">No items yet</li>}
                            {meal.items.map((it) => (
                                <li key={it.id} className="flex justify-between items-center">
                                    <div className="flex-1 pr-3">
                                        <input
                                            className="w-full border-b border-dashed border-gray-200 pb-1 text-sm"
                                            value={it.name}
                                            readOnly
                                        />
                                    </div>

                                    <div className="w-20 text-right text-xs text-gray-500">
                                        <input
                                            className="w-full text-right text-xs"
                                            value={it.grams || ""}
                                            readOnly
                                        />
                                        <div className="text-xs text-gray-400">{it.kcal ?? 0} kcal</div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex items-center justify-between mt-4 bg-gray-100 px-4 py-2 rounded-lg">
                            <div className="text-sm text-gray-500">Carbohydrate <span className="ml-2 text-green-400">{meal.macros.carbs}g</span></div>
                            <div className="text-sm text-gray-500">Protein <span className="ml-2 text-yellow-400">{meal.macros.protein}g</span></div>
                            <div className="text-sm text-gray-500">Fat <span className="ml-2 text-[#C378DD]">{meal.macros.fat}g</span></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
