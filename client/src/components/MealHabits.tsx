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
      ["am", "pm"].flatMap(
        (period) => `${hour < 10 ? "0" : ""}${hour} ${period}`
      )
    )
    .flat();

  return (
     <div className="w-full max-h-80% bg-white px-6 md:px-10 ">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-black">
            Tell About Yourself
          </h1>
          <span className="text-blue-500 font-medium">Step 1 of 6</span>
        </div>
        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl">
          Enter your basic information to create a personalized meal plan. These
          details will help calculate your TDEE and nutritional needs, ensuring
          an accurate and effective plan tailored to your fitness goal.
        </p>
        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-3">
          
          
          </div>
          {/* Right Column */}
          <div className="space-y-6">
           

            {/* Next Button */}
            <div className="pt-32 mb-10">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`font-medium py-3 px-8 rounded-lg w-full transition-colors duration-200 ${isFormValid
                  ? "bg-green-300 text-black hover:bg-green-400 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Back button */}
        <BackButton />
      </div>
    </div>
  );
}

export default MealHabit;
