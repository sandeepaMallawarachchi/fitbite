"use client";
import { useEffect, useState } from "react";
import axios from "axios";

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

interface DailyTrackingPanelProps {
    userId: string;
    TDEE: number;
    token: string;
    tracking?: DailyTrackingData | null;
}

const DailyTrackingPanel: React.FC<DailyTrackingPanelProps> = ({ userId, TDEE, token, tracking: externalTracking }) => {
    const [tracking, setTracking] = useState<DailyTrackingData | null>(externalTracking || null);

    const getTodayString = () => new Date().toISOString().split("T")[0];

    const fetchTracking = async () => {
        const today = getTodayString();
        try {
            const res = await axios.get(`http://localhost:5000/dailyTracking/getDailyTracking/${userId}/${today}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.data) {
                setTracking(res.data);
            } else {
                const newTracking: DailyTrackingData = {
                    date: today,
                    totalNutrition: { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0 },
                    remainingTDEE: TDEE,
                    originalTDEE: TDEE,
                    meals: [],
                };
                setTracking(newTracking);
                await axios.post("http://localhost:5000/dailyTracking/saveDailyTracking", { userId, ...newTracking }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
        } catch (err) {
            console.error("Failed to fetch daily tracking", err);
        }
    };

    useEffect(() => {
        if (!externalTracking) {
            fetchTracking();
        } else {
            setTracking(externalTracking);
        }
    }, [externalTracking]);

    useEffect(() => {
        fetchTracking();
    }, [userId]);

    if (!tracking) return null;

    return (
        <div className="grid sm:grid-cols-4 sm:grid-rows-1 grid-cols-2 grid-rows-2 justify-center gap-6 sm:text-sm text-xs text-gray-600 bg-white rounded-full p-4 shadow-sm">
            <span>{tracking.totalNutrition.calories} / {TDEE} kcal</span>
            <span>{tracking.totalNutrition.protein}g protein</span>
            <span>{tracking.totalNutrition.carbs}g carbs</span>
            <span>{tracking.totalNutrition.fat}g fat</span>
        </div>
    );
};

export default DailyTrackingPanel;
