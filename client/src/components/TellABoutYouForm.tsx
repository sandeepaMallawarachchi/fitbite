"use client";
import { useState } from "react";
import {  ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

function TellABoutYouForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    weight: "",
    height: "",
    email: "",
    mobileNumber: "",
    birthday: "",
    gender: "",
    activityLevel: "",
    password: "",
    confirmPassword: "",
  });

 const isFormValid =
  formData.name.trim() !== "" &&
  formData.email.trim() !== "" &&
  formData.mobileNumber.trim() !== "" &&
  formData.birthday.trim() !== "" &&
  formData.gender !== "" &&
  formData.weight.trim() !== "" &&
  formData.height.trim() !== "" &&
  formData.activityLevel !== "";


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form submitted:", formData);
      navigate("/YourTDEE");
    }
  };

  return (
    <div className="w-full max-h-80% bg-white px-6 md:px-10 ">
      <div className="max-w-6xl mx-auto ">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-black">
            Tell About Yourself
          </h1>
          <span className="text-blue-500 font-medium">Step 1 of 6</span>
        </div>
        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl">
          Enter your basic information to create a personalized meal plan. These
          details will help calculate your TDEE and nutritional needs, ensuring
          an accurate and effective plan tailored to your fitness goal.
        </p>
        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Name Field */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-black mb-2"
              >
                Name<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="enter name here"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-black mb-2"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="abc@gmail.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {/* Mobile Number */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-black mb-2"
              >
                Mobile Number<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                placeholder="+94 XX XXX XXXX"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            {/* Birthday */}
            <div>
              <label
                htmlFor="birthday"
                className="block text-sm font-medium text-black mb-2"
              >
                Birthday<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  className="w-full px-4 py-3 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600"
                  value={formData.birthday}
                  onChange={handleChange}
                  required
                />
                {/* <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" /> */}
              </div>
            </div>
            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Gender<span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-8">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="Male"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                    onChange={handleChange}
                    checked={formData.gender === "Male"}
                    required
                  />
                  <label htmlFor="male" className="ml-3 text-sm text-gray-600">
                    Male
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="Female"
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                    onChange={handleChange}
                    checked={formData.gender === "Female"}
                  />
                  <label
                    htmlFor="female"
                    className="ml-3 text-sm text-gray-600"
                  >
                    Female
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="space-y-6">
            {/* Weight and Height Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Weight Field */}
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Weight<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  placeholder="0 kg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Height Field */}
              <div>
                <label
                  htmlFor="height"
                  className="block text-sm font-medium text-black mb-2"
                >
                  Height<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="height"
                  name="height"
                  placeholder="0 cm"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-600"
                  value={formData.height}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {/* Physical Activity Level */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">
                Physical Activity Level<span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {/* First Row */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="sedentary"
                      name="activityLevel"
                      value="Sedentary"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                      onChange={handleChange}
                      checked={formData.activityLevel === "Sedentary"}
                      required
                    />
                    <label
                      htmlFor="sedentary"
                      className="ml-3 text-sm text-gray-600"
                    >
                      Sedentary
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="veryActive"
                      name="activityLevel"
                      value="Very Active"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                      onChange={handleChange}
                      checked={formData.activityLevel === "Very Active"}
                    />
                    <label
                      htmlFor="veryActive"
                      className="ml-3 text-sm text-gray-600"
                    >
                      Very Active
                    </label>
                  </div>
                </div>
                {/* Second Row */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="lightActive"
                      name="activityLevel"
                      value="Light Active"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                      onChange={handleChange}
                      checked={formData.activityLevel === "Light Active"}
                    />
                    <label
                      htmlFor="lightActive"
                      className="ml-3 text-sm text-gray-600"
                    >
                      Light Active
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="superActive"
                      name="activityLevel"
                      value="Super Active"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                      onChange={handleChange}
                      checked={formData.activityLevel === "Super Active"}
                    />
                    <label
                      htmlFor="superActive"
                      className="ml-3 text-sm text-gray-600"
                    >
                      Super Active
                    </label>
                  </div>
                </div>
                {/* Third Row */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="moderateActive"
                      name="activityLevel"
                      value="Moderate Active"
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-400"
                      onChange={handleChange}
                      checked={formData.activityLevel === "Moderate Active"}
                    />
                    <label
                      htmlFor="moderateActive"
                      className="ml-3 text-sm text-gray-600"
                    >
                      Moderate Active
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Next Button */}
            <div className="pt-32 mb-10">
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`font-medium py-3 px-8 rounded-lg w-full transition-colors duration-200 ${
                  isFormValid
                    ? "bg-green-300 text-black hover:bg-green-400"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {/* Back button */}
        <button  onClick={() => navigate(-1)} className="fixed bottom-6 right-6 bg-gray-300 hover:bg-gray-400 p-4 rounded-lg transition-colors duration-200">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

export default TellABoutYouForm;
