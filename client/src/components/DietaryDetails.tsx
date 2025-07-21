"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useFormContext } from "../context/FormContext";
import toast from "react-hot-toast";
import axios from "axios";

const DietaryDetails = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();
  const [mealPreference, setMealPreference] = useState("");
  const [foodsToAvoid, setFoodsToAvoid] = useState("");
  const [religiousRestrictions, setReligiousRestrictions] = useState("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [performanceMeals, setPerformanceMeals] = useState<string[]>([]);

  const isFormValid = mealPreference && foodsToAvoid && religiousRestrictions;

  const handleAllergyChange = (value: string) => {
    setAllergies((prev) =>
      prev.includes(value)
        ? prev.filter((a) => a !== value)
        : [...prev, value]
    );
  };

  const handlePerformanceMealChange = (value: string) => {
    setPerformanceMeals((prev) =>
      prev.includes(value)
        ? prev.filter((m) => m !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.id;
      const role = parsedUser?.role;

      const updateData = {
        dietaryDetails: {
          preference: mealPreference as "Omnivore" | "Vegan" | "Vegitarian",
          avoid: foodsToAvoid as "Yes" | "No",
          restrictions: religiousRestrictions as "Yes" | "No",
          allergies: allergies as ("Dairy" | "Nuts" | "Shellfish" | "Gluten" | "Other")[],
          performanceMeals: performanceMeals.map((meal) =>
            meal === "Pre-workout Meal" ? "preWorkout" : "postWorkout"
          ) as ("preWorkout" | "postWorkout")[],
        },
      };

      setFormData({
        ...formData,
        dietaryDetails: updateData.dietaryDetails,
      });

      await axios.patch("http://localhost:5000/user/updateFitness", {
        userId,
        updateData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (role === "Coach") {
        navigate("/dashboard/add-client-step6");
      } else {
        navigate("/SignUpStep5");
      }
    } catch (err) {
      console.error("Failed to update dietary details", err);
      toast.error("Failed to update dietary details");
    }
  };

  useEffect(() => {
    if (formData?.dietaryDetails) {
      const {
        preference,
        avoid,
        restrictions,
        allergies: savedAllergies,
        performanceMeals: savedPerformance,
      } = formData.dietaryDetails;

      setMealPreference(preference || "");
      setFoodsToAvoid(avoid || "");
      setReligiousRestrictions(restrictions || "");
      setAllergies(savedAllergies || []);
      setPerformanceMeals(
        (savedPerformance || []).map((meal) =>
          meal === "preWorkout" ? "Pre-workout Meal" : "Post-workout Meal"
        )
      );
    }
  }, [formData]);

  return (
    <div className="w-full px-6 md:px-10 pt-8">
      <div className="max-w-12xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black text-center md:text-left">
            Dietary Details
          </h1>
          <span className="text-blue-500 font-medium">Step 4 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-12xl text-justify md:text-left">
          Provide your dietary preferences and restrictions to create a meal
          plan that suits your lifestyle. These details ensure the plan aligns
          with their nutritional needs, food choices, and any allergies or
          special dietary requirements.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
            {/* LEFT COLUMN */}
            <div className="space-y-8 mb-4">
              {/* Meal Preference */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Meal Preference<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {["Omnivore", "Vegan", "Vegetarian"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="mealPreference"
                        value={opt}
                        checked={mealPreference === opt}
                        onChange={() => setMealPreference(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Foods to Avoid<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-x-8">
                  {["No", "Yes"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="foodsToAvoid"
                        value={opt}
                        checked={foodsToAvoid === opt}
                        onChange={() => setFoodsToAvoid(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cultural or Religious Restrictions */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Cultural or Religious Restrictions
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-x-8">
                  {["No", "Yes"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="religiousRestrictions"
                        value={opt}
                        checked={religiousRestrictions === opt}
                        onChange={() => setReligiousRestrictions(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
              {/* Allergies or Intolerances */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Allergies or Intolerances
                </label>
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                  {["Dairy", "Nuts", "Shellfish", "Gluten", "Other"].map(
                    (opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          checked={allergies.includes(opt)}
                          onChange={() => handleAllergyChange(opt)}
                          className="w-5 h-5 accent-black "
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Performance Meals */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Performance Meals
                </label>
                <div className="space-y-4">
                  {["Pre-workout Meal", "Post-workout Meal"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={performanceMeals.includes(opt)}
                        onChange={() => handlePerformanceMealChange(opt)}
                        className="w-5 h-5 accent-black "
                      />
                      <span className="text-sm">{opt}</span>
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

export default DietaryDetails;
