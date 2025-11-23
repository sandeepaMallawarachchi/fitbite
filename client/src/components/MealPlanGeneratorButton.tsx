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

    const getTodayString = () => {
        return new Date().toISOString().split('T')[0];
    };

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
            const systemPrompt = `
                You are a professional nutritionist. Create a complete daily meal plan for this user:
                
                User Profile:
                - Name: ${formData.name}
                - Gender: ${formData.gender}
                - Height: ${formData.height} cm
                - Weight: ${formData.weight} kg
                - TDEE: ${formData.TDEE} kcal
                - Primary Goal: ${formData.fitnessGoal?.primaryGoal}
                - Goal Weight: ${formData.fitnessGoal?.goalWeight}
                - Meal Frequency: 4 meals
                - Dietary Preference: ${formData.dietaryDetails?.preference}
                - Medical Conditions: ${formData.medicalDetails?.medicalConditions}
                
                MACRO CALCULATION RULES:
                1. Calculate optimal macro split based on their goal:
                - Weight Loss: Higher protein (30-35%), moderate carbs (35-40%), lower fat (25-30%)
                - Muscle Gain: High protein (25-30%), high carbs (45-50%), moderate fat (20-25%)
                - Maintenance: Balanced (protein 20-25%, carbs 45-50%, fat 25-30%)
                
                2. Protein: Calculate based on body weight (1.6-2.2g per kg for active individuals)
                3. Fat: Calculate based on remaining calories (9 kcal per gram)
                4. Carbs: Fill remaining calories (4 kcal per gram)
                
                MEAL STRUCTURE REQUIREMENT:
                You MUST create EXACTLY 4 meals in this EXACT order:
                1. Meal 1 - Breakfast
                2. Meal 2 - Lunch
                3. Meal 3 - Snack
                4. Meal 4 - Dinner
                
                Create a meal plan that:
                - Has EXACTLY 4 meals (Breakfast, Lunch, Snack, Dinner)
                - Total calories match their TDEE of ${formData.TDEE} kcal (±50 kcal tolerance)
                - Macros are calculated specifically for their ${formData.weight}kg body weight and ${formData.fitnessGoal?.primaryGoal} goal
                - Respects their dietary preference: ${formData.dietaryDetails?.preference}
                - Includes realistic portions with accurate macro calculations
                - Each item's macros are calculated based on standard nutritional values per 100g
                - Snack should be smaller (200-350 kcal), main meals larger (500-700 kcal each)
                
                CALCULATION INSTRUCTIONS:
                1. For each food item, use standard nutritional values per 100g
                2. Scale macros based on the gram amount specified
                3. Sum up all items in each meal for meal totals
                4. Sum all meals for daily totals
                5. Ensure totals match calculated macro targets based on user's goal
                
                Return ONLY a valid JSON object in this EXACT format (no markdown, no code blocks):
                {
                "userId": "${userId}",
                "date": "${getTodayString()}",
                "totalCalories": <calculated_total>,
                "totalCarbs": <calculated_total>,
                "totalProtein": <calculated_total>,
                "totalFat": <calculated_total>,
                "meals": [
                    {
                    "id": "m1",
                    "title": "Meal 1 - Breakfast",
                    "kcal": <sum_of_items>,
                    "items": [
                        { 
                        "id": "i1", 
                        "name": "Rolled oats", 
                        "grams": "60", 
                        "kcal": <calculated_based_on_grams>
                        },
                        { 
                        "id": "i2", 
                        "name": "Banana", 
                        "grams": "120", 
                        "kcal": <calculated_based_on_grams>
                        }
                    ],
                    "macros": {
                        "carbs": <calculated_sum>,
                        "protein": <calculated_sum>,
                        "fat": <calculated_sum>
                    }
                    },
                    {
                    "id": "m2",
                    "title": "Meal 2 - Lunch",
                    "kcal": <sum_of_items>,
                    "items": [
                        { 
                        "id": "i3", 
                        "name": "Brown rice", 
                        "grams": "150", 
                        "kcal": <calculated_based_on_grams>
                        },
                        { 
                        "id": "i4", 
                        "name": "Chicken breast", 
                        "grams": "200", 
                        "kcal": <calculated_based_on_grams>
                        }
                    ],
                    "macros": {
                        "carbs": <calculated_sum>,
                        "protein": <calculated_sum>,
                        "fat": <calculated_sum>
                    }
                    },
                    {
                    "id": "m3",
                    "title": "Meal 3 - Snack",
                    "kcal": <sum_of_items>,
                    "items": [
                        { 
                        "id": "i5", 
                        "name": "Greek yogurt", 
                        "grams": "150", 
                        "kcal": <calculated_based_on_grams>
                        },
                        { 
                        "id": "i6", 
                        "name": "Almonds", 
                        "grams": "20", 
                        "kcal": <calculated_based_on_grams>
                        }
                    ],
                    "macros": {
                        "carbs": <calculated_sum>,
                        "protein": <calculated_sum>,
                        "fat": <calculated_sum>
                    }
                    },
                    {
                    "id": "m4",
                    "title": "Meal 4 - Dinner",
                    "kcal": <sum_of_items>,
                    "items": [
                        { 
                        "id": "i7", 
                        "name": "Salmon fillet", 
                        "grams": "150", 
                        "kcal": <calculated_based_on_grams>
                        },
                        { 
                        "id": "i8", 
                        "name": "Quinoa", 
                        "grams": "100", 
                        "kcal": <calculated_based_on_grams>
                        }
                    ],
                    "macros": {
                        "carbs": <calculated_sum>,
                        "protein": <calculated_sum>,
                        "fat": <calculated_sum>
                    }
                    }
                ]
                }
                
                CRITICAL REQUIREMENTS:
                - Generate EXACTLY 4 meals: Breakfast, Lunch, Snack, Dinner (in that order)
                - Do NOT add a 5th meal
                - ALL numbers must be calculated, not hardcoded
                - Macros must add up correctly: (protein_g × 4) + (carbs_g × 4) + (fat_g × 9) ≈ total_kcal
                - Total daily calories should be within ±50 kcal of ${formData.TDEE}
                - Protein should be appropriate for ${formData.weight}kg body weight
                - Return ONLY the JSON object, no other text, no explanations, no markdown
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
                            content: hasExistingPlan 
                                ? "Generate a NEW complete meal plan with DIFFERENT foods than my current plan. Provide variety and fresh meal ideas while maintaining the same macro targets."
                                : "Generate a complete meal plan for me with accurate macro calculations based on my profile and goals.",
                        },
                    ],
                    temperature: 0.8, // Slightly higher for more variety on regeneration
                    max_tokens: 2000,
                },
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            let mealPlanData = res.data.choices[0].message.content;

            // Clean up response if it has markdown code blocks
            mealPlanData = mealPlanData.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

            const parsedPlan = JSON.parse(mealPlanData);

            // Validate the macro calculations
            const calculatedCalories =
                (parsedPlan.totalProtein * 4) +
                (parsedPlan.totalCarbs * 4) +
                (parsedPlan.totalFat * 9);

            const calorieDeviation = Math.abs(calculatedCalories - parsedPlan.totalCalories);

            if (calorieDeviation > 100) {
                console.warn("Macro calculations may be inaccurate. Deviation:", calorieDeviation);
            }

            // Save or update to database
            let savedPlan;
            if (hasExistingPlan && existingPlanId) {
                // Update existing plan
                savedPlan = await updateMealPlan(existingPlanId, parsedPlan);
                toast.success("Meal plan updated successfully!");
            } else {
                // Create new plan
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

            // Reset success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (error: any) {
            console.error("Failed to generate meal plan:", error);
            toast.error("Failed to generate meal plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-3">
            <button
                onClick={generateMealPlan}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                    loading
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