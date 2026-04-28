import React from "react";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const BeACreator = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data) => {
    const applicationData = {
      ...data,
      roleRequested: "clubManager",
      status: "pending",
      timestamp: new Date(),
    };

    try {
      // Logic for backend call
      const res = await axiosSecure.post("/club-managers", applicationData);
      console.log("application data", applicationData);
      if (res.data.insertedId) {
        Swal.fire(
          "Submitted!",
          "Your application is pending admin review.",
          "success",
        );
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Failed to submit application.",
        "error",
        error.response.data.message,
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold text-center text-primary">
        Be A Club Manager
      </h1>
      <p className="text-center mt-4 text-gray-600 max-w-2xl mx-auto">
        Join our community of leaders! Fill out the information below to apply
        for a manager role.
      </p>

      <form
        className="max-w-md mx-auto mt-8 p-8 bg-base-100 rounded-xl shadow-lg border border-base-300"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Name Field */}
        <div className="form-control mb-4">
          <label className="label font-bold" htmlFor="name">
            <span className="label-text">Manager Name</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`}
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && (
            <p className="text-error text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field (Read Only) */}
        <div className="form-control mb-4">
          <label className="label font-bold" htmlFor="email">
            <span className="label-text">Email Address</span>
          </label>
          <input
            type="email"
            id="email"
            readOnly
            className="input input-bordered w-full bg-gray-100 cursor-not-allowed"
            {...register("email")}
          />
        </div>

        {/* NID Number Field */}
        <div className="form-control mb-4">
          <label className="label font-bold" htmlFor="nid">
            <span className="label-text">NID Number</span>
          </label>
          <input
            type="text"
            id="nid"
            placeholder="e.g. 1234567890"
            className={`input input-bordered w-full ${errors.nid ? "input-error" : ""}`}
            {...register("nid", {
              required: "NID number is required",
              pattern: {
                value: /^[0-9]+$/,
                message: "Please enter a valid numeric NID",
              },
              minLength: {
                value: 10,
                message: "NID must be at least 10 digits",
              },
            })}
          />
          {errors.nid && (
            <p className="text-error text-xs mt-1">{errors.nid.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div className="form-control mb-6">
          <label className="label font-bold" htmlFor="address">
            <span className="label-text">Current Address</span>
          </label>
          <textarea
            id="address"
            placeholder="Enter your full address"
            className={`textarea textarea-bordered w-full ${errors.address ? "textarea-error" : ""}`}
            {...register("address", { required: "Address is required" })}
          ></textarea>
          {errors.address && (
            <p className="text-error text-xs mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-full">
          Submit Application
        </button>
      </form>
    </div>
  );
};

export default BeACreator;
