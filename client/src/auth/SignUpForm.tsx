"use client";

import type React from "react";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCheck } from "react-icons/fa";
import { MdInfoOutline, MdError } from "react-icons/md";
import { Link } from "react-router-dom";

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean | null>(null);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const isFormValid =
    email.trim() !== "" &&
    password !== "" &&
    confirmPassword !== "" &&
    passwordsMatch === true &&
    rememberMe;

  // Check if passwords match whenever either password changes
  useEffect(() => {
    if (confirmPasswordTouched) {
      if (confirmPassword === "") {
        setPasswordsMatch(null);
      } else {
        setPasswordsMatch(password === confirmPassword);
      }
    }
  }, [password, confirmPassword, confirmPasswordTouched]);

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    if (!confirmPasswordTouched) {
      setConfirmPasswordTouched(true);
    }
  };

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <motion.div
        initial={{ x: 100, y: 100, opacity: 0 }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 bg-fit bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url('/common-bg.png')` }}
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
      {/* Sign In Card */}
      <div className="z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full mx-8 sm:mx-8 md:mx-24 lg:px-18 px-4 md:px-6 py-6 space-y-6">
        {/* Sign In Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#268FD0] mb-4 sm:mb-6 lg:mb-8 text-center">
          Sign Up
        </h1>
        {/* Main Card */}
        <div className="w-full max-w-5xl bg-white">
          {/* Notification Box */}
          <div className="bg-[#f9f7f2] rounded-lg p-4 sm:p-5 md:py-6 mb-5 flex items-center justify-center gap-3 sm:gap-4 mx-auto max-w-4xl">
            <MdInfoOutline className="text-xl sm:text-2xl text-gray-700 mt-1 flex-shrink-0" />
            <p className="text-gray-800 text-xs sm:text-sm">
              Sign up by entering a valid username and strong password to create
              your account
            </p>
          </div>
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row p-6 sm:pb-8 lg:pb-10">
            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 lg:pr-12 lg:border-r-2 border-gray-300 mb-8 lg:mb-0 ">
              <div className="space-y-4 sm:space-y-6 pb-4 lg:pb-0 border-b lg:border-0">
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
                    value={password}
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
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className={`w-full border rounded-lg p-3 pr-10 text-sm sm:text-base focus:outline-none focus:ring-1 ${
                      passwordsMatch === false
                        ? "border-red-500 focus:ring-red-400"
                        : passwordsMatch === true
                        ? "border-green-500 focus:ring-green-400"
                        : "border-gray-300 focus:ring-blue-400"
                    }`}
                  />
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    {confirmPasswordTouched &&
                      confirmPassword !== "" &&
                      (passwordsMatch ? (
                        <FaCheck className="text-green-500" />
                      ) : (
                        <MdError className="text-red-500" />
                      ))}
                  </div>
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {confirmPasswordTouched &&
                  confirmPassword !== "" &&
                  !passwordsMatch && (
                    <p className="text-red-500 text-xs mt-1">
                      Passwords do not match
                    </p>
                  )}
                {confirmPasswordTouched && passwordsMatch && (
                  <p className="text-green-500 text-xs mt-1">Passwords match</p>
                )}
                <div className="w-full flex items-center gap-4 pl-5 pt-4 sm:pt-6 lg:pt-6">
                  <input
                    type="checkbox"
                    id="remember"
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-[#00BBF6] focus:ring-blue-400"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm sm:text-md text-gray-600"
                  >
                    Remember me on this computer
                  </label>
                </div>
                <div>
                  {/* signup button */}
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full font-medium py-3 px-6 sm:px-10 rounded-md text-sm sm:text-base order-2 sm:order-1 transition-colors duration-200 ${
                      isFormValid
                        ? "bg-green-300 text-white hover:opacity-90"
                        : "bg-gray-200 text-gray-800 cursor-not-allowed"
                    }`}
                  >
                    Sign Up
                  </button>
                </div>
                <div className="text-center text-sm sm:text-md text-gray-600">
                  Already have an Account?{" "}
                  <Link
                    to="/SignIn"
                    className="text-[#00BBF6] hover:underline font-semibold"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            {/* Right Column - Social Logins */}
            <div className="w-full lg:w-1/2 lg:pl-12 space-y-4 lg:pt-14">
              <button className="flex items-center justify-between px-18 gap-3 border border-gray-300 font-semibold rounded-full py-3 w-full hover:bg-gray-50 text-sm sm:text-base">
                <img
                  src="/googlelogo.png"
                  alt="google logo"
                  className="w-6 h-6"
                />
                <span className="hidden sm:inline pr-8">
                  Sign in with Google
                </span>
                <span className="sm:hidden">Google</span>
              </button>
              <button className="flex items-center justify-between pl-18 pr-14 gap-3 border border-gray-300 font-semibold rounded-full py-3 w-full hover:bg-gray-50 text-sm sm:text-base">
                <img src="/fblogo.jpg" alt="fb logo" className="w-6 h-6" />
                <span className="hidden sm:inline pr-8">
                  Sign in with Facebook
                </span>
                <span className="sm:hidden">Facebook</span>
              </button>
              <button className="flex items-center justify-between px-18 gap-3 border border-gray-300 font-semibold rounded-full py-3 w-full hover:bg-gray-50 text-sm sm:text-base">
                <img
                  src="/applelogo.svg"
                  alt="apple logo"
                  className="w-5 h-6"
                />
                <span className="hidden sm:inline pr-8">
                  Sign in with Apple
                </span>
                <span className="sm:hidden">Apple</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
