"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";

function FitnessGoal() {
  const [selectedGoal, setSelectedGoal] = useState("");
  const navigate = useNavigate();

  const isFormValid = selectedGoal !== "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGoal(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Selected Goal:", selectedGoal);
      navigate("/next-step"); // replace with your actual route
    }
  };

  return (
    <div className="w-full  bg-white px-6 md:px-10 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-black">
            Fitness Goal
          </h1>
          <span className="text-blue-500 font-medium">Step 2 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl">
          Define your fitness objectives to create a tailored nutrition plan.
          Understanding your goals will help in designing a plan that aligns
          with your desired outcomes.
        </p>

        {/* Radio Group */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-10 pt-16"
        >
          <fieldset className="text-center">
            <legend className="text-sm font-semibold text-gray-700 mb-6">
              Primary Goal<span className="text-red-500">*</span>
            </legend>
            <div className="flex flex-col items-start space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="goal"
                  value="Maintain"
                  onChange={handleChange}
                  checked={selectedGoal === "Maintain"}
                  className="accent-green-300 scale-150"
                />
                <span>Maintain</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="goal"
                  value="Fat Loss"
                  onChange={handleChange}
                  checked={selectedGoal === "Fat Loss"}
                  className="accent-green-300 scale-150"
                />
                <span>Fat Loss</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="goal"
                  value="Muscle Gain"
                  onChange={handleChange}
                  checked={selectedGoal === "Muscle Gain"}
                  className="accent-green-300 scale-150"
                />
                <span>Muscle Gain</span>
              </label>
            </div>
          </fieldset>

          {/* Next Button */}
          <div className="w-full max-w-xs pt-20">
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
        </form>

        {/* Back button */}
        <div className="mt-10">
          <BackButton />
        </div>
      </div>
    </div>
  );
}

export default FitnessGoal;
