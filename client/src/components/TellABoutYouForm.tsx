"use client";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import toast from "react-hot-toast";
import { useFormContext } from "../context/FormContext";
import axios from "axios";

const TellABoutYouForm = () => {
  const navigate = useNavigate();

  const { formData, setFormData } = useFormContext();

  const isFormValid = !!(
    formData.name?.trim() &&
    formData.email?.trim() &&
    formData.phone?.trim() &&
    formData.birthday?.trim() &&
    formData.gender &&
    formData.weight?.trim() &&
    formData.height?.trim() &&
    formData.activityLevel
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const user = localStorage.getItem("user");
    const parsedUser = user ? JSON.parse(user) : null;
    const userId = parsedUser?.id;

    if (!userId) {
      toast.error("User ID not found. Please login again.");
      return;
    }

    try {
      await axios.patch("http://localhost:5000/user/updateUser", {
        ...formData,
        userId,
      });

      navigate("/YourTDEE");
    } catch (err: any) {
      console.error("Error updating user:", err.message);
      toast.error(err.response?.data?.message || "Error updating user");
    }
  };

  return (
    <div className="w-full max-h-80% bg-white px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-2xl md:text-4xl font-bold text-black">Tell About Yourself</h1>
          <span className="text-blue-500 font-medium">Step 1 of 6</span>
        </div>

        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl">
          Enter your basic information to create a personalized meal plan. These
          details will help calculate your TDEE and nutritional needs, ensuring
          an accurate and effective plan tailored to your fitness goal.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                  Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter name here"
                  value={formData.name || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="abc@gmail.com"
                  value={formData.email || ""}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">
                  Mobile Number<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="+94 XX XXX XXXX"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                  required
                />
              </div>

              <div>
                <label htmlFor="birthday" className="block text-sm font-medium text-black mb-2">
                  Birthday<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="birthday"
                  name="birthday"
                  value={formData.birthday || ""}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  Gender<span className="text-red-500">*</span>
                </label>
                <div className="flex space-x-8">
                  {["Male", "Female"].map((g) => (
                    <div key={g} className="flex items-center">
                      <input
                        type="radio"
                        id={g}
                        name="gender"
                        value={g}
                        checked={formData.gender === g}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600"
                        required
                      />
                      <label htmlFor={g} className="ml-3 text-sm text-gray-600">{g}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-black mb-2">
                    Weight<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    placeholder="0 kg"
                    value={formData.weight || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-black mb-2">
                    Height<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    placeholder="0 cm"
                    value={formData.height || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-3">
                  Physical Activity Level<span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["Sedentary", "Light Active", "Moderate Active", "Very Active", "Super Active"].map((level) => (
                    <div key={level} className="flex items-center">
                      <input
                        type="radio"
                        id={level}
                        name="activityLevel"
                        value={level}
                        checked={formData.activityLevel === level}
                        onChange={handleChange}
                        className="h-5 w-5 text-blue-600"
                        required
                      />
                      <label htmlFor={level} className="ml-3 text-sm text-gray-600">
                        {level}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-32 mb-10">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`font-medium py-3 px-8 rounded-lg w-full transition-colors duration-200 ${isFormValid
                    ? "bg-green-300 text-black hover:bg-green-400"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </form>

        <BackButton />
      </div>
    </div>
  );
};

export default TellABoutYouForm;