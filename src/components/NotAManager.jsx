import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCrown } from "react-icons/fa"; // Using an icon to represent 'Creator'

const NotAManager = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center bg-white p-10 rounded-2xl shadow-2xl border border-gray-100"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-purple-100 rounded-full text-purple-600">
            <FaCrown size={48} />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Manager Access Required
        </h1>
        <p className="text-gray-600 mb-8">
          You are currently logged in as a **Member**. To create and manage your
          own clubs, you need to apply for a Manager account.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/dashboard/be-a-creator")}
            className="w-full py-3 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary-focus transition-all shadow-lg active:scale-95"
          >
            Be a Club Manager
          </button>

          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-2 px-4 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-2 px-4 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200"
            >
              Home
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotAManager;
