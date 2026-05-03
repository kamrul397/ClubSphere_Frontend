import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import {
  FaArrowRight,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldHeart,
} from "react-icons/fa6";

import useAuth from "../../hooks/useAuth";
import Googlelogin from "./Googlelogin";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signInUser } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const redirectPath = location.state?.from?.pathname || location.state || "/";

  const handleLogin = async (data) => {
    try {
      setLoginLoading(true);

      const result = await signInUser(data.email, data.password);

      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "You have signed in successfully.",
        timer: 1400,
        showConfirmButton: false,
      });

      navigate(redirectPath, { replace: true });

      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Error signing in:", error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/invalid-credential") {
        message = "Invalid email or password.";
      } else if (error.code === "auth/user-not-found") {
        message = "No account found with this email.";
      } else if (error.code === "auth/wrong-password") {
        message = "Incorrect password.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many attempts. Please try again later.";
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: message,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 p-6 md:p-8 shadow-2xl backdrop-blur"
      >
        {/* Soft Background Glow */}
        <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-primary/15 blur-3xl"></div>
        <div className="absolute -left-20 -bottom-20 h-44 w-44 rounded-full bg-secondary/15 blur-3xl"></div>

        <div className="relative">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            {/* <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl lg:mx-0">
              <FaShieldHeart />
            </div> */}

            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              ClubSphere Login
            </p>

            <h2 className="mt-2 text-4xl md:text-5xl font-black text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Sign in to manage clubs, join events, and continue your community
              journey.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(handleLogin)}>
            {/* Email Field */}
            <div className="form-control w-full">
              <label className="label" htmlFor="email">
                <span className="label-text font-bold text-slate-700">
                  Email Address
                </span>
              </label>

              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
                  type="email"
                  placeholder="example@mail.com"
                  className={`input input-bordered w-full bg-white pl-11 focus:input-primary transition-all duration-300 ${
                    errors.email ? "input-error" : ""
                  }`}
                />
              </div>

              {errors.email && (
                <p className="mt-1 text-sm text-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="form-control w-full">
              <label className="label" htmlFor="password">
                <span className="label-text font-bold text-slate-700">
                  Password
                </span>

                <span className="label-text-alt text-primary font-semibold cursor-pointer hover:underline">
                  Forgot?
                </span>
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full bg-white pl-11 pr-12 focus:input-primary transition-all ${
                    errors.password ? "input-error" : ""
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-sm text-error">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loginLoading}
              className="btn btn-primary w-full text-white shadow-lg shadow-primary/25"
            >
              {loginLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider text-xs font-bold uppercase tracking-widest text-slate-400">
              OR
            </div>

            {/* Social Login */}
            <Googlelogin />

            {/* Footer Link */}
            <p className="text-center text-sm text-slate-600">
              New to ClubSphere?{" "}
              <Link
                to="/signup"
                className="font-black text-primary hover:underline"
                state={location.state}
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
