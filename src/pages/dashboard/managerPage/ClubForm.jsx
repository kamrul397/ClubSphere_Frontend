import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";

import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ClubForm = () => {
  const { id } = useParams(); // If id exists, we are EDITING
  const isEditMode = !!id;

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // 1. Fetch data ONLY if in Edit Mode
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
    enabled: isEditMode, // Only run this query if there is an ID
  });

  // 2. Pre-fill form when data arrives
  useEffect(() => {
    if (isEditMode && club) {
      reset(club); // Automatically fills all matching fields
    }
  }, [club, isEditMode, reset]);

  const onSubmit = async (data) => {
    const clubInfo = {
      ...data,
      membershipFee: parseFloat(data.membershipFee) || 0,
      managerEmail: user?.email || "unknown",
      updatedAt: new Date(),
    };

    try {
      let res;
      if (isEditMode) {
        // UPDATE EXISTING CLUB[cite: 8]
        // Remove _id from data before sending to avoid MongoDB errors
        const { _id, ...updateData } = clubInfo;
        res = await axiosSecure.patch(`/clubs/${id}`, updateData);
      } else {
        // CREATE NEW CLUB[cite: 8]
        clubInfo.status = "pending";
        clubInfo.createdAt = new Date();
        res = await axiosSecure.post("/clubs", clubInfo);
      }

      if (res.data.insertedId || res.data.modifiedCount > 0) {
        Swal.fire({
          title: "Success!",
          text: `Club ${isEditMode ? "updated" : "registration request submitted"} successfully.`,
          icon: "success",
          confirmButtonColor: "#570df8",
        });
        if (!isEditMode) reset();
        navigate("/dashboard/my-clubs");
      }
    } catch (error) {
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  };

  if (isEditMode && isLoading)
    return <div className="p-10 text-center">Loading Club Data...</div>;

  return (
    <div className="min-h-screen bg-base-200 py-10 px-5">
      <div className="max-w-4xl mx-auto bg-base-100 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-primary p-8 text-primary-content text-center">
          <h2 className="text-3xl font-bold uppercase tracking-wide">
            {isEditMode ? "Edit Club Details" : "Start Your Community"}
          </h2>
          <p className="opacity-90 mt-2">
            {isEditMode
              ? `Updating ${club?.clubName}`
              : "Fill in the details to register your new club."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Club Name */}
          <div className="form-control">
            <label className="label font-semibold">Club Name</label>
            <input
              type="text"
              className="input input-bordered"
              {...register("clubName", { required: "Club name is required" })}
            />
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
            <label className="label font-semibold">Location</label>
            <input
              type="text"
              className="input input-bordered"
              {...register("location", { required: true })}
            />
          </div>

          {/* Membership Fee */}
          <div className="form-control">
            <label className="label font-semibold">Membership Fee ($)</label>
            <input
              type="number"
              className="input input-bordered"
              {...register("membershipFee", { required: true })}
            />
          </div>

          {/* Banner Image URL */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold">Banner Image URL</label>
            <input
              type="url"
              className="input input-bordered"
              {...register("bannerImage", { required: true })}
            />
          </div>

          {/* Description */}
          <div className="form-control md:col-span-2">
            <label className="label font-semibold">Club Description</label>
            <textarea
              className="textarea textarea-bordered h-32"
              {...register("description", { required: true })}
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-4">
            <button type="submit" className="btn btn-primary w-full text-lg">
              {isEditMode ? "Save Changes" : "Create Club Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClubForm;
