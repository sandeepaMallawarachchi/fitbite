"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HowtoCalcTDEE() {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <motion.div
        initial={{ x: 100, y: 100, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 bg-[url('/common-bg.png')] bg-cover bg-center z-0"
      />

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <Link to="/">
          <img
            src="/logo2.png"
            alt="fitbite Logo"
            className="h-8 sm:h-10 w-auto cursor-pointer"
          />
        </Link>
      </div>

      {/* Card */}
      <div className="z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full mx-8 sm:mx-8 md:mx-24 lg:px-18 px-4 md:px-6 py-6 space-y-6">
        <div className="max-w-2xl mx-auto space-y-10">
          <h1 className="text-4xl font-bold text-center">
            Your Total Daily Energy Expenditure
          </h1>
          <p className="text-gray-700 text-center">
            Using your information, we've calculated your daily energy needs to help personalize your nutrition and
            ensure your plan aligns perfectly with your fitness goals.
          </p>

          {/* Calc Section */}
          <div className="text-left space-y-6 pt-6">
            <h2 className="text-lg font-semibold text-gray-500">
              How We Calculated Your TDEE
            </h2>
            <p className="text-gray-500">We use two main steps:</p>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-800 mb-4">
                  1. Calculate your BMR (Basal Metabolic Rate)
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  BMR is the number of calories your body needs at rest to maintain vital functions.
                  <br />
                  We used the Mifflin-St Jeor Equation for males:
                </p>
                <p className="text-center font-semibold text-xl mt-4">
                  BMR = (10×weight)+(6.25×height)−(5×age)+5
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Substituting your values:</p>
                <p className="text-center font-semibold text-xl mt-2">
                  BMR = (10×70)+(6.25×173)−(5×24)+5
                </p>
              </div>
            </div>
          </div>

          {/* Continue Button */}
          <div className="flex justify-center pt-8">
            <button className="bg-[var(--green1)] hover:bg-[var(--green2)] text-white font-medium px-16 py-3 rounded-lg transition-colors">
              Continue
            </button>
          </div>
        </div>

        
      </div>
      {/* Back Button (bottom-right) */}
        <div className="absolute bottom-6 right-6 z-10">
          <button
            className="bg-gray-300 hover:bg-gray-400 p-3 rounded-lg transition-colors duration-200"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        </div>
    </section>
  );
}
