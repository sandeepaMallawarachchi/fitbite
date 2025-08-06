"use client";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdInfoOutline } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";

const SignIn = () => {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setFormData } = useFormContext();

  const isFormValid =
    email.trim() !== "" &&
    password !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (user.role === "Coach") {
        localStorage.setItem("coachId", user.id);
        localStorage.setItem("coachRole", user.role);
      } else {
        localStorage.removeItem("coachId");

        setFormData({
          userId: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
          birthday: user.birthday,
          TDEE: user.TDEE,
          fitnessGoal: user.fitnessGoal,
          mealHabits: user.mealHabits,
          dietaryDetails: user.dietaryDetails,
          medicalDetails: user.medicalDetails,
        });
      }

      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Login failed");
      } else {
        toast.error("Unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <section className="z-10 bg-white rounded-xl shadow-xl sm:w-5xl w-full min-h-[90vh] mt-10 sm:mt-0 lg:px-18 px-4 md:px-6  py-6 space-y-6">
      {/* Sign In Header */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#268FD0] mb-4 sm:mb-6 lg:mb-8 text-center">
        Sign In
      </h1>
      {/* Main Card */}
      <div className="w-full max-w-5xl bg-white md:p-16 lg:p-0">
        {/* Notification Box */}
        <div className="bg-[#f9f7f2] rounded-lg p-4 sm:p-5 md:py-6 mb-5 flex items-center justify-center gap-3 sm:gap-4 mx-auto max-w-4xl">
          <MdInfoOutline className="text-xl sm:text-2xl text-gray-700 mt-1 flex-shrink-0" />
          <p className="text-gray-800 text-xs sm:text-sm text-center">
            Please sign in using the correct username and password for your account
          </p>
        </div>
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row p-6  sm:pb-8 lg:pb-10">
          {/* Left Column - Form */}
          <div className="w-full lg:w-1/2 lg:pr-12 lg:border-r-2 border-gray-300 mb-8 lg:mb-0 ">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 pb-4 lg:pb-0 border-b lg:border-0">
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-1 border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 pr-10 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="flex items-center pt-4 sm:pt-6 lg:pt-8">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-[#00BBF6] focus:ring-blue-400"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm sm:text-md text-gray-600"
                >
                  Remember me on this computer
                </label>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 justify-center pt-2 space-y-4 sm:space-y-0">
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`sm:w-1/2 font-medium py-3 px-6 sm:px-10 rounded-md text-sm sm:text-base order-2 sm:order-1 transition-colors duration-200 ${!isFormValid || isSubmitting
                      ? "bg-gray-200 text-gray-800 cursor-not-allowed"
                      : "bg-green-300 text-white hover:bg-green-400 cursor-pointer"
                    }`}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
                <a
                  href="#"
                  className="text-[#00BBF6] text-sm sm:text-md font-semibold hover:underline text-center sm:text-right order-1 sm:order-2"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="text-center text-sm sm:text-md text-gray-600 pt-4 ">
                No Account?{" "}
                <a
                  href="SignUp"
                  className="text-[#00BBF6] hover:underline font-semibold"
                >
                  Sign Up
                </a>
              </div>
            </form>
          </div>
          {/* Right Column - Social Logins */}
          <div className="w-full lg:w-1/2 lg:pl-12 space-y-4 lg:pt-14">
            <button className="flex items-center sm:justify-between justify-center px-18 gap-3 border border-gray-300 font-semibold rounded-full py-3 w-full hover:bg-gray-50 text-sm sm:text-base">
              <img
                src="/googlelogo.webp"
                alt="google logo"
                className="w-6 h-6"
              />
              <span className="hidden sm:inline sm:pr-8">
                Sign in with Google
              </span>
              <span className="sm:hidden">Google</span>
            </button>
            <button className="flex items-center sm:justify-between justify-center pl-18 pr-14 gap-3 border border-gray-300 font-semibold rounded-full py-3 w-full hover:bg-gray-50 text-sm sm:text-base">
              <img src="/fblogo.webp" alt="fb logo" className="w-6 h-6" />
              <span className="hidden sm:inline sm:pr-8">
                Sign in with Facebook
              </span>
              <span className="sm:hidden">Facebook</span>
            </button>
            <button className="flex items-center sm:justify-between justify-center px-18 gap-3 border border-gray-300 font-semibold rounded-full py-3 w-full hover:bg-gray-50 text-sm sm:text-base">
              <img
                src="/applelogo.webp"
                alt="apple logo"
                className="w-5 h-6"
              />
              <span className="hidden sm:inline sm:pr-8">
                Sign in with Apple
              </span>
              <span className="sm:hidden">Apple</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SignIn