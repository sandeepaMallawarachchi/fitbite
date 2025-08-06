"use client";
import { useEffect } from "react";
import axios from "axios";
import { useFormContext } from "../../context/FormContext";
import SmartMealAssistant from "../../components/SmartMealAssistant";

const DashboardHome = () => {
  const { setFormData } = useFormContext();
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const userId = parsedUser?.id;

  useEffect(() => {
    const fetchAllUserData = async () => {
      try {
        const [userRes, fitnessRes] = await Promise.all([
          axios.get(`https://fitbite-roan.vercel.app/user/getUserById/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`https://fitbite-roan.vercel.app/user/getFitnessById/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const userDetails = userRes.data?.userDetails || {};
        const fitnessDetails = fitnessRes.data?.fitnessDetails || {};

        setFormData({
          userId,
          name: userDetails.name || "",
          email: userDetails.email || "",
          phone: userDetails.phone || "",
          height: userDetails.height || "",
          weight: userDetails.weight || "",
          birthday: userDetails.birthday || "",
          gender: userDetails.gender || "",
          picture: userDetails.picture || "",
          TDEE: fitnessDetails.TDEE || "",
          fitnessGoal: fitnessDetails.fitnessGoal || {},
          mealHabits: fitnessDetails.mealHabits || {},
          dietaryDetails: fitnessDetails.dietaryDetails || {},
          medicalDetails: fitnessDetails.medicalDetails || {},
        });
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    if (userId && token) {
      fetchAllUserData();
    }
  }, [userId]);

  return <SmartMealAssistant userId={userId} />;
};

export default DashboardHome;
