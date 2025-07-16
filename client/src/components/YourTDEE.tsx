"use client";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useState } from "react";
import HowtoCalcTDEE from "./HowtoCalcTDEE";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useFormContext } from "../context/FormContext";

const YourTDEE = () => {
  const navigate = useNavigate();
  const [showCalc, setShowCalc] = useState(false);
  const { formData } = useFormContext();

  const { weight, height, birthday, activityLevel } = formData;

  // Fallback defaults
  const safeWeight = parseFloat(weight?.toString().replace(/[^\d.]/g, "") || "0");
  const safeHeight = parseFloat(height?.toString().replace(/[^\d.]/g, "") || "0");
  const age = birthday ? calculateAge(birthday) : 0;

  function calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    return new Date(ageDifMs).getUTCFullYear() - 1970;
  }

  const BMR = 10 * safeWeight + 6.25 * safeHeight - 5 * age + 5;

  const multipliers: Record<string, number> = {
    "Sedentary": 1.2,
    "Light Active": 1.375,
    "Moderate Active": 1.55,
    "Very Active": 1.725,
    "Super Active": 1.9,
  };

  const multiplier = multipliers[activityLevel || "Moderate Active"];
  const TDEE = Math.round(BMR * multiplier);

  return (
    <section className="z-10 bg-white rounded-xl shadow-xl sm:w-5xl w-full min-h-[90vh] mt-10 sm:mt-0 lg:px-18 px-4 md:px-6 py-6 space-y-6">
      <div className="max-w-2xl mx-auto space-y-10">
        <h1 className="text-4xl font-bold text-center">Your Total Daily Energy Expenditure</h1>
        <p className="text-gray-700 text-center">
          Using your information, we've calculated your daily energy needs to help personalize your nutrition and
          ensure your plan aligns perfectly with your fitness goals.
        </p>
        {!showCalc ? (
          <motion.div
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: 30, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="py-6">
              <p className="text-gray-600 text-center mb-10">
                This is the number of calories you need each day to maintain your current weight.
              </p>
              <p className="text-2xl font-medium text-center">
                Your TDEE is <span className="font-bold">{TDEE} Calories</span> per day
              </p>
            </div>

            <div className="text-center mb-40">
              <button
                onClick={() => setShowCalc(true)}
                className="text-gray-600 hover:text-black cursor-pointer transition-colors underline"
              >
                Want to see how we calculated this?
              </button>
            </div>
          </motion.div>
        ) : (
          <HowtoCalcTDEE />
        )}
        <div className="flex justify-center">
          <button
            onClick={() => navigate("/SignUpStep2")}
            className="font-medium py-3 px-8 rounded-lg w-1/2 transition-colors duration-200 bg-green-300 text-black hover:bg-green-400 cursor-pointer"
          >
            Continue
          </button>
        </div>
        {showCalc ? (
          <div className="absolute bottom-6 right-6 z-10">
            <button
              onClick={() => setShowCalc(false)}
              className="fixed bottom-6 right-6 bg-gray-300 hover:bg-gray-400 p-4 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        ) : (
          <div className="absolute bottom-6 right-6 z-10">
            <BackButton />
          </div>
        )}
      </div>
    </section>
  );
};

export default YourTDEE;
