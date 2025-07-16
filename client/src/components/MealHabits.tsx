"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

function MealHabit() {
  const navigate = useNavigate();

  const [dailyMeals, setDailyMeals] = useState("");
  const [cookAtHome, setCookAtHome] = useState("");
  const [canMealPrep, setCanMealPrep] = useState("");
  const [budget, setBudget] = useState("");
  const [schedule, setSchedule] = useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const isFormValid =
    dailyMeals &&
    cookAtHome &&
    canMealPrep &&
    budget &&
    schedule.breakfast &&
    schedule.lunch &&
    schedule.dinner;

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log({ dailyMeals, cookAtHome, canMealPrep, budget, schedule });
    navigate("/next-step");
  };

  const timeOptions = Array.from({ length: 12 }, (_, i) => i + 1)
    .map((hour) =>
      ["am", "pm"].map((period) => `${hour < 10 ? "0" : ""}${hour} ${period}`)
    )
    .flat();

  return (
    <div className="w-full bg-white px-6 md:px-10 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Meal Habits & Prep Details
          </h1>
          <span className="text-blue-500 font-medium">Step 3 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl">
          Share your meal preparation preferences, cooking habits, and available
          resources. Understanding your cooking style, time availability, and
          kitchen setup will help in designing a meal plan that is practical,
          convenient, and easy to follow.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Daily Meals */}
              <div>
                <label className="block font-semibold mb-2">Daily Meals</label>
                <div className="flex gap-6 flex-wrap">
                  {["3 Meals", "4 Meals", "5+ Meals"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={opt}
                        checked={dailyMeals === opt}
                        onChange={() => setDailyMeals(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Meals Schedule */}
              <div>
                <label className="block font-semibold mb-2">
                  Meals Schedule
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {["breakfast", "lunch", "dinner"].map((meal) => (
                    <div key={meal}>
                      <label className="block capitalize mb-1">
                        {meal}
                      </label>
                      <select
                        name={meal}
                        value={schedule[meal as keyof typeof schedule]}
                        onChange={handleTimeChange}
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="">00 am/pm</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Cook at Home */}
              <div>
                <label className="block font-semibold mb-2">
                  Cook at Home
                </label>
                <div className="flex gap-6 flex-wrap">
                  {["Daily", "Few times/week", "Rarely"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={opt}
                        checked={cookAtHome === opt}
                        onChange={() => setCookAtHome(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Ability to Meal Prep */}
              <div>
                <label className="block font-semibold mb-2">
                  Ability to Meal prep
                </label>
                <div className="flex gap-6">
                  {["Yes", "No"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={opt}
                        checked={canMealPrep === opt}
                        onChange={() => setCanMealPrep(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Grocery Budget */}
              <div>
                <label className="block font-semibold mb-2">
                  Grocery Budget
                </label>
                <div className="flex gap-6 flex-wrap">
                  {["Budget-friendly", "Moderate", "Flexible"].map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={opt}
                        checked={budget === opt}
                        onChange={() => setBudget(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-10">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`font-medium py-3 px-8 rounded-lg w-full transition-colors duration-200 ${
                    isFormValid
                      ? "bg-green-300 text-black hover:bg-green-400 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Back Button */}
        <div className="mt-6">
          <BackButton />
        </div>
      </div>
    </div>
  );
}

export default MealHabit;
