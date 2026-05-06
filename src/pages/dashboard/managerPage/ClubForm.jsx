import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaArrowLeft,
  FaCircleCheck,
  FaFloppyDisk,
  FaImage,
  FaLayerGroup,
  FaLocationDot,
  FaPaperPlane,
  FaPenToSquare,
  FaSackDollar,
  FaTag,
} from "react-icons/fa6";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ClubForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;

  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      clubName: "",
      category: "Photography",
      location: "",
      membershipFee: 0,
      bannerImage: "",
      description: "",
    },
  });

  const bannerPreview = watch("bannerImage");

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
    enabled: isEditMode,
  });

  useEffect(() => {
    if (isEditMode && club) {
      reset({
        clubName: club.clubName || "",
        category: club.category || "Photography",
        location: club.location || "",
        membershipFee: club.membershipFee || 0,
        bannerImage: club.bannerImage || "",
        description: club.description || "",
      });
    }
  }, [club, isEditMode, reset]);

  const onSubmit = async (data) => {
    const clubInfo = {
      ...data,
      membershipFee: Number(data.membershipFee) || 0,
      managerEmail: user?.email || "unknown",
      managerName: user?.displayName || "Unknown Manager",
      updatedAt: new Date(),
    };

    try {
      let res;

      if (isEditMode) {
        res = await axiosSecure.patch(`/clubs/${id}`, clubInfo);
      } else {
        clubInfo.status = "pending";
        clubInfo.createdAt = new Date();

        res = await axiosSecure.post("/clubs", clubInfo);
      }

      if (
        res.data.insertedId ||
        res.data.modifiedCount > 0 ||
        res.data.matchedCount > 0
      ) {
        Swal.fire({
          icon: "success",
          title: isEditMode ? "Club Updated" : "Club Request Submitted",
          text: isEditMode
            ? "Your club information has been updated successfully."
            : "Your club request is now pending admin approval.",
          timer: 1700,
          showConfirmButton: false,
        });

        if (!isEditMode) reset();

        navigate("/dashboard/my-clubs");
      }
    } catch (error) {
      console.error(error);

      Swal.fire(
        "Error",
        error?.response?.data?.message || "Something went wrong.",
        "error",
      );
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#17203a] to-[#3a2348] p-[1px] shadow-xl">
          <div className="relative rounded-3xl bg-slate-900/90 p-5 md:p-6 text-white">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/25 blur-3xl"></div>
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>

            <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Club Manager Panel
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                  {isEditMode ? "Edit Club Details" : "Create a New Club"}
                </h1>

                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  {isEditMode
                    ? "Update your club information, banner, category, location, and membership fee."
                    : "Submit a new club request. After admin approval, members can discover and join your club."}
                </p>
              </div>

              <Link
                to="/dashboard/my-clubs"
                className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"
              >
                <FaArrowLeft />
                Back to My Clubs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Preview / Info Card */}
          <div className="xl:col-span-1 space-y-4">
            <div className="rounded-[2rem] border border-base-200 bg-base-100 p-5 shadow-sm">
              <div className="relative overflow-hidden rounded-2xl border border-base-200 bg-base-200 h-48">
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    alt="Club banner preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/600x300?text=Invalid+Image+URL";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-base-content/40">
                    <FaImage className="text-4xl mb-2" />
                    <p className="text-sm font-bold">Banner Preview</p>
                  </div>
                )}

                <div className="absolute left-3 top-3 badge badge-primary text-white">
                  {watch("category") || "Club"}
                </div>
              </div>

              <h2 className="mt-4 text-2xl font-black text-base-content">
                {watch("clubName") || "Your Club Name"}
              </h2>

              <p className="mt-2 text-sm text-base-content/60 line-clamp-3">
                {watch("description") ||
                  "Your club description preview will appear here."}
              </p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <FaLocationDot className="text-primary" />
                  {watch("location") || "Club location"}
                </div>

                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <FaSackDollar className="text-success" />
                  {Number(watch("membershipFee")) > 0
                    ? `$${watch("membershipFee")} membership fee`
                    : "Free membership"}
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-warning/20 bg-warning/10 p-5">
              <div className="flex items-start gap-3">
                <FaCircleCheck className="mt-1 text-warning" />
                <div>
                  <p className="text-sm font-bold text-warning">
                    Approval Required
                  </p>
                  <p className="mt-1 text-xs text-base-content/60">
                    New clubs are submitted as pending. Admin approval is needed
                    before members can join.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="xl:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-[2rem] border border-base-200 bg-base-100 p-5 md:p-7 shadow-xl"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl">
                  {isEditMode ? <FaPenToSquare /> : <FaLayerGroup />}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-base-content">
                    {isEditMode ? "Update Club Form" : "Club Request Form"}
                  </h2>
                  <p className="text-sm text-base-content/60">
                    Fill all required information carefully.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Club Name */}
                <div className="form-control">
                  <label className="label" htmlFor="clubName">
                    <span className="label-text font-bold">Club Name</span>
                  </label>

                  <div className="relative">
                    <FaLayerGroup className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      id="clubName"
                      type="text"
                      placeholder="Example: Photography Club"
                      className={`input input-bordered w-full pl-11 bg-base-100 ${
                        errors.clubName ? "input-error" : ""
                      }`}
                      {...register("clubName", {
                        required: "Club name is required",
                        minLength: {
                          value: 3,
                          message: "Club name must be at least 3 characters",
                        },
                      })}
                    />
                  </div>

                  {errors.clubName && (
                    <p className="text-error text-xs mt-1">
                      {errors.clubName.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div className="form-control">
                  <label className="label" htmlFor="category">
                    <span className="label-text font-bold">Category</span>
                  </label>

                  <div className="relative">
                    <FaTag className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35 z-10" />

                    <select
                      id="category"
                      className={`select select-bordered w-full pl-11 bg-base-100 ${
                        errors.category ? "select-error" : ""
                      }`}
                      {...register("category", {
                        required: "Category is required",
                      })}
                    >
                      <option value="Photography">Photography</option>
                      <option value="Sports">Sports</option>
                      <option value="Tech">Tech</option>
                      <option value="Book Club">Book Club</option>
                      <option value="Music">Music</option>
                      <option value="Hiking">Hiking</option>
                      <option value="Social">Social</option>
                      <option value="Education">Education</option>
                    </select>
                  </div>

                  {errors.category && (
                    <p className="text-error text-xs mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="form-control">
                  <label className="label" htmlFor="location">
                    <span className="label-text font-bold">Location</span>
                  </label>

                  <div className="relative">
                    <FaLocationDot className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      id="location"
                      type="text"
                      placeholder="Example: Dhaka, Bangladesh"
                      className={`input input-bordered w-full pl-11 bg-base-100 ${
                        errors.location ? "input-error" : ""
                      }`}
                      {...register("location", {
                        required: "Location is required",
                      })}
                    />
                  </div>

                  {errors.location && (
                    <p className="text-error text-xs mt-1">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                {/* Membership Fee */}
                <div className="form-control">
                  <label className="label" htmlFor="membershipFee">
                    <span className="label-text font-bold">Membership Fee</span>
                    <span className="label-text-alt">0 = Free</span>
                  </label>

                  <div className="relative">
                    <FaSackDollar className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      id="membershipFee"
                      type="number"
                      min="0"
                      step="1" // Only allows whole numbers
                      placeholder="0"
                      className={`input input-bordered w-full pl-11 bg-base-100 ${
                        errors.membershipFee ? "input-error" : ""
                      }`}
                      onKeyDown={(e) => {
                        // Prevent entering non-integer characters
                        if ([".", ",", "e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      {...register("membershipFee", {
                        required: "Membership fee is required",
                        validate: (value) => {
                          // Ensure value is an integer
                          return (
                            Number.isInteger(Number(value)) ||
                            "Membership fee must be an integer"
                          );
                        },
                      })}
                    />
                  </div>

                  {errors.membershipFee && (
                    <p className="text-error text-xs mt-1">
                      {errors.membershipFee.message}
                    </p>
                  )}
                </div>

                {/* Banner Image */}
                <div className="form-control md:col-span-2">
                  <label className="label" htmlFor="bannerImage">
                    <span className="label-text font-bold">
                      Banner Image URL
                    </span>
                  </label>

                  <div className="relative">
                    <FaImage className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      id="bannerImage"
                      type="url"
                      placeholder="https://example.com/banner.jpg"
                      className={`input input-bordered w-full pl-11 bg-base-100 ${
                        errors.bannerImage ? "input-error" : ""
                      }`}
                      {...register("bannerImage", {
                        required: "Banner image URL is required",
                      })}
                    />
                  </div>

                  {errors.bannerImage && (
                    <p className="text-error text-xs mt-1">
                      {errors.bannerImage.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div className="form-control md:col-span-2">
                  <label className="label" htmlFor="description">
                    <span className="label-text font-bold">
                      Club Description
                    </span>
                  </label>

                  <textarea
                    id="description"
                    rows="5"
                    placeholder="Write a short description about your club..."
                    className={`textarea textarea-bordered w-full bg-base-100 resize-none ${
                      errors.description ? "textarea-error" : ""
                    }`}
                    {...register("description", {
                      required: "Description is required",
                      minLength: {
                        value: 20,
                        message:
                          "Description should be at least 20 characters long",
                      },
                    })}
                  ></textarea>

                  {errors.description && (
                    <p className="text-error text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-base-200/60 p-4">
                <div>
                  <p className="text-sm font-bold text-base-content">
                    {isEditMode ? "Ready to update?" : "Ready to submit?"}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {isEditMode
                      ? "Your updated club information will be saved."
                      : "Admin will review your club request before publishing."}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary text-white min-w-[210px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {isEditMode ? "Saving..." : "Submitting..."}
                    </>
                  ) : isEditMode ? (
                    <>
                      <FaFloppyDisk />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Create Club Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="h-2"></div>
      </div>
    </div>
  );
};

export default ClubForm;
