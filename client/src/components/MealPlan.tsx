"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import MealPlanGeneratorButton from "./MealPlanGeneratorButton";

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
    const [initialLoading, setInitialLoading] = useState(true);

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
        try {
            const res = await axios.get(`${API_BASE}/mealPlan/get/${userId}`, { headers });
            if (res.data) {
                setPlan(res.data);
            }
        } catch (err: any) {
            console.error("Error fetching meal plan:", err);
            // If 404 or no plan found, keep plan as null to show generate button
            if (err.response?.status === 404) {
                setPlan(null);
            }
        } finally {
            setInitialLoading(false);
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

    const handlePlanGenerated = (generatedPlan: MealPlan) => {
        setPlan(generatedPlan);
    };

    const hasExistingPlan = plan !== null && plan.meals.some(meal => meal.items.length > 0);

    if (initialLoading) {
        return (
            <div className="w-full p-6 space-y-6 animate-pulse">
                {/* Top Header Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="h-6 w-40 bg-gray-200 rounded"></div>

                    <div className="bg-white px-4 py-3 rounded-2xl shadow flex items-center gap-10">
                        <div className="flex items-center gap-10">
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-4 w-28 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                            <div className="h-4 w-20 bg-gray-200 rounded"></div>
                            <div className="h-4 w-12 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Cards Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[1, 2, 3, 4].map((num) => (
                        <div key={num} className="bg-white p-6 rounded-2xl shadow space-y-4">
                            {/* Title + Calories */}
                            <div className="flex justify-between items-start">
                                <div className="h-5 w-40 bg-gray-200 rounded"></div>
                                <div className="h-5 w-16 bg-gray-200 rounded"></div>
                            </div>

                            {/* Items Skeleton */}
                            <div className="space-y-2">
                                {[1, 2].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="h-4 w-40 bg-gray-200 rounded"></div>
                                        <div className="h-4 w-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Macros Footer */}
                            <div className="flex items-center justify-between mt-4 bg-gray-100 px-4 py-3 rounded-lg">
                                <div className="h-4 w-24 bg-gray-300 rounded"></div>
                                <div className="h-4 w-20 bg-gray-300 rounded"></div>
                                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-semibold">Daily Meal Plan</h1>
                    
                    {/* Generate Button Component */}
                    <MealPlanGeneratorButton
                        userId={userId}
                        formData={formData}
                        token={token}
                        onPlanGenerated={handlePlanGenerated}
                        hasExistingPlan={hasExistingPlan}
                    />
                </div>

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