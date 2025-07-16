"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

function OverView() {
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
    navigate("/SignUpStep4");
  };

  const timeOptions = Array.from({ length: 12 }, (_, i) => i + 1)
    .map((hour) =>
      ["am", "pm"].map((period) => `${hour < 10 ? "0" : ""}${hour} ${period}`)
    )
    .flat();

  return (
    <div className="w-full bg-white px-6 md:px-10 pt-8">
      <div className="max-w-12xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black text-center md:text-left">
            Meal Habits & Prep Details
          </h1>
          <span className="text-blue-500 font-medium">Step 3 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-12xl text-justify md:text-left">
          Share your meal preparation preferences, cooking habits, and available
          resources. Understanding your cooking style, time availability, and
          kitchen setup will help in designing a meal plan that is practical,
          convenient, and easy to follow.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {/* Left Column */}
            <div className="space-y-12 mb-4">
              
            </div>

            {/* Right Column */}
            <div className="space-y-7">
             

              {/* Next Button */}
              <div className="pt-8">
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

export default OverView;
