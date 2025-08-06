"use client";
import { useNavigate } from "react-router-dom";
import { useFormContext } from "../context/FormContext";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import ProfilePictureUploader from "../components/ProfilePictureUploader";
import { useState } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const { formData } = useFormContext();
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("formData");
    const parsedUser = user ? JSON.parse(user) : null;
    const userId = parsedUser?.userId;
    const { logout } = useAuth();
    const [showUploader, setShowUploader] = useState(false);

    const handleRestart = async () => {
        const confirmRestart = window.confirm(
            "Are you sure you want to restart your profile? This will permanently delete all your current data."
        );

        if (!confirmRestart) return;

        try {
            await axios.delete(`https://fitbite-roan.vercel.app/user/restart/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            logout();
            navigate("/");
        } catch (error) {
            console.log("Error Restarting Account");
            toast.error("Account restarting failed! Please try again");
        }
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
        <div className="rounded-md p-2">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-sm font-semibold flex items-center gap-2 text-[#7F7F7F]">
                    {icon} {title}
                </h2>
                <button
                    type="button"
                    className="text-gray-500 hover:text-black cursor-pointer"
                    onClick={() => {
                        localStorage.setItem("editedProfile", "true");
                        if (editStep) navigate(editStep);
                    }}                >
                    <img src="/edit.svg" alt="Edit" className="w-4 h-4" />
                </button>
            </div>
            <ul className="text-sm text-gray-700">
                {items.map((item) => (
                    <li key={item.label} className="flex justify-between py-1 border-b border-gray-200 font-semibold">
                        <span>{item.label}</span>
                        <span className="text-black font-medium">{item.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="w-full px-5 pt-6 pb-16">
            <div className="max-w-7xl mx-auto p-4">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Profile Card */}
                    <div className="md:w-1/2 sm:pr-5 flex flex-col items-center sm:border-r">
                        <div className="relative w-28 h-28">
                            <img
                                src={formData?.picture || "/avatar.png"}
                                alt="Avatar"
                                onClick={() => setShowUploader(true)}
                                className="w-28 h-28 rounded-full object-cover cursor-pointer hover:opacity-80"
                            />

                            {showUploader && (
                                <ProfilePictureUploader
                                    currentImage={formData?.picture}
                                    userId={userId}
                                    token={token}
                                    onUploadSuccess={(url) => {
                                        const updated = { ...formData, picture: url };
                                        localStorage.setItem("formData", JSON.stringify(updated));
                                        window.location.reload();
                                    }}
                                    onClose={() => setShowUploader(false)}
                                />
                            )}

                            <img
                                src="/edit.svg"
                                className="absolute bottom-1 right-1 w-4 h-4 cursor-pointer"
                                onClick={() => setShowUploader(true)}
                                alt="Edit"
                            />
                        </div>
                        <h1 className="text-xl font-semibold mt-4 sm:text-left text-center">{formData?.name || "-"}</h1>

                        <div className="mt-6 w-full">
                            <Section
                                icon={<img src="/user.svg" className="w-4 h-4" />}
                                title="Personal Details"
                                editStep="/SignUpStep1"
                                items={[
                                    { label: "Name", value: formData?.name || "-" },
                                    { label: "Email", value: formData?.email || "-" },
                                    { label: "Phone", value: formData?.phone || "-" },
                                    {
                                        label: "DOB",
                                        value: formData?.birthday
                                            ? new Date(formData.birthday).toLocaleDateString("en-GB")
                                            : "-",
                                    },
                                    { label: "Gender", value: formData?.gender || "-" },
                                ]}
                            />
                        </div>
                    </div>

                    {/* Right Sections */}
                    <div className="md:w-1/2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-0 gap-10">
                            <div className="sm:border-r sm:pr-5">
                                <Section
                                    icon={<img src="/star.svg" className="w-4 h-4" />}
                                    title="Body Measurements"
                                    editStep="/SignUpStep1"
                                    items={[
                                        { label: "Weight", value: formData?.weight || "-" },
                                        { label: "Height", value: formData?.height || "-" },
                                        { label: "Activity Level", value: formData?.activityLevel || "-" },
                                    ]}
                                />
                            </div>
                            <div className="sm:pl-5">
                                <Section
                                    icon={<img src="/heart.svg" className="w-4 h-4" />}
                                    title="Health & Medical Details"
                                    editStep="/SignUpStep5"
                                    items={[
                                        { label: "Medical Conditions", value: formData?.medicalDetails?.medicalConditions || "No" },
                                        { label: "Current Medications", value: formData?.medicalDetails?.medicationsAffect || "No" },
                                        { label: "Supplements", value: formData?.medicalDetails?.supplements || "No" },
                                    ]}
                                />
                            </div>
                        </div>

                        <hr className="sm:block hidden" />

                        <div className="grid grid-cols-1 md:grid-cols-2 sm:gap-0 gap-10">
                            <div className="sm:border-r sm:pr-5">
                                <Section
                                    icon={<img src="/pie.svg" className="w-4 h-4" />}
                                    title="Dietary Details"
                                    editStep="/SignUpStep4"
                                    items={[
                                        { label: "Meal Preference", value: formData?.dietaryDetails?.preference || "-" },
                                        { label: "Allergies", value: (formData?.dietaryDetails?.allergies || []).join(", ") || "No" },
                                        { label: "Restrictions", value: formData?.dietaryDetails?.restrictions || "No" },
                                        { label: "Foods to Avoid", value: formData?.dietaryDetails?.avoid || "No" },
                                        {
                                            label: "Performance Meals",
                                            value: (formData?.dietaryDetails?.performanceMeals || []).join(" & ") || "No",
                                        },
                                    ]}
                                />
                            </div>
                            <div className="sm:pl-5">
                                <Section
                                    icon={<img src="/pin.svg" className="w-4 h-4" />}
                                    title="Fitness Goal"
                                    editStep="/SignUpStep2"
                                    items={[
                                        { label: "Goal", value: formData?.fitnessGoal?.primaryGoal || "-" },
                                    ]}
                                />
                                <p className="mt-10 flex items-center gap-2">
                                    <img src="/info-circle.png" alt="Info Icon" />
                                    <span className="font-semibold text-sm">This Data Supports Your Current Process</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Restart Section */}
                <div className="mt-10 flex sm:flex-row flex-col w-full justify-between items-end sm:gap-0 gap-5">
                    <div>
                        <p className="mb-5 flex items-center gap-2">
                            <img src="/info-circle.png" alt="Info Icon" />
                            <span className="text-[#7F7F7F] font-semibold text-sm">Warning</span>
                        </p>
                        <p className="text-sm font-semibold">
                            Restarting will delete your current personal information. The new information will be used going forward.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleRestart}
                        className='font-semibold cursor-pointer py-3 px-8 rounded-lg w-full md:w-1/4 transition-colors duration-200 bg-[#89E2AD] text-black hover:bg-green-400'
                    >
                        Restart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
