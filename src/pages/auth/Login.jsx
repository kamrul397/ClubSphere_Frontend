import React from "react";
import { Link } from "react-router"; // or react-router-dom
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";

const Login = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-neutral">Welcome Back</h2>
        <p className="text-gray-500 mt-2">
          Please enter your details to sign in.
        </p>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Email Field */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Email Address</span>
          </label>
          <input
            type="email"
            placeholder="example@mail.com"
            className="input input-bordered w-full focus:input-primary transition-all duration-300"
          />
        </div>

        {/* Password Field */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Password</span>
            <span className="label-text-alt link link-primary">Forgot?</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="input input-bordered w-full focus:input-primary transition-all duration-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          <button className="btn btn-primary w-full text-white shadow-lg">
            Sign In
          </button>
        </div>

        {/* Divider */}
        <div className="divider text-gray-400 text-sm">OR</div>

        {/* Social Login */}
        <button className="btn btn-outline btn-neutral w-full flex items-center gap-3 hover:bg-gray-50">
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        {/* Footer Link */}
        <p className="text-center mt-6 text-gray-600">
          New to ClubSphere?{" "}
          <Link
            to="/auth/register"
            className="text-primary font-bold hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default Login;
