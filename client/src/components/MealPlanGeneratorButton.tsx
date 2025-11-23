"use client";
import { useState } from "react";
import axios from "axios";
import { Loader2, Sparkles, CheckCircle2, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

interface MealPlanGeneratorButtonProps {
    userId: string;
    formData: any;
    token: string;
    onPlanGenerated: (plan: any) => void;
    hasExistingPlan: boolean;
    existingPlanId?: string;
}

const MealPlanGeneratorButton: React.FC<MealPlanGeneratorButtonProps> = ({
    userId,
    formData,
    token,
    onPlanGenerated,
    hasExistingPlan,
    existingPlanId,
}) => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // const getTodayString = () => {
    //     return new Date().toISOString().split('T')[0];
    // };

    const saveMealPlan = async (data: any) => {
        try {
            const res = await axios.post(
                `https://fitbite-roan.vercel.app/mealPlan/create`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return res.data;
        } catch (err) {
            console.error("Meal plan save error:", err);
            throw err;
        }
    };

    const updateMealPlan = async (planId: string, data: any) => {
        try {
            const res = await axios.put(
                `https://fitbite-roan.vercel.app/mealPlan/update/${planId}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            return res.data;
        } catch (err) {
            console.error("Meal plan update error:", err);
            throw err;
        }
    };

    const generateMealPlan = async () => {
        setLoading(true);
        setSuccess(false);

        try {
            const res = await axios.post(
                "https://fitbite-3vu1.onrender.com/api/generate-meal-plan",
                {
                    userData: {
                        userId: userId,
                        name: formData.name,
                        email: formData.email,
                        phone: formData.phone,
                        gender: formData.gender,
                        height: formData.height,
                        weight: formData.weight,
                        birthday: formData.birthday,
                        TDEE: formData.TDEE,
                        fitnessGoal: formData.fitnessGoal,
                        mealHabits: formData.mealHabits,
                        dietaryDetails: formData.dietaryDetails,
                        medicalDetails: formData.medicalDetails,
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const parsedPlan = res.data;
            const calculatedCalories =
                (parsedPlan.totalProtein * 4) +
                (parsedPlan.totalCarbs * 4) +
                (parsedPlan.totalFat * 9);

            const calorieDeviation = Math.abs(calculatedCalories - parsedPlan.totalCalories);

            if (calorieDeviation > 100) {
                console.warn("Macro calculations may be inaccurate. Deviation:", calorieDeviation);
            }

            let savedPlan;
            if (hasExistingPlan && existingPlanId) {
                savedPlan = await updateMealPlan(existingPlanId, parsedPlan);
                toast.success("Meal plan updated successfully!");
            } else {
                savedPlan = await saveMealPlan(parsedPlan);
                toast.success("Meal plan generated successfully!");
            }

            console.log("Meal plan saved:", savedPlan);
            console.log("Macro breakdown:", {
                protein: `${parsedPlan.totalProtein}g (${((parsedPlan.totalProtein * 4 / parsedPlan.totalCalories) * 100).toFixed(1)}%)`,
                carbs: `${parsedPlan.totalCarbs}g (${((parsedPlan.totalCarbs * 4 / parsedPlan.totalCalories) * 100).toFixed(1)}%)`,
                fat: `${parsedPlan.totalFat}g (${((parsedPlan.totalFat * 9 / parsedPlan.totalCalories) * 100).toFixed(1)}%)`
            });

            setSuccess(true);
            onPlanGenerated(savedPlan);

            setTimeout(() => setSuccess(false), 3000);

        } catch (error: any) {
            console.error("Failed to generate meal plan:", error);

            if (error.response?.status === 503) {
                toast.error("AI model is loading. Please try again in 30 seconds.");
            } else if (error.response?.status === 500) {
                toast.error("Failed to generate meal plan. Please try again.");
            } else if (error.message?.includes("Network Error")) {
                toast.error("Cannot connect to AI service. Make sure Python API is running on port 5001.");
            } else {
                toast.error("Failed to generate meal plan. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={generateMealPlan}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${loading
                        ? "bg-blue-400 text-white cursor-wait"
                        : hasExistingPlan
                            ? "bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg"
                            : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
                    }`}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{hasExistingPlan ? "Updating..." : "Generating..."}</span>
                    </>
                ) : success ? (
                    <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{hasExistingPlan ? "Updated!" : "Generated!"}</span>
                    </>
                ) : hasExistingPlan ? (
                    <>
                        <RefreshCw className="w-4 h-4" />
                        <span>Regenerate Plan</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Meal Plan</span>
                    </>
                )}
            </button>
        </div>
    );
};

export default MealPlanGeneratorButton;