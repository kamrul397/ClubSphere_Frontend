import React from "react";
import { Link } from "react-router"; // or react-router-dom
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { tr } from "framer-motion/client";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleSignUp = (data) => {
    // Handle sign-up logic here (e.g., API call)
    console.log("Form Data:", data);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {/* Header Section */}
      <div className="mb-8 text-center lg:text-left">
        <h2 className="text-4xl font-bold text-neutral">Create Account</h2>
        <p className="text-gray-500 mt-2">
          Join ClubSphere and find your community.
        </p>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit(handleSignUp)}>
        <div className="space-y-4">
          {/* Name Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Full Name</span>
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="John Doe"
              className="input input-bordered w-full focus:input-primary transition-all duration-300"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Email Address</span>
            </label>
            <input
              type="email"
              {...register("email", { required: true, pattern: /^\S+@\S+$/i })}
              placeholder="example@mail.com"
              className="input input-bordered w-full focus:input-primary transition-all duration-300"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 text-sm mt-1">Email is required</p>
            )}
            {errors.email?.type === "pattern" && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid email address
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold">Password</span>
            </label>
            <input
              {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
              })}
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full focus:input-primary transition-all duration-300"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-sm mt-1">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters
              </p>
            )}
            {errors.password?.type === "pattern" && (
              <p className="text-red-500 text-sm mt-1">
                Password must contain at least one letter and one number
              </p>
            )}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <button className="btn btn-primary w-full text-white shadow-lg">
              Register Now
            </button>
          </div>

          {/* Divider */}
          <div className="divider text-gray-400 text-sm">OR</div>

          {/* Social Login */}
          <button className="btn btn-outline btn-neutral w-full flex items-center gap-3 hover:bg-gray-50">
            <FcGoogle className="text-2xl" />
            Sign up with Google
          </button>

          {/* Footer Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="text-primary font-bold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default SignUp;
