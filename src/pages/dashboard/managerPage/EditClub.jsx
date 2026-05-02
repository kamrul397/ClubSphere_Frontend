import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import Swal from "sweetalert2";
import { useEffect } from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EditClub = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // 1. Fetch current club data to pre-fill the form
  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
  });

  // Pre-fill form fields when data is loaded
  useEffect(() => {
    if (club) {
      setValue("clubName", club.clubName);
      setValue("category", club.category);
      setValue("description", club.description);
      setValue("bannerImage", club.bannerImage);
      setValue("membershipFee", club.membershipFee);
    }
  }, [club, setValue]);

  // 2. Mutation for updating the club
  const { mutateAsync: updateClub } = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/clubs/${id}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Updated!", "Club details have been saved.", "success");
      navigate("/dashboard/my-clubs");
    },
  });

  const onSubmit = async (data) => {
    const updatedDoc = {
      ...data,
      membershipFee: parseFloat(data.membershipFee),
      lastEditedAt: new Date(),
    };
    await updateClub(updatedDoc);
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-8 bg-base-100 shadow-2xl rounded-2xl border border-base-200 my-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Edit Club Details</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Club Name */}
          <div className="form-control">
            <label className="label font-semibold">Club Name</label>
            <input
              {...register("clubName", { required: "Name is required" })}
              className="input input-bordered focus:border-primary"
            />
            {errors.clubName && (
              <span className="text-error text-sm">
                {errors.clubName.message}
              </span>
            )}
          </div>

          {/* Category */}
          <div className="form-control">
            <label className="label font-semibold">Category</label>
            <select
              {...register("category")}
              className="select select-bordered w-full"
            >
              <option value="Sports">Sports</option>
              <option value="Cultural">Cultural</option>
              <option value="Tech">Tech</option>
              <option value="Social">Social</option>
            </select>
          </div>
        </div>

        {/* Banner Image URL */}
        <div className="form-control">
          <label className="label font-semibold">Banner Image URL</label>
          <input
            {...register("bannerImage", { required: true })}
            className="input input-bordered"
          />
        </div>

        {/* Membership Fee */}
        <div className="form-control">
          <label className="label font-semibold">Membership Fee ($)</label>
          <input
            type="number"
            {...register("membershipFee", { required: true })}
            className="input input-bordered"
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label font-semibold">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea textarea-bordered h-32"
          ></textarea>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="submit" className="btn btn-primary flex-1 text-white">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard/my-clubs")}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClub;
