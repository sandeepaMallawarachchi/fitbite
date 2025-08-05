export type FormData = {
  userId?: string;
  TDEE?: string;
  name?: string;
  email?: string;
  phone?: string;
  weight?: string;
  height?: string;
  birthday?: string;
  gender?: string;
  activityLevel?: string;
  selectedGoal?: string;
  goalWeight?: string;
  progressRate?: string;
  picture?: string;

  // fitnessGoal
  fitnessGoal?: {
    primaryGoal?: "Maintain" | "FatLoss" | "MuscleGain";
    goalWeight?: string;
    progress?: string;
  };

  // mealHabits
  mealHabits?: {
    dailyMeals?: string;
    mealsSchedule?: {
      breakfast?: string;
      lunch?: string;
      dinner?: string;
    };
    cookAtHome?: "Daily" | "Rarely" | "Few times/week";
    ability?: "Yes" | "No";
    grosaryBudget?: "Friendly" | "Moderate" | "Flexible";
  };

  // dietaryDetails
  dietaryDetails?: {
    preference?: "Omnivore" | "Vegan" | "Vegitarian";
    avoid?: "Yes" | "No";
    restrictions?: "Yes" | "No";
    allergies?: ("Dairy" | "Nuts" | "Shellfish" | "Gluten" | "Other")[];
    performanceMeals?: ("preWorkout" | "postWorkout")[];
  };

  // medicalDetails
  medicalDetails?: {
    medicalConditions?: "Yes" | "No";
    medicationsAffect?: "Yes" | "No";
    supplements?: "Yes" | "No";
    openToSupplements?: "Yes" | "No";
    notes?: string;
  };
};