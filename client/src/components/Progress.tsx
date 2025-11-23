"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

type DailyNutrition = {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
};

type DailyTrackingData = {
  date: string;
  totalNutrition: DailyNutrition;
  remainingTDEE: number;
  originalTDEE: number;
  meals: any[];
};

type MacroItem = {
  label: string;
  goal: number;
  current: number;
  colorClass: string;
};

type WeeklyCaloriesItem = {
  dayShort: string;
  date: string;
  value: number;
  status: "achieved" | "low" | "over";
};

type WeeklyMacroItem = {
  label: string;
  min: number;
  target: number;
  value: number;
  colorClass: string;
};

const API_BASE = "http://localhost:5000";
const formatDate = (d: Date) => d.toISOString().split("T")[0];

export default function Progress() {
  const formData = JSON.parse(localStorage.getItem("formData") || "{}");
  const token = localStorage.getItem("token");
  const userId = formData.userId;
  const TDEE = Number(formData.TDEE || 0);

  const [todayDate, setTodayDate] = useState(formatDate(new Date()));
  const [todayTracking, setTodayTracking] = useState<DailyTrackingData | null>(null);

  const [weekEndDate, setWeekEndDate] = useState(formatDate(new Date()));
  const [weeklyTrackings, setWeeklyTrackings] = useState<Record<string, DailyTrackingData | null>>({});

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const fetchDaily = async (dateStr: string) => {
    try {
      const r = await axios.get(
        `${API_BASE}/dailyTracking/getDailyTracking/${userId}/${dateStr}`,
        { headers }
      );
      return r.data || null;
    } catch {
      return null;
    }
  };

  const fetchToday = async () => {
    const r = await fetchDaily(todayDate);
    setTodayTracking(r);
  };

  const fetchWeek = async () => {
    const end = dayjs(weekEndDate);
    const map: Record<string, DailyTrackingData | null> = {};
    for (let i = 6; i >= 0; i--) {
      const d = end.subtract(i, "day").format("YYYY-MM-DD");
      map[d] = await fetchDaily(d);
    }
    setWeeklyTrackings(map);
  };

  useEffect(() => {
    if (token && userId) {
      fetchToday();
      fetchWeek();
    }
  }, [token, userId]);

  useEffect(() => {
    fetchToday();
  }, [todayDate]);

  useEffect(() => {
    fetchWeek();
  }, [weekEndDate]);

  const calcPercent = (c: number, g: number) => (g > 0 ? Math.min((c / g) * 100, 100) : 0);

  const todayMacros: MacroItem[] = (() => {
    const t = todayTracking;
    const goals = { Protein: 120, Carbs: 250, Fat: 70 };
    return [
      { label: "Protein", goal: goals.Protein, current: t?.totalNutrition?.protein || 0, colorClass: "bg-blue-500" },
      { label: "Carbs", goal: goals.Carbs, current: t?.totalNutrition?.carbs || 0, colorClass: "bg-yellow-400" },
      { label: "Fat", goal: goals.Fat, current: t?.totalNutrition?.fat || 0, colorClass: "bg-red-400" }
    ];
  })();

  const weeklyCalories: WeeklyCaloriesItem[] = (() => {
    const end = dayjs(weekEndDate);
    const arr: WeeklyCaloriesItem[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = end.subtract(i, "day");
      const dateStr = d.format("YYYY-MM-DD");
      const doc = weeklyTrackings[dateStr];
      const calories = doc?.totalNutrition?.calories || 0;
      const status =
        calories < TDEE ? "low" : calories > TDEE ? "over" : "achieved";
      arr.push({
        dayShort: d.format("dd").slice(0, 1),
        date: dateStr,
        value: calories,
        status
      });
    }
    return arr;
  })();

  const weeklyMacros: WeeklyMacroItem[] = (() => {
    const doc = weeklyTrackings[weekEndDate];

    const getStatusColor = (value: number, target: number) => {
      if (value < target) return "bg-yellow-400";   
      if (value > target) return "bg-red-400";   
      return "bg-green-400";                    
    };

    const carbs = doc?.totalNutrition?.carbs || 0;
    const protein = doc?.totalNutrition?.protein || 0;
    const fat = doc?.totalNutrition?.fat || 0;

    return [
      { label: "Carbohydrate", min: 140, target: 250, value: carbs, colorClass: getStatusColor(carbs, 250) },
      { label: "Protein", min: 60, target: 120, value: protein, colorClass: getStatusColor(protein, 120) },
      { label: "Fat", min: 30, target: 70, value: fat, colorClass: getStatusColor(fat, 70) }
    ];
  })();

  const gotoPrevDay = () => setTodayDate(dayjs(todayDate).subtract(1, "day").format("YYYY-MM-DD"));
  const gotoNextDay = () => setTodayDate(dayjs(todayDate).add(1, "day").format("YYYY-MM-DD"));

  const gotoPrevWeek = () => setWeekEndDate(dayjs(weekEndDate).subtract(7, "day").format("YYYY-MM-DD"));
  const gotoNextWeek = () => setWeekEndDate(dayjs(weekEndDate).add(7, "day").format("YYYY-MM-DD"));

  return (
    <div className="w-full p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Today Progress</h2>
        <div className="flex items-center gap-2">
          <button onClick={gotoPrevDay} className="p-2 rounded-md hover:bg-gray-100">◀</button>
          <div className="px-4 py-2 rounded-md bg-white shadow-sm">{todayDate}</div>
          <button onClick={gotoNextDay} className="p-2 rounded-md hover:bg-gray-100">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold mb-4">Calories</h3>
          <div className="flex flex-col items-center">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#79bffd ${calcPercent(todayTracking?.totalNutrition?.calories || 0, todayTracking?.originalTDEE || TDEE) * 3.6
                    }deg, #e6e9ee 0deg)`
                }}
              />
              <div className="absolute w-32 h-32 rounded-full bg-white flex items-center justify-center">
                <div className="text-xl font-semibold">
                  {Math.round(todayTracking?.totalNutrition?.calories || 0)} kcal
                </div>
              </div>
            </div>
            <p className="text-gray-600 mt-4">
              {Math.max(0, (todayTracking?.originalTDEE || TDEE) - (todayTracking?.totalNutrition?.calories || 0))} kcal Left
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-3">
            <h3 className="text-lg font-semibold">Macro Nutritions</h3>
            <div className="text-sm text-gray-500 grid grid-cols-3 md:gap-16 gap-10">
              <div className="text-right">Goal</div>
              <div className="text-right">Current</div>
              <div className="text-right">Left</div>
            </div>
          </div>

          <div className="space-y-6">
            {todayMacros.map((m, i) => {
              const p = calcPercent(m.current, m.goal);
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm text-gray-600 mb-2 items-center">
                    <span>{m.label}</span>
                    <div className="flex gap-6 items-center text-sm">
                      <span className="w-20 text-right">{m.goal}g</span>
                      <span className="w-20 text-right text-teal-600">{m.current}g</span>
                      <span className="w-24 text-right text-gray-500">{Math.max(0, m.goal - m.current)}g</span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`${m.colorClass} h-full rounded-full`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Weekly Progress</h2>
        <div className="flex items-center gap-2">
          <button onClick={gotoPrevWeek} className="p-2 rounded-md hover:bg-gray-100">◀</button>
          <div className="px-4 py-2 rounded-md bg-white shadow-sm">
            {dayjs(weekEndDate).subtract(6, "day").format("YYYY-MM-DD")} - {weekEndDate}
          </div>
          <button onClick={gotoNextWeek} className="p-2 rounded-md hover:bg-gray-100">▶</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Calories</h3>

            <div className="flex justify-end text-xs text-gray-500 gap-4">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Achieved</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-sm inline-block" /> Low</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-sm inline-block" /> Over</div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="relative w-full h-44">
              {/* dynamic scaling */}
              {(() => {
                const chartHeight = 176;
                const maxCal = Math.max(TDEE, ...weeklyCalories.map(w => w.value));
                const targetY = chartHeight - (TDEE / maxCal) * chartHeight;

                return (
                  <>
                    {/* Target label */}
                    <div
                      className="absolute left-0 text-xs text-gray-500"
                      style={{ top: `${targetY - 10}px` }}
                    >
                      Target
                    </div>

                    {/* Target dashed line */}
                    <div
                      className="absolute left-10 right-0 border-t border-dashed border-gray-400"
                      style={{ top: `${targetY}px` }}
                    />

                    {/* Bar section */}
                    <div className="absolute bottom-0 grid grid-cols-7 items-end gap-3 w-full h-full">
                      {weeklyCalories.map((d, i) => {
                        const barHeight = (d.value / maxCal) * chartHeight;

                        const bg =
                          d.status === "achieved"
                            ? "bg-green-400"
                            : d.status === "low"
                              ? "bg-yellow-400"
                              : "bg-red-400";

                        return (
                          <div key={i} className="flex flex-col items-center">
                            {/* Bar */}
                            <div
                              className={`w-6 ${bg} rounded-md transition-all`}
                              style={{ height: `${barHeight}px` }}
                            />

                            {/* Day */}
                            <div className="text-xs mt-2 text-gray-600">{d.dayShort}</div>
                          </div>
                        );
                      })}
                    </div>

                    {/* 0 kcal dashed line */}
                    <div className="absolute left-0 right-0 bottom-0 border-t border-dashed border-gray-400" />
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Macro Nutritions</h3>

            <div className="flex justify-end text-xs text-gray-500 mb-2 gap-4">
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded-sm inline-block" /> Achieved</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-400 rounded-sm inline-block" /> Low</div>
              <div className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded-sm inline-block" /> Over</div>
            </div>
          </div>

          <div className="space-y-6">
            {weeklyMacros.map((m, i) => {
              const p = calcPercent(m.value, m.target);
              const minLeft = (m.min / m.target) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2 text-gray-600">
                    <span>{m.label}</span>
                    <span>{m.value}g</span>
                  </div>

                  <div className="relative w-full h-4 bg-gray-100 rounded-full">
                    <div className={`${m.colorClass} absolute left-0 top-0 bottom-0 rounded-full`} style={{ width: `${p}%` }} />
                    <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400" style={{ left: `${minLeft}%` }} />
                    <div className="absolute top-0 bottom-0 w-0.5 bg-gray-400" style={{ left: `100%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
