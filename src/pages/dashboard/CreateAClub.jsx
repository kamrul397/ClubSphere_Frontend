import React from "react";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";

const CreateAClub = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const clubInfo = {
      ...data,
      membershipFee: parseFloat(data.membershipFee) || 0,
      status: "pending",
      managerEmail: user?.email || "unknown",
      createdAt: new Date(),
    };
    console.log("clubinfo", clubInfo);

    try {
      // 1. Make the request and wait for the response
      const res = await axiosSecure.post("/clubs", clubInfo);

      // 2. Check the response directly
      if (res.data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Club registration request submitted successfully.",
          icon: "success",
          confirmButtonText: "Cool",
          confirmButtonColor: "#570df8",
        });

        // Recommended: Reset the form here
        // reset();
      }
    } catch (error) {
      // 3. Handle errors (like server down or 404)
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "Ok",
      });
      console.error(error);
    }
  };
  return (
    <div className="min-h-screen bg-base-200 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary p-8 text-primary-content text-center">
          <h2 className="text-3xl font-bold uppercase tracking-wide">
            Start Your Community
          </h2>
          <p className="opacity-90 mt-2">
            Fill in the details below to register your new club on ClubSphere.
          </p>
        </div>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Club Name */}
          <div className="form-control">
            <label className="label font-semibold">Club Name</label>
            <input
              type="text"
              placeholder="e.g. Peak Hikers"
              className={`input input-bordered ${errors.clubName ? "input-error" : ""}`}
              {...register("clubName", { required: "Club name is required" })}
            />
            {errors.clubName && (
              <span className="text-error text-sm mt-1">
                {errors.clubName.message}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label font-semibold">Category</label>
            <select
              className="select select-bordered"
              {...register("category", { required: true })}
            >
              <option value="Photography">Photography</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
              <option value="Book Club">Book Club</option>
            </select>
          </div>

          {/* Location */}
          <div className="form-control">
            <label className="label font-semibold">Location (City/Area)</label>
            <input
              type="text"
              placeholder="e.g. New York, NY"
              className="input input-bordered"
              {...register("location", { required: "Location is required" })}
            />
          </div>

          {/* Membership Fee */}
          <div className="form-control">
            <label className="label font-semibold">Membership Fee ($)</label>
            <input
              type="number"
              defaultValue="0"
              className="input input-bordered"
              {...register("membershipFee", { required: true, min: 0 })}
            />
            <label className="label">
              <span className="label-text-alt text-gray-500">
                Enter 0 for a free club.
              </span>
            </label>
          </div>

          {/* Banner Image URL */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold">Banner Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/your-image-link"
              className="input input-bordered"
              {...register("bannerImage", {
                required: "Please provide a banner image URL",
              })}
            />
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold">Club Description</label>
            <textarea
              className="textarea textarea-bordered h-32"
              placeholder="Tell people what your club is all about..."
              {...register("description", {
                required: "Description is required",
              })}
            ></textarea>
          </div>
          {/* User Email */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold">Your Email</label>
            <input
              type="email"
              disabled={true}
              defaultValue={user?.email || ""}
              className="input input-bordered"
              {...register("userEmail", { required: "Your email is required" })}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="btn btn-primary w-full text-lg">
              Create Club Request
            </button>
            <p className="text-center text-xs text-gray-500 mt-3">
              Note: Your club will be marked as **Pending** until an Admin
              approves it.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAClub;
