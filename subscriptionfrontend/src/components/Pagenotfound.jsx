import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1c1c1c] to-[#2a003f] text-gray-200 px-6 text-center">
      {/* 404 Number */}
      <h1 className="text-8xl md:text-9xl font-extrabold text-purple-500 drop-shadow-lg">
        404
      </h1>

      {/* Message */}
      <h2 className="text-2xl md:text-3xl font-semibold mt-4 text-purple-300">
        Oops! Page Not Found
      </h2>

      <p className="mt-3 text-gray-400 max-w-md">
        The page you are looking for doesn’t exist or might have been moved.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-white"
        >
          Go to Dashboard
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-gray-300"
        >
          Go Back
        </button>
      </div>

      {/* Small footer */}
      <p className="text-sm text-gray-500 mt-10">
        Subscription Tracker © {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default NotFound;
