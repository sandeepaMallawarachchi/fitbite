import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
      <h1 className="text-[100px] font-extrabold text-[#8FE289] leading-none">404</h1>
      <p className="text-2xl font-semibold text-gray-700 mt-2">Oops! Page not found</p>
      <p className="text-gray-500 mt-1 mb-6">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 bg-[#8FE289] text-white font-medium px-6 py-2 rounded-full hover:bg-[#76cc76] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
