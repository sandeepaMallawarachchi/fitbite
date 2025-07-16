"use client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OverView() {
  const navigate = useNavigate();

  const [confirmChecked, setConfirmChecked] = useState(false);

  // Simulated gathered data (replace with context/state later)
  const userData = {
    name: "Nipuna Udara",
    email: "m.n.u.i.gunasinghe@gmail.com",
    phone: "+94 71 088 8793",
    dob: "29/10/2000",
    gender: "Male",
    weight: "70 kg",
    height: "173 cm",
    activityLevel: "Moderate Active",
    fitnessGoal: "Maintain",
    mealPreference: "Omnivore",
    allergies: "No",
    restrictions: "No",
    intolerances: "No",
    foodsToAvoid: "No",
    performanceMeals: "Pre & Post",
    medicalConditions: "No",
    currentMedications: "No",
    supplements: "Yes",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmChecked) return;

    console.log("User confirmed all details.");
    navigate("/dashboard"); // or submission endpoint
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
            <span className="text-black font-medium">- {item.value}</span>
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
                { label: "Name", value: userData.name },
                { label: "Email", value: userData.email },
                { label: "Phone", value: userData.phone },
                { label: "DOB", value: userData.dob },
                { label: "Gender", value: userData.gender },
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
                { label: "Weight", value: userData.weight },
                { label: "Height", value: userData.height },
                { label: "Activity Level", value: userData.activityLevel },
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
              items={[{ label: "", value: userData.fitnessGoal }]}
            />
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
                { label: "Meal Preference", value: userData.mealPreference },
                { label: "Allergies", value: userData.allergies },
                { label: "Restrictions", value: userData.restrictions },
                { label: "Intolerances", value: userData.intolerances },
                { label: "Foods to Avoid", value: userData.foodsToAvoid },
                {
                  label: "Performance Meals",
                  value: userData.performanceMeals,
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
                  value: userData.medicalConditions,
                },
                {
                  label: "Current Medications",
                  value: userData.currentMedications,
                },
                { label: "Supplements", value: userData.supplements },
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
                className={`font-medium py-3 px-8 rounded-lg w-full md:w-full transition-colors duration-200 ${
                  confirmChecked
                    ? "bg-green-400 text-black hover:bg-green-500 cursor-pointer"
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
