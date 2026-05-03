import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";
import {
  FaArrowRight,
  FaCamera,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaIdBadge,
  FaLock,
  FaUserPlus,
} from "react-icons/fa6";

import useAuth from "../../hooks/useAuth";
import Googlelogin from "./Googlelogin";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { registerUser, updateUserProfile } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState("");
  const [registerLoading, setRegisterLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const selectedPhoto = watch("photo");
  const redirectPath = location.state?.from?.pathname || location.state || "/";

  useEffect(() => {
    if (selectedPhoto && selectedPhoto.length > 0) {
      const file = selectedPhoto[0];
      const previewURL = URL.createObjectURL(file);
      setPhotoPreview(previewURL);

      return () => URL.revokeObjectURL(previewURL);
    }

    setPhotoPreview("");
  }, [selectedPhoto]);

  const handleSignUp = async (data) => {
    const normalizedEmail = data.email.toLowerCase().trim();

    try {
      setRegisterLoading(true);

      const result = await registerUser(normalizedEmail, data.password);

      let uploadedURL = "";

      if (data.photo && data.photo.length > 0) {
        const photoFile = data.photo[0];
        const formData = new FormData();
        formData.append("image", photoFile);

        const imageAPIURL = `https://api.imgbb.com/1/upload?key=${
          import.meta.env.VITE_imageUploadUrl
        }`;

        const imageRes = await axios.post(imageAPIURL, formData);
        uploadedURL = imageRes.data.data.display_url;
      }

      const userInfo = {
        name: data.name,
        email: normalizedEmail,
        photoURL: uploadedURL,
      };

      await updateUserProfile({
        displayName: userInfo.name,
        photoURL: userInfo.photoURL,
      });

      await axiosSecure.post("/users", userInfo);

      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Welcome to ClubSphere!",
        timer: 1500,
        showConfirmButton: false,
      });

      reset();
      navigate(redirectPath, { replace: true });

      console.log("Registered user:", result.user);
    } catch (error) {
      console.error("Sign-up process failed:", error);

      let message = "Something went wrong. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered. Please login instead.";
      } else if (error.code === "auth/weak-password") {
        message = "Password is too weak.";
      } else if (error.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (error?.response?.data?.message) {
        message = error.response.data.message;
      }

      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: message,
      });
    } finally {
      setRegisterLoading(false);
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
            <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
              Join ClubSphere
            </p>

            <h2 className="mt-2 text-4xl md:text-5xl font-black text-slate-900">
              Create Account
            </h2>

            <p className="mt-3 text-sm text-slate-500">
              Join ClubSphere, discover local clubs, and become part of active
              communities.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit(handleSignUp)}>
            {/* Name Field */}
            <div className="form-control w-full">
              <label className="label" htmlFor="name">
                <span className="label-text font-bold text-slate-700">
                  Full Name
                </span>
              </label>

              <div className="relative">
                <FaIdBadge className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className={`input input-bordered w-full bg-white pl-11 focus:input-primary transition-all duration-300 ${
                    errors.name ? "input-error" : ""
                  }`}
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                />
              </div>

              {errors.name && (
                <p className="mt-1 text-sm text-error">{errors.name.message}</p>
              )}
            </div>

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
                  type="email"
                  placeholder="example@mail.com"
                  className={`input input-bordered w-full bg-white pl-11 focus:input-primary transition-all duration-300 ${
                    errors.email ? "input-error" : ""
                  }`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Please enter a valid email address",
                    },
                  })}
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
              </label>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full bg-white pl-11 pr-12 focus:input-primary transition-all ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/,
                      message:
                        "Password must include uppercase and lowercase letters",
                    },
                  })}
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

            {/* Photo Upload */}
            <div className="form-control w-full">
              <label className="label" htmlFor="photo">
                <span className="label-text font-bold text-slate-700">
                  Upload Photo
                </span>
                <span className="label-text-alt text-slate-400">Optional</span>
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-[80px_1fr] sm:items-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:mx-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <FaCamera className="text-2xl text-slate-300" />
                  )}
                </div>

                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full bg-white"
                  {...register("photo")}
                />
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={registerLoading}
              className="btn btn-primary w-full text-white shadow-lg shadow-primary/25"
            >
              {registerLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Register Now
                  <FaUserPlus />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="divider text-xs font-bold uppercase tracking-widest text-slate-400">
              OR
            </div>

            {/* Social Login */}
            <Googlelogin state={location.state} />

            {/* Footer Link */}
            <p className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-black text-primary hover:underline"
                state={location.state}
              >
                Sign In
                <FaArrowRight className="ml-1 inline text-xs" />
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
