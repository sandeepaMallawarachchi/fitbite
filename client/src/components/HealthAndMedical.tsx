"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "./BackButton";
import { useFormContext } from "../context/FormContext";
import toast from "react-hot-toast";
import axios from "axios";

function HealthAndMedical() {
  const navigate = useNavigate();
  const { formData, setFormData } = useFormContext();
  const [medicalConditions, setMedicalConditions] = useState("");
  const [medicationsAffectDiet, setMedicationsAffectDiet] = useState("");
  const [takeSupplements, setTakeSupplements] = useState("");
  const [openToSupplements, setOpenToSupplements] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const isFormValid = medicalConditions && medicationsAffectDiet;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.id;

      const updateData = {
        medicalDetails: {
          medicalConditions: medicalConditions as "Yes" | "No",
          medicationsAffect: medicationsAffectDiet as "Yes" | "No",
          supplements: takeSupplements as "Yes" | "No",
          openToSupplements: openToSupplements as "Yes" | "No",
          notes: additionalNotes
        },
      };

      setFormData({
        ...formData,
        medicalDetails: updateData.medicalDetails,
      });

      await axios.patch("http://localhost:5000/user/updateFitness", {
        userId,
        updateData,
      });

      navigate("/SignUpStep6");
    } catch (err) {
      console.error("Failed to update health details", err);
      toast.error("Failed to update health details");
    }
  };

  return (
    <div className="w-full bg-white px-6 md:px-10 pt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black text-center md:text-left">
            Health & Medical Details
          </h1>
          <span className="text-blue-500 font-medium">Step 5 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl text-justify md:text-left">
          Enter your health conditions, medical history, and any relevant
          concerns to ensure a safe and effective nutrition plan. These details
          help in customizing recommendations while considering any medical
          restrictions or special needs.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* LEFT Column - Questions */}
            <div className="space-y-8">
              {/* Any existing medical conditions */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Any existing medical conditions
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-20 ">
                  {["No", "Yes"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="medicalConditions"
                        value={opt}
                        checked={medicalConditions === opt}
                        onChange={() => setMedicalConditions(opt)}
                        className="w-5 h-5 accent-black"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Any medications that affect your diet */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Any medications that affect your diet
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-20 ">
                  {["No", "Yes"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="medications"
                        value={opt}
                        checked={medicationsAffectDiet === opt}
                        onChange={() => setMedicationsAffectDiet(opt)}
                        className="w-5 h-5 accent-black"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Currently take any supplements */}
              <div>
                <label className="block text-md  text-gray-500 mt-4 mb-4">
                  Supplement Use
                </label>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Currently take any supplements
                </label>
                <div className="flex gap-20 ">
                  {["No", "Yes"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="takeSupplements"
                        value={opt}
                        checked={takeSupplements === opt}
                        onChange={() => setTakeSupplements(opt)}
                        className="w-5 h-5 accent-black"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Open to including supplements */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-4">
                  Open to including supplements
                </label>
                <div className="flex gap-20 ">
                  {["No", "Yes"].map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <input
                        type="radio"
                        name="openSupplements"
                        value={opt}
                        checked={openToSupplements === opt}
                        onChange={() => setOpenToSupplements(opt)}
                        className="w-5 h-5 accent-black"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT Column - Additional Notes */}
            <div className="md:space-y-28">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Additional Notes or Requests
                </label>
                <textarea
                  placeholder="anything else to consider when creating the meal plan..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full border-2 border-gray-400 rounded-md p-3 text-sm resize-none h-30"
                />
              </div>

              <div className="pt-6 md:pt-8">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`font-medium py-3 px-8 rounded-lg w-full transition-colors duration-200 ${isFormValid
                    ? "bg-green-300 text-black hover:bg-green-400 cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Back Button */}
        <div className="mt-6">
          <BackButton />
        </div>
      </div>
    </div>
  );
}

export default HealthAndMedical;
