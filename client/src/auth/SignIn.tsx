"use client";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat z-0"
        style={{ backgroundImage: `url('/common-bg.png')` }}
      />

      {/* Logo */}
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10">
        <a href="/">
          <img
            src="/logo2.png"
            alt="fitbite Logo"
            className="h-8 sm:h-10 w-auto cursor-pointer"
          />
        </a>
      </div>

      {/* Sign In Card */}
      <div className="z-10 bg-white rounded-xl shadow-xl max-w-5xl w-full mx-8 sm:mx-8 md:mx-24 lg:px-18 px-4 md:px-6  py-6 space-y-6">
        {/* Sign In Header */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-[#268FD0] mb-4 sm:mb-6 lg:mb-8 text-center">
          Sign In
        </h1>
        {/* Main Card */}
        <div className="w-full max-w-5xl bg-white md:p-16 lg:p-0">
          {/* Notification Box */}
          <div className="bg-[#f9f7f2] rounded-lg p-4 sm:p-5 mb-6 sm:mb-8 lg:mb-18 flex items-start gap-3 sm:gap-4 mx-auto max-w-4xl">
            <MdPhoneIphone className="text-xl sm:text-2xl text-gray-700 mt-1 flex-shrink-0" />
            <p className="text-gray-800 text-xs sm:text-sm">
              If you use FitBite's mobile app, please sign in with the same
              account name or email as you do in your FitBite mobile app. You
              can see account name on the settings screen in the mobile app.
            </p>
          </div>
          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row p-6  sm:pb-8 lg:pb-10">
            {/* Left Column - Form */}
            <div className="w-full lg:w-1/2 lg:pr-12 lg:border-r-2 border-gray-300 mb-8 lg:mb-0 ">
              <div className="space-y-4 sm:space-y-6 pb-4 lg:pb-0 border-b lg:border-0">
                <input
                  type="text"
                  placeholder="Email or Account Name"
                  className="w-full border-1 border-gray-300 rounded-lg p-3 text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
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
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-2 space-y-4 sm:space-y-0">
                  <button
                    type="submit"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 sm:px-10 rounded-md text-sm sm:text-base order-2 sm:order-1"
                  >
                    Sign In
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
              </div>
            </div>
            {/* Right Column - Social Logins */}
            <div className="w-full lg:w-1/2 lg:pl-12 space-y-4 lg:pt-14">
              <button className="flex items-center justify-center gap-3 border border-gray-300 font-semibold rounded-full py-3 px-4 w-full hover:bg-gray-50 text-sm sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  className="sm:w-7 sm:h-7"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                <span className="hidden sm:inline pr-8">
                  Sign in with Google
                </span>
                <span className="sm:hidden">Google</span>
              </button>

              <button className="flex items-center justify-center gap-3 border border-gray-300 font-semibold rounded-full py-3 px-4 w-full hover:bg-gray-50 text-sm sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 48 48"
                  className="sm:w-7 sm:h-7"
                >
                  <path
                    fill="#039be5"
                    d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"
                  ></path>
                </svg>
                <span className="hidden sm:inline pr-8">
                  Sign in with Facebook
                </span>
                <span className="sm:hidden">Facebook</span>
              </button>

              <button className="flex items-center justify-center gap-3 border border-gray-300 font-semibold rounded-full py-3 px-4 w-full hover:bg-gray-50 text-sm sm:text-base">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="sm:w-7 sm:h-7"
                >
                  <path d="M 15.904297 1.078125 C 15.843359 1.06875 15.774219 1.0746094 15.699219 1.0996094 C 14.699219 1.2996094 13.600391 1.8996094 12.900391 2.5996094 C 12.300391 3.1996094 11.800781 4.1996094 11.800781 5.0996094 C 11.800781 5.2996094 11.999219 5.5 12.199219 5.5 C 13.299219 5.4 14.399609 4.7996094 15.099609 4.0996094 C 15.699609 3.2996094 16.199219 2.4 16.199219 1.5 C 16.199219 1.275 16.087109 1.10625 15.904297 1.078125 z M 16.199219 5.4003906 C 14.399219 5.4003906 13.600391 6.5 12.400391 6.5 C 11.100391 6.5 9.9003906 5.5 8.4003906 5.5 C 6.3003906 5.5 3.0996094 7.4996094 3.0996094 12.099609 C 2.9996094 16.299609 6.8 21 9 21 C 10.3 21 10.600391 20.199219 12.400391 20.199219 C 14.200391 20.199219 14.600391 21 15.900391 21 C 17.400391 21 18.500391 19.399609 19.400391 18.099609 C 19.800391 17.399609 20.100391 17.000391 20.400391 16.400391 C 20.600391 16.000391 20.4 15.600391 20 15.400391 C 17.4 14.100391 16.900781 9.9003906 19.800781 8.4003906 C 20.300781 8.1003906 20.4 7.4992188 20 7.1992188 C 18.9 6.1992187 17.299219 5.4003906 16.199219 5.4003906 z"></path>
                </svg>
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
