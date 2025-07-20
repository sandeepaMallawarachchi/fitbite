"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";

function OverView() {
  const navigate = useNavigate();
  const { formData } = useFormContext();
  const [confirmChecked, setConfirmChecked] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmChecked) return;

    console.log("User confirmed all details.");
    navigate("/dashboard");
  };

  const Section = ({
    icon,
    title,
    editStep,
    items,
  }: {
    icon: React.ReactNode;
    title: string;
    editStep?: string;
    items: { label: string; value: string }[];
  }) => (
    <div className="bg-white  rounded-md p-4 space-y-2">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold flex items-center gap-2 text-gray-500">
          {icon}
          {title}
        </h2>
        <button
          type="button"
          className="text-gray-500 hover:text-black"
          onClick={() => editStep && navigate(editStep)}
        >
          <img
            src="/edit.svg"
            alt="Edit"
            className="w-4 h-4 inline-block cursor-pointer"
          />
        </button>
      </div>
      <ul className="space-y-1 text-sm text-gray-600 ">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex justify-between border-b border-gray-200"
          >
            <span>{item.label}</span>
            <span className="text-black font-medium">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="w-full bg-white px-6 md:px-10 pt-4 pb-0">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start mb-6 gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-black text-center md:text-left">
            Overview
          </h1>
          <span className="text-blue-500 font-medium">Step 6 of 6</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-10 leading-relaxed max-w-4xl text-justify md:text-left">
          Review all the information provided to ensure accuracy before
          proceeding. This overview includes personal details, fitness goals,
          dietary preferences, and health information, ensuring a fully
          customized and effective plan tailored to your needs.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Section
              icon={
                <img
                  src="/user.svg"
                  alt="User"
                  className="w-5 h-5 inline-block"
                />
              }
              title="Personal Details"
              editStep="/SignUpStep1"
              items={[
                { label: "Name", value: formData?.name || "-" },
                { label: "Email", value: formData?.email || "-" },
                { label: "Phone", value: formData?.phone || "-" },
                { label: "DOB", value: formData?.birthday || "-" },
                { label: "Gender", value: formData?.gender || "-" },
              ]}
            />
            <Section
              icon={
                <img
                  src="/star.svg"
                  alt="User"
                  className="w-5 h-5 inline-block"
                />
              }
              title="Body Measurements"
              editStep="/SignUpStep1"
              items={[
                { label: "Weight", value: formData?.weight || "-" },
                { label: "Height", value: formData?.height || "-" },
                { label: "Activity Level", value: formData?.activityLevel || "-" },
              ]}
            />
            <Section
              icon={
                <img
                  src="/pin.svg"
                  alt="User"
                  className="w-5 h-5 inline-block"
                />
              }
              title="Fitness Goal"
              editStep="/SignUpStep2"
              items={[
                { label: "Goal", value: formData?.fitnessGoal?.primaryGoal || "-" },
                { label: "Goal Weight", value: formData?.fitnessGoal?.goalWeight || "-" },
                { label: "Progress Rate", value: formData?.fitnessGoal?.progress || "-" },
              ]} />
          </div>

          <div className="space-y-0">
            <Section
              icon={
                <img
                  src="/pie.svg"
                  alt="User"
                  className="w-5 h-5 inline-block"
                />
              }
              title="Dietary Details"
              editStep="/SignUpStep4"
              items={[
                { label: "Meal Preference", value: formData?.dietaryDetails?.preference || "-" },
                { label: "Allergies", value: (formData?.dietaryDetails?.allergies || []).join(", ") || "None" },
                { label: "Restrictions", value: formData?.dietaryDetails?.restrictions || "-" },
                { label: "Foods to Avoid", value: formData?.dietaryDetails?.avoid || "-" },
                {
                  label: "Performance Meals",
                  value: (formData?.dietaryDetails?.performanceMeals || []).join(" & ") || "None",
                },
              ]}
            />
            <Section
              icon={
                <img
                  src="/heart.svg"
                  alt="User"
                  className="w-5 h-5 inline-block"
                />
              }
              title="Health & Medical Details"
              editStep="/SignUpStep5"
              items={[
                {
                  label: "Medical Conditions",
                  value: formData?.medicalDetails?.medicalConditions || "No",
                },
                {
                  label: "Current Medications",
                  value: formData?.medicalDetails?.medicationsAffect || "No",
                },
                {
                  label: "Supplements",
                  value: formData?.medicalDetails?.supplements || "No",
                },
                {
                  label: "Open to Supplements",
                  value: formData?.medicalDetails?.openToSupplements || "No",
                },
                {
                  label: "Notes or Requests",
                  value: formData?.medicalDetails?.notes || "-",
                },
              ]}
            />

            {/* Confirmation & Submit */}
            <form onSubmit={handleSubmit} className="mt-10">
              <label className="flex items-center gap-3 text-md text-gray-800 mb-6 ml-8">
                <input
                  type="checkbox"
                  checked={confirmChecked}
                  onChange={(e) => setConfirmChecked(e.target.checked)}
                  className="w-5 h-5 accent-black"
                />
                I confirm the details are accurate.
              </label>

              <button
                type="submit"
                disabled={!confirmChecked}
                className={`font-medium py-3 px-8 rounded-lg w-full md:w-full transition-colors duration-200 ${confirmChecked
                  ? "bg-green-300 text-black hover:bg-green-400 cursor-pointer"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                Proceed
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OverView;
