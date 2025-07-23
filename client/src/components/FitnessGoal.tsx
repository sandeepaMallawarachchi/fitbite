"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import axios from "axios";
import { useFormContext } from "../context/FormContext";
import toast from "react-hot-toast";

const FitnessGoal = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();
  const currentWeight = formData?.weight || "";

  const token = localStorage.getItem("token");
  const user = localStorage.getItem("formData");
  const parsedUser = user ? JSON.parse(user) : null;
  const userId = parsedUser?.userId;
  const role = localStorage.getItem("coachRole")


  const [selectedGoal, setSelectedGoal] = useState("");
  const [progressRate, setProgressRate] = useState("");
  const [goalWeight, setGoalWeight] = useState("");


  const goalDescriptions: Record<string, string> = {
    Maintain: "You will maintain the current weight.",
  };

  const isFormValid =
    selectedGoal === "Maintain" ||
    (selectedGoal && goalWeight.trim() !== "" && progressRate.trim() !== "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedGoal(e.target.value);
    // reset sub-fields when switching
    setProgressRate("");
    setGoalWeight("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      const updateData = {
        fitnessGoal: {
          primaryGoal: selectedGoal,
          goalWeight: selectedGoal === "Maintain" ? "" : goalWeight,
          progress: selectedGoal === "Maintain" ? "" : progressRate,
        },
      };

      if (!userId) {
        toast.error("User ID is missing.");
        return;
      }

      await axios.patch("http://localhost:5000/user/updateFitness", {
        userId,
        updateData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        selectedGoal,
        goalWeight,
        progressRate,
        fitnessGoal: {
          primaryGoal: selectedGoal as "Maintain" | "FatLoss" | "MuscleGain",
          goalWeight,
          progress: progressRate,
        },
      });

      if (role === "Coach") {
        navigate("/dashboard/add-client-step4");
      } else {
        navigate("/SignUpStep3");
      }
    } catch (err) {
      console.error("Failed to update fitness goal", err);
      toast.error("Failed to update fitness goal")
    }
  };

  useEffect(() => {
    if (formData?.fitnessGoal) {
      setSelectedGoal(formData.fitnessGoal.primaryGoal || "");
      setGoalWeight(formData.fitnessGoal.goalWeight || "");
      setProgressRate(formData.fitnessGoal.progress || "");
    }
  }, [formData]);

  return (
    <div className="w-full max-h-80% px-6 md:px-10 ">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-black text-center md:text-left">
            Fitness Goal
          </h1>
          <span className="text-blue-500 font-medium">Step 2 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl text-justify md:text-left">
          Define your fitness objectives to create a tailored nutrition plan.
          Understanding your goals will help in designing a plan that aligns
          with your desired outcomes.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="pt-10 ">
          <div
            className={`${selectedGoal === "Fat Loss" || selectedGoal === "Muscle Gain"
              ? "grid grid-cols-1 md:grid-cols-2 gap-12"
              : "flex flex-col items-center"
              }`}
          >
            {/* Left: Primary Goal + weights */}
            <div>
              <fieldset>
                <legend className="text-sm font-semibold text-gray-700 mb-4">
                  Primary Goal<span className="text-red-500">*</span>
                </legend>
                <div className="flex flex-col space-y-4">
                  {["Maintain", "Fat Loss", "Muscle Gain"].map((goal) => (
                    <label key={goal} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="goal"
                        value={goal}
                        onChange={handleChange}
                        checked={selectedGoal === goal}
                        className="accent-black scale-150"
                      />
                      <span>{goal}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {/* Conditional weight inputs */}
              {(selectedGoal === "Fat Loss" ||
                selectedGoal === "Muscle Gain") && (
                  <>
                    <div className="mt-8">
                      <label className="block text-sm font-medium text-black mb-2">
                        Current Weight<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600"
                        placeholder="70 kg"
                        value={currentWeight}
                        required
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-black mb-2">
                        Goal Weight<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-600"
                        placeholder="0 kg"
                        value={goalWeight}
                        onChange={(e) => setGoalWeight(e.target.value)}
                        required
                      />
                    </div>
                    <p className="mt-2 text-blue-500 text-sm cursor-pointer">
                      Switch to US units (lb)
                    </p>
                  </>
                )}
            </div>

            {/* Right: Progress rate */}
            {(selectedGoal === "Fat Loss" ||
              selectedGoal === "Muscle Gain") && (
                <div>
                  <fieldset>
                    <legend className="text-sm font-semibold text-gray-700 mb-4">
                      Your Desired Progress<span className="text-red-500">*</span>
                    </legend>
                    <div className="flex flex-col space-y-4">
                      {[0.5, 1.0, 1.5].map((rate) => (
                        <label key={rate} className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="progressRate"
                            value={`${rate}`}
                            onChange={(e) => setProgressRate(e.target.value)}
                            checked={progressRate === `${rate}`}
                            className="accent-black scale-150"
                          />
                          <span>
                            {selectedGoal === "Fat Loss"
                              ? `Lose ${rate} kg/week`
                              : `Gain ${rate} kg/week`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>
              )}
          </div>

          {/* If Maintain: show message */}
          {selectedGoal === "Maintain" && (
            <p className="text-md text-gray-600 text-center pt-6">
              {goalDescriptions[selectedGoal]}
            </p>
          )}

          {/* Next Button */}
          <div
            className={`w-full max-w-xs mx-auto ${selectedGoal === "Fat Loss" || selectedGoal === "Muscle Gain"
              ? "pt-0"
              : "pt-40"
              }`}
          >
            <button
              type="submit"
              disabled={!isFormValid}
              className={`font-medium mt-4 py-3 px-8 rounded-lg w-full transition-colors duration-200 ${isFormValid
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
