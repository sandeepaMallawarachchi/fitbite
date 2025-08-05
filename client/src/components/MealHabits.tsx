"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useFormContext } from "../context/FormContext";
import toast from "react-hot-toast";
import axios from "axios";

const MealHabit = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();
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

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("formData");
      const parsedUser = user ? JSON.parse(user) : null;
      const userId = parsedUser?.userId;
      const role = localStorage.getItem("coachRole")
      const wasEdited = localStorage.getItem("editedProfile");

      const updateData = {
        mealHabits: {
          dailyMeals,
          cookAtHome,
          ability: canMealPrep,
          grosaryBudget: budget,
          mealsSchedule: {
            breakfast: schedule.breakfast,
            lunch: schedule.lunch,
            dinner: schedule.dinner,
          },
        },
      };

      setFormData({
        ...formData,
        mealHabits: {
          dailyMeals: updateData.mealHabits.dailyMeals,
          mealsSchedule: updateData.mealHabits.mealsSchedule,
          cookAtHome: updateData.mealHabits.cookAtHome as "Daily" | "Rarely" | "Few times/week",
          ability: updateData.mealHabits.ability as "Yes" | "No",
          grosaryBudget: updateData.mealHabits.grosaryBudget as "Friendly" | "Moderate" | "Flexible",
        },
      });

      await axios.patch("https://fitbite-roan.vercel.app/user/updateFitness", {
        userId,
        updateData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (role === "Coach") {
        navigate("/dashboard/add-client-step5");
      } else if (wasEdited) {
        navigate("/dashboard/profile");
      } else {
        navigate("/SignUpStep4");
      }
    } catch (err) {
      console.error("Failed to update meal habits", err);
      toast.error("Failed to update meal habits");
    }
  };

  useEffect(() => {
    if (formData?.mealHabits) {
      setDailyMeals(formData.mealHabits.dailyMeals || "");
      setCookAtHome(formData.mealHabits.cookAtHome || "");
      setCanMealPrep(formData.mealHabits.ability || "");
      setBudget(formData.mealHabits.grosaryBudget || "");
      setSchedule({
        breakfast: formData.mealHabits.mealsSchedule?.breakfast || "",
        lunch: formData.mealHabits.mealsSchedule?.lunch || "",
        dinner: formData.mealHabits.mealsSchedule?.dinner || "",
      });
    }
  }, [formData]);


  return (
    <div className="w-full px-6 md:px-10 pt-8">
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
              {/* Daily Meals */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-3">
                  Daily Meals
                </label>
                <div className="grid grid-cols-2 gap-y-4 gap-x-0">
                  {["3 Meals", "4 Meals", "5+ Meals"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="dailyMeals"
                        value={opt}
                        checked={dailyMeals === opt}
                        onChange={() => setDailyMeals(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-md">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Meals Schedule */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-3">
                  Meals Schedule
                </label>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {/* Breakfast */}
                  <div>
                    <label className="block text-md text-gray-600 mb-1">
                      Breakfast
                    </label>
                    <input
                      name="breakfast"
                      value={schedule.breakfast}
                      type="time"
                      onChange={handleTimeChange}
                      className="border rounded-md px-3 py-2 w-full text-md"
                    />
                  </div>

                  {/* Lunch */}
                  <div>
                    <label className="block text-md text-gray-600 mb-1">
                      Lunch
                    </label>
                    <input
                      name="lunch"
                      value={schedule.lunch}
                      type="time"
                      onChange={handleTimeChange}
                      className="border rounded-md px-3 py-2 w-full text-md"
                    />
                  </div>

                  {/* Dinner (goes to 2nd row left) */}
                  <div>
                    <label className="block text-md text-gray-600 mb-1">
                      Dinner
                    </label>
                    <input
                      name="dinner"
                      value={schedule.dinner}
                      type="time"
                      onChange={handleTimeChange}
                      className="border rounded-md px-3 py-2 w-full text-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-7">
              {/* Cook at Home */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-3">
                  Cook at Home
                </label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {["Daily", "Few times/week", "Rarely"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="cookAtHome"
                        value={opt}
                        checked={cookAtHome === opt}
                        onChange={() => setCookAtHome(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-md">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ability to Meal Prep */}
              <div>
                <label className="block  font-semibold text-gray-800 mb-3">
                  Ability to Meal prep
                </label>
                <div className="flex gap-6">
                  {["Yes", "No"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center text-gray-600 gap-2"
                    >
                      <input
                        type="radio"
                        value={opt}
                        checked={canMealPrep === opt}
                        onChange={() => setCanMealPrep(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Grocery Budget */}
              <div>
                <label className="block text-md font-semibold text-gray-800 mb-3">
                  Grocery Budget
                </label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {["Budget-friendly", "Moderate", "Flexible"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={opt}
                        checked={budget === opt}
                        onChange={() => setBudget(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-md">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <div className="pt-8">
                <button
                  type="submit"
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
