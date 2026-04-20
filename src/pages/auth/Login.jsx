import React from "react";
import { Link, useLocation, useNavigate } from "react-router"; // or react-router-dom
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { tr } from "framer-motion/client";
import useAuth from "../../hooks/useAuth";
import Googlelogin from "./Googlelogin";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signInUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = (data) => {
    // Handle login logic here (e.g., API call)
    console.log("Form Data:", data);
    signInUser(data.email, data.password)
      .then((result) => {
        // Signed in
        navigate(location.state || "/");
        console.log("User signed in:", result.user);
      })
      .catch((error) => {
        console.error("Error signing in:", error);
      });
  };
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
      <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
        {/* Email Field */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Email Address</span>
          </label>
          <input
            {...register("email", { required: true })}
            type="email"
            placeholder="example@mail.com"
            className="input input-bordered w-full focus:input-primary transition-all duration-300"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">Email is required</p>
          )}
        </div>

        {/* Password Field */}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">Password</span>
            <span className="label-text-alt link link-primary">Forgot?</span>
          </label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                message: "At least one letter and one number required",
              },
            })}
            type="password"
            placeholder="••••••••"
            className={`input input-bordered w-full focus:input-primary transition-all ${errors.password ? "input-error" : ""}`}
          />

          {/* Shorter way to show errors */}
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}
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
        <Googlelogin></Googlelogin>

        {/* Footer Link */}
        <p className="text-center mt-6 text-gray-600">
          New to ClubSphere?{" "}
          <Link
            to="/signup"
            className="text-primary font-bold hover:underline"
            state={location.state}
          >
            Create an account
          </Link>
        </p>
      </form>
    </motion.div>
  );
};

export default Login;
