"use client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export default function YourTDEE() {
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
      <div className="z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full mx-8 sm:mx-8 md:mx-24 lg:px-18 px-4  md:px-6  py-6 space-y-6">
        <div className="max-w-2xl mx-auto space-y-10">
          <h1 className="text-4xl font-bold text-center">
            Your Total Daily Energy Expenditure
          </h1>
          <p className="text-gray-700 text-center">
            Using your information, we've calculated your daily energy needs to
            help personalize your nutrition and ensure your plan aligns
            perfectly with your fitness goals.
          </p>
          <div className="py-6">
            <p className="text-gray-600 text-center mb-10">
              This is the number of calories you need each day to maintain your
              current weight.
            </p>
            <p className="text-2xl font-medium text-center">
              Your TDEE is <span className="font-bold">2498 Calories</span> per
              day
            </p>
          </div>
          <div className="text-center">
            <a
              href="#"
              className="text-gray-600 hover:text-black transition-colors underline"
            >
              Want to see how we calculated this?
            </a>
          </div>
          <div className="flex justify-center pt-24">
            <button className="bg-[var(--green1)] hover:bg-[var(--green2)] text-white font-medium px-16 py-3 rounded-lg transition-colors">
              Continue
            </button>
          </div>
          {/* Back button */}
          <div className="absolute bottom-6 right-6 z-10">
            <button className="bg-gray-300 hover:bg-gray-400 p-3 rounded-lg transition-colors duration-200">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
