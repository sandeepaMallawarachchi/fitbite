"use client";
import { motion } from "framer-motion";
import { useFormContext } from "../context/FormContext";

const HowtoCalcTDEE = () => {
  const { formData } = useFormContext();

  const weight = parseFloat(formData.weight || "0");
  const height = parseFloat(formData.height || "0");
  const age = formData.birthday
    ? calculateAge(formData.birthday)
    : 0;

  function calculateAge(dob: string) {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    return new Date(ageDifMs).getUTCFullYear() - 1970;
  }

  const BMR = 10 * weight + 6.25 * height - 5 * age + 5;

  const multipliers: Record<string, number> = {
    "Sedentary": 1.2,
    "Light Active": 1.375,
    "Moderate Active": 1.55,
    "Very Active": 1.725,
    "Super Active": 1.9,
  };

  const activityLevel = formData.activityLevel || "";
  const multiplier = multipliers[activityLevel];
  const TDEE = BMR * multiplier;

  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="overflow-y-auto h-[300px]"
    >
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="text-center sm:text-left space-y-6">
          <h2 className="text-lg font-semibold text-gray-500">
            How We Calculated Your TDEE
          </h2>
          <p className="text-gray-500">We use two main steps:</p>

          <div className="flex flex-col space-y-8">
            <p className="text-sm text-gray-800 mb-2 font-medium">
              1. Calculate your BMR (Basal Metabolic Rate)
            </p>
            <p className="text-sm text-gray-800 my-10 font-medium">
              BMR is the number of calories your body needs at rest to maintain vital functions.
              We used the Mifflin-St Jeor Equation for males:
            </p>
            <p className="text-center font-semibold text-md sm:text-xl">
              BMR = (10 × weight) + (6.25 × height) − (5 × age) + 5
            </p>
            <p className="text-sm text-gray-800 my-10 font-medium">
              Substituting your values:
            </p>
            <p className="text-center font-semibold text-md sm:text-xl">
              BMR = (10 × {weight}) + (6.25 × {height}) − (5 × {age}) + 5
            </p>
            <p className="text-center font-semibold text-md sm:text-xl">
              BMR = {10 * weight} + {6.25 * height} − {5 * age} + 5
            </p>
            <p className="text-center font-semibold text-md sm:text-xl mt-2">
              BMR = {BMR.toFixed(2)} calories/day
            </p>
          </div>

          <div className="flex flex-col space-y-8 pt-10">
            <p className="text-sm text-gray-800 font-medium">
              2. Adjust for Activity Level ({activityLevel})
            </p>
            <p className="text-sm text-gray-800 font-medium">
              "{activityLevel}" means moderate exercise or sports 3–5 days a week.
              The corresponding activity multiplier is {multiplier}.
            </p>
            <p className="text-sm text-gray-800 font-medium">So:</p>
            <p className="text-center font-semibold text-md sm:text-xl">
              TDEE = BMR × {multiplier}
            </p>
            <p className="text-center font-semibold text-md sm:text-xl">
              TDEE = {BMR.toFixed(2)} × {multiplier}
            </p>
            <p className="text-center font-semibold text-md sm:text-xl mt-2">
              TDEE ≈ {Math.round(TDEE)} calories/day
            </p>

            <p className="text-sm text-gray-600">
              Final TDEE:{" "}
              <span className="font-bold text-black">
                ~{Math.round(TDEE)} calories/day
              </span>
            </p>
            <p className="text-sm text-gray-800 font-medium sm:pr-10">
              Small rounding differences are normal.
              Your final result may vary slightly between{" "}
              <strong>{Math.floor(TDEE / 10) * 10}</strong> and{" "}
              <strong>{Math.ceil(TDEE / 100) * 100}</strong> calories per day.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HowtoCalcTDEE;