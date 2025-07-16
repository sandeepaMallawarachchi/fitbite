"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

function HealthAndMedical
() {
  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log({
      mealPreference,
      foodsToAvoid,
      religiousRestrictions,
      allergies,
      performanceMeals,
    });

    navigate("/SignUpStep5");
  };

  return (
    <div className="w-full bg-white px-6 md:px-10 pt-8">
      <div className="max-w-12xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black">
            Dietary Details
          </h1>
          <span className="text-blue-500 font-medium">Step 4 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-12xl">
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
             
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-8">
             

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

export default HealthAndMedical
;
