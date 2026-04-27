import React from "react";
import { Link, useLocation, useNavigate } from "react-router"; // or react-router-dom
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { tr } from "framer-motion/client";
import useAuth from "../../hooks/useAuth";
import Googlelogin from "./Googlelogin";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const SignUp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { registerUser, updateUserProfile } = useAuth();

  const handleSignUp = async (data) => {
    try {
      // 1. Create the user in Firebase Auth FIRST
      // This will throw an error immediately if the email exists
      const result = await registerUser(data.email, data.password);

      // 2. ONLY if Firebase succeeds, proceed to image upload
      const photoFile = data.photo[0];
      const formData = new FormData();
      formData.append("image", photoFile);

      const imageAPIURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_imageUploadUrl}`;
      const imageRes = await axios.post(imageAPIURL, formData);
      const uploadedURL = imageRes.data.data.display_url;

      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL: uploadedURL,
      };

      // 3. Save to MongoDB
      await axiosSecure.post("/users", userInfo);

      // 4. Update Profile
      await updateUserProfile({
        displayName: userInfo.name,
        photoURL: userInfo.photoURL,
      });

      navigate(location.state || "/");
    } catch (error) {
      // Check for existing user error
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please login instead.");
      } else {
        console.error("Sign-up process failed:", error.message);
      }
    }
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
              <p className="text-error text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* for uploading photo */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-semibold mb-1">
                Upload Photo
              </span>
            </label>
            <input
              {...register("photo")}
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
            />
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
          <Googlelogin state={location.state}></Googlelogin>

          {/* Footer Link */}
          <p className="text-center mt-6 text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-bold hover:underline"
              state={location.state}
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
