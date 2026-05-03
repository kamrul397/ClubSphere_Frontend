import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Swal from "sweetalert2";
import {
  FaEnvelope,
  FaUserShield,
  FaCalendarDays,
  FaUsers,
  FaLayerGroup,
  FaArrowRight,
  FaCircleCheck,
  FaIdBadge,
  FaCamera,
  FaPenToSquare,
  FaXmark,
  FaFloppyDisk,
} from "react-icons/fa6";

import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Profile = () => {
  const { user, updateUserProfile } = useAuth();
  const { role } = useRole();
  const axiosSecure = useAxiosSecure();

  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const getDashboardPath = () => {
    if (role === "admin") return "/dashboard/users-management";
    if (role === "clubManager") return "/dashboard/manager-overview";
    return "/dashboard/member";
  };

  const roleLabel =
    role === "clubManager"
      ? "Club Manager"
      : role === "admin"
        ? "Admin"
        : "Member";

  const handleCancelEdit = () => {
    setName(user?.displayName || "");
    setPhotoURL(user?.photoURL || "");
    setIsEditing(false);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      Swal.fire("Error", "User email not found.", "error");
      return;
    }

    try {
      setUpdating(true);

      await updateUserProfile({
        displayName: name,
        photoURL: photoURL,
      });

      await axiosSecure.patch(`/users/profile/${user.email}`, {
        name,
        photoURL,
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile information has been updated successfully.",
        timer: 1600,
        showConfirmButton: false,
      });

      setIsEditing(false);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Update Failed",
        error?.response?.data?.message || "Could not update your profile.",
        "error",
      );
    } finally {
      setUpdating(false);
    }
  };

  const currentPhoto =
    photoURL ||
    user?.photoURL ||
    "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 px-4 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-900 via-[#17203a] to-[#3a2348] p-[1px] shadow-2xl">
          <div className="relative rounded-[2rem] bg-slate-900/90 p-6 md:p-8 text-white">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"></div>

            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="avatar">
                <div className="w-32 rounded-3xl ring ring-primary ring-offset-4 ring-offset-slate-900">
                  <img
                    src={currentPhoto}
                    alt={user?.displayName || "User"}
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  <FaCircleCheck className="text-primary" />
                  ClubSphere Profile
                </div>

                <h1 className="mt-4 text-3xl md:text-5xl font-black">
                  {user?.displayName || "ClubSphere User"}
                </h1>

                <p className="mt-2 text-slate-300">{user?.email}</p>

                <div className="mt-5 flex flex-wrap justify-center md:justify-start gap-3">
                  <span className="badge badge-primary badge-lg text-white capitalize">
                    {roleLabel}
                  </span>

                  <span className="badge badge-outline badge-lg border-white/20 text-white">
                    Active Account
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"
                >
                  {isEditing ? <FaXmark /> : <FaPenToSquare />}
                  {isEditing ? "Cancel Edit" : "Edit Profile"}
                </button>

                <Link
                  to={getDashboardPath()}
                  className="btn btn-primary text-white"
                >
                  Go Dashboard
                  <FaArrowRight />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
          {/* Left Side */}
          <div className="lg:col-span-2 space-y-5">
            {/* Edit Form */}
            {isEditing && (
              <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FaPenToSquare />
                  </div>

                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      Edit Profile
                    </h2>
                    <p className="text-sm text-slate-500">
                      Update your name and profile photo.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="label">
                      <span className="label-text font-bold">Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full bg-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-bold">Photo URL</span>
                    </label>
                    <input
                      type="url"
                      className="input input-bordered w-full bg-white"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="Enter photo URL"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-bold">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered w-full bg-slate-100"
                      value={user?.email || ""}
                      disabled
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={updating}
                      className="btn btn-primary text-white"
                    >
                      <FaFloppyDisk />
                      {updating ? "Updating..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={updating}
                      className="btn btn-outline"
                    >
                      <FaXmark />
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Account Information */}
            <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur">
              <h2 className="text-2xl font-black text-slate-900 mb-5">
                Account Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <FaIdBadge />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Name
                      </p>
                      <p className="font-bold text-slate-900">
                        {user?.displayName || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                      <FaEnvelope />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Email
                      </p>
                      <p className="font-bold text-slate-900 truncate">
                        {user?.email || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <FaUserShield />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Role
                      </p>
                      <p className="font-bold text-slate-900">{roleLabel}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
                      <FaCircleCheck />
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Account Status
                      </p>
                      <p className="font-bold text-slate-900">Active</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10 text-warning">
                      <FaCamera />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                        Photo URL
                      </p>
                      <p className="font-bold text-slate-900 truncate">
                        {user?.photoURL || "Not provided"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl backdrop-blur h-fit">
            <h2 className="text-2xl font-black text-slate-900 mb-5">
              Quick Actions
            </h2>

            <div className="space-y-3">
              <Link
                to={getDashboardPath()}
                className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
              >
                <span className="flex items-center gap-3 font-bold text-slate-700">
                  <FaLayerGroup className="text-primary" />
                  Dashboard
                </span>
                <FaArrowRight className="text-slate-400 group-hover:text-primary" />
              </Link>

              {role === "member" && (
                <>
                  <Link
                    to="/dashboard/my-joined-clubs"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="flex items-center gap-3 font-bold text-slate-700">
                      <FaUsers className="text-primary" />
                      My Clubs
                    </span>
                    <FaArrowRight className="text-slate-400 group-hover:text-primary" />
                  </Link>

                  <Link
                    to="/dashboard/member-joined-events"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="flex items-center gap-3 font-bold text-slate-700">
                      <FaCalendarDays className="text-primary" />
                      My Events
                    </span>
                    <FaArrowRight className="text-slate-400 group-hover:text-primary" />
                  </Link>
                </>
              )}

              {role === "clubManager" && (
                <>
                  <Link
                    to="/dashboard/my-clubs"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="flex items-center gap-3 font-bold text-slate-700">
                      <FaUsers className="text-primary" />
                      My Clubs
                    </span>
                    <FaArrowRight className="text-slate-400 group-hover:text-primary" />
                  </Link>

                  <Link
                    to="/dashboard/create-a-club"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="flex items-center gap-3 font-bold text-slate-700">
                      <FaLayerGroup className="text-primary" />
                      Create Club
                    </span>
                    <FaArrowRight className="text-slate-400 group-hover:text-primary" />
                  </Link>
                </>
              )}

              {role === "admin" && (
                <>
                  <Link
                    to="/dashboard/users-management"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="flex items-center gap-3 font-bold text-slate-700">
                      <FaUsers className="text-primary" />
                      Manage Users
                    </span>
                    <FaArrowRight className="text-slate-400 group-hover:text-primary" />
                  </Link>

                  <Link
                    to="/dashboard/manage-clubs"
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-primary hover:shadow-md transition-all"
                  >
                    <span className="flex items-center gap-3 font-bold text-slate-700">
                      <FaLayerGroup className="text-primary" />
                      Manage Clubs
                    </span>
                    <FaArrowRight className="text-slate-400 group-hover:text-primary" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
