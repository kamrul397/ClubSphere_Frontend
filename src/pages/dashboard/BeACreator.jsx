import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaArrowRight,
  FaCircleCheck,
  FaEnvelope,
  FaIdCard,
  FaLayerGroup,
  FaLocationDot,
  FaPaperPlane,
  FaUserShield,
  FaXmark,
  FaClock,
  FaHouse,
} from "react-icons/fa6";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const BeACreator = () => {
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  const { user } = useAuth();
  const { role, isRoleLoading } = useRole();

  const [applicationSent, setApplicationSent] = useState(false);
  const [submittedAt, setSubmittedAt] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      nid: "",
      address: "",
    },
  });

  const {
    data: applicationCheck = {},
    isLoading: applicationLoading,
    refetch: refetchApplication,
  } = useQuery({
    queryKey: ["myManagerApplication", user?.email],
    enabled: !!user?.email && role === "member",
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(
          `/club-managers/my-application/${user.email}`,
        );

        return res.data || { hasApplication: false, application: null };
      } catch (error) {
        console.error("Application check failed:", {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.baseURL + error.config?.url,
        });

        return { hasApplication: false, application: null };
      }
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user?.displayName || "",
        email: user?.email || "",
        nid: "",
        address: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (!user?.email) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login before submitting your application.",
      });
      return;
    }

    if (role !== "member") {
      Swal.fire({
        icon: "warning",
        title: "Access Denied",
        text: "Only members can apply to become a Club Manager.",
      });
      return;
    }

    const applicationData = {
      name: data.name.trim(),
      email: user.email,
      photoURL: user?.photoURL || "",
      nid: data.nid.trim(),
      address: data.address.trim(),
    };

    try {
      console.log("API URL:", import.meta.env.VITE_API_URL);
      console.log("Submitting manager application:", applicationData);

      // Make sure this Firebase user also exists in MongoDB.
      // Your backend /club-managers route rejects if user is not found.
      await axiosPublic.post("/users", {
        name: applicationData.name,
        email: user.email,
        photoURL: user?.photoURL || "",
        lastLogin: new Date(),
      });

      const res = await axiosSecure.post("/club-managers", applicationData);

      if (res.data?.insertedId) {
        setApplicationSent(true);
        setSubmittedAt(new Date());
        await refetchApplication();

        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your application is pending admin review.",
          timer: 1600,
          showConfirmButton: false,
        });

        reset({
          name: user?.displayName || applicationData.name,
          email: user?.email || "",
          nid: "",
          address: "",
        });
      } else {
        Swal.fire({
          icon: "info",
          title: "Request Completed",
          text: res.data?.message || "Your application request was processed.",
        });

        await refetchApplication();
      }
    } catch (error) {
      console.error("Manager application submit failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.baseURL + error.config?.url,
      });

      const backendMessage = error?.response?.data?.message;

      let message = backendMessage || "Failed to submit application.";

      if (error.response?.status === 401) {
        message =
          "Authorization failed. Please logout, login again, and try once more.";
      }

      if (error.response?.status === 403) {
        message =
          backendMessage ||
          "You are not allowed to submit this application with this account.";
      }

      Swal.fire({
        icon: "error",
        title: "Application Failed",
        text: message,
      });

      await refetchApplication();
    }
  };

  const existingApplication = applicationCheck?.application;
  const hasActiveApplication =
    applicationSent || applicationCheck?.hasApplication;

  const applicationStatus = existingApplication?.status || "pending";

  const submittedDate = submittedAt
    ? submittedAt.toLocaleDateString()
    : existingApplication?.createdAt
      ? new Date(existingApplication.createdAt).toLocaleDateString()
      : "Just now";

  if (isRoleLoading || !role || applicationLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (role !== "member") {
    return (
      <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
        <div className="h-full flex items-center justify-center">
          <div className="max-w-2xl w-full rounded-[2rem] border border-base-200 bg-base-100 p-8 shadow-xl text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-error/10 text-error text-3xl">
              <FaXmark />
            </div>

            <h2 className="text-3xl font-black text-base-content">
              Access Denied
            </h2>

            <p className="mt-3 text-base-content/60">
              This page is only for members who want to apply for a Club Manager
              role. Admins and existing Club Managers cannot submit this
              application.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
              <Link to="/" className="btn btn-outline">
                Go Home
              </Link>

              <Link
                to={
                  role === "admin"
                    ? "/dashboard/admin-overview"
                    : "/dashboard/manager-overview"
                }
                className="btn btn-primary text-white"
              >
                Go Dashboard
                <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (hasActiveApplication) {
    return (
      <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
        <div className="h-full flex items-center justify-center">
          <div className="max-w-3xl w-full rounded-[2rem] border border-success/20 bg-base-100 p-8 shadow-xl text-center">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-success/10 text-success text-4xl">
              <FaCircleCheck />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.24em] text-success">
              Request Sent
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl font-black text-base-content">
              You have successfully submitted your Club Manager request.
            </h2>

            <p className="mt-3 text-base-content/60 max-w-xl mx-auto">
              Your application is now pending admin review. After approval, your
              role will update to Club Manager and you will get access to club
              management tools.
            </p>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="rounded-2xl border border-base-200 bg-base-200/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
                    <FaClock />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Status
                    </p>
                    <p className="font-black text-warning capitalize">
                      {applicationStatus === "approved"
                        ? "Approved"
                        : "Pending Review"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-base-200 bg-base-200/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaUserShield />
                  </div>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                      Submitted
                    </p>
                    <p className="font-black">{submittedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/dashboard/member"
                className="btn btn-primary text-white"
              >
                Go Member Dashboard
                <FaArrowRight />
              </Link>

              <Link to="/" className="btn btn-outline">
                <FaHouse />
                Go Home
              </Link>
            </div>
          </div>
        </div>
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
                  ClubSphere Creator Program
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                  Become a Club Manager
                </h1>

                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  Apply to create clubs, manage members, organize events, and
                  lead your own community on ClubSphere.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center">
                <FaUserShield className="mx-auto mb-2 text-2xl text-primary" />
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">
                  Current Role
                </p>
                <p className="text-lg font-black capitalize">{role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left Info Card */}
          <div className="xl:col-span-1 space-y-4">
            <div className="rounded-[2rem] border border-base-200 bg-base-100 p-6 shadow-sm">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl">
                <FaLayerGroup />
              </div>

              <h2 className="mt-4 text-2xl font-black text-base-content">
                What you can do
              </h2>

              <p className="mt-2 text-sm text-base-content/60">
                Once approved, you will get access to the Club Manager dashboard
                and tools.
              </p>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl bg-base-200/50 p-3">
                  <FaCircleCheck className="mt-1 text-success" />
                  <div>
                    <p className="font-bold text-sm">Create Clubs</p>
                    <p className="text-xs opacity-60">
                      Submit club profiles for admin approval.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-base-200/50 p-3">
                  <FaCircleCheck className="mt-1 text-success" />
                  <div>
                    <p className="font-bold text-sm">Manage Members</p>
                    <p className="text-xs opacity-60">
                      View members who joined your approved clubs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl bg-base-200/50 p-3">
                  <FaCircleCheck className="mt-1 text-success" />
                  <div>
                    <p className="font-bold text-sm">Create Events</p>
                    <p className="text-xs opacity-60">
                      Organize events under your clubs.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-warning/20 bg-warning/10 p-5">
              <p className="text-sm font-bold text-warning">
                Application Review
              </p>
              <p className="mt-1 text-xs text-base-content/60">
                Your application will be reviewed by an admin. Until approval,
                your role will remain Member.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="xl:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="rounded-[2rem] border border-base-200 bg-base-100 p-5 md:p-7 shadow-xl"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-black text-base-content">
                  Application Form
                </h2>
                <p className="text-sm text-base-content/60">
                  Please provide accurate information for admin verification.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Field */}
                <div className="form-control">
                  <label className="label" htmlFor="name">
                    <span className="label-text font-bold">Manager Name</span>
                  </label>

                  <div className="relative">
                    <FaUserShield className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
                      className={`input input-bordered w-full pl-11 bg-base-100 ${
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
                    <p className="text-error text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="form-control">
                  <label className="label" htmlFor="email">
                    <span className="label-text font-bold">Email Address</span>
                  </label>

                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      type="email"
                      id="email"
                      readOnly
                      className="input input-bordered w-full pl-11 bg-base-200 cursor-not-allowed"
                      {...register("email", {
                        required: "Email is required",
                      })}
                    />
                  </div>

                  {errors.email && (
                    <p className="text-error text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* NID Field */}
                <div className="form-control md:col-span-2">
                  <label className="label" htmlFor="nid">
                    <span className="label-text font-bold">NID Number</span>
                  </label>

                  <div className="relative">
                    <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/35" />

                    <input
                      type="text"
                      id="nid"
                      placeholder="Enter your NID number"
                      className={`input input-bordered w-full pl-11 bg-base-100 ${
                        errors.nid ? "input-error" : ""
                      }`}
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
                  </div>

                  {errors.nid && (
                    <p className="text-error text-xs mt-1">
                      {errors.nid.message}
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div className="form-control md:col-span-2">
                  <label className="label" htmlFor="address">
                    <span className="label-text font-bold">
                      Current Address
                    </span>
                  </label>

                  <div className="relative">
                    <FaLocationDot className="absolute left-4 top-4 text-base-content/35" />

                    <textarea
                      id="address"
                      rows="4"
                      placeholder="Enter your full address"
                      className={`textarea textarea-bordered w-full pl-11 bg-base-100 resize-none ${
                        errors.address ? "textarea-error" : ""
                      }`}
                      {...register("address", {
                        required: "Address is required",
                        minLength: {
                          value: 10,
                          message: "Address must be at least 10 characters",
                        },
                      })}
                    ></textarea>
                  </div>

                  {errors.address && (
                    <p className="text-error text-xs mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl bg-base-200/60 p-4">
                <div>
                  <p className="text-sm font-bold text-base-content">
                    Ready to submit?
                  </p>
                  <p className="text-xs text-base-content/60">
                    Admin will review your request and update your role if
                    approved.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !user?.email}
                  className="btn btn-primary text-white min-w-[190px]"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane />
                      Submit Application
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

export default BeACreator;
