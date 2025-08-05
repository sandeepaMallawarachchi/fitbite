"use client";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      {" "}
      <button
        onClick={() => navigate(-1)}
        className="cursor-pointer fixed bottom-6 right-6 bg-gray-300 hover:bg-gray-400 p-4 rounded-lg transition-colors duration-200"
      >
        <ChevronLeft className="h-5 w-5 text-gray-600" />
      </button>
    </div>
  );
};

export default BackButton;
