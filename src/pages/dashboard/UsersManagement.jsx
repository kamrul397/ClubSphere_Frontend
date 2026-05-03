import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import {
  FaUserShield,
  FaUsers,
  FaUserTag,
  FaUserMinus,
  FaSearch,
} from "react-icons/fa";

import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const { user: currentUser } = useAuth();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // Debounce search so API does not call on every single key press immediately
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchText]);

  const {
    data: users = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["users", debouncedSearchText],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/users?searchText=${encodeURIComponent(debouncedSearchText)}`,
      );
      return res.data;
    },
  });

  const handleMakeAdmin = async (selectedUser) => {
    if (selectedUser.email === currentUser?.email) {
      Swal.fire("Not Allowed", "You cannot change your own role.", "warning");
      return;
    }

    const confirm = await Swal.fire({
      title: "Promote to Admin?",
      text: `${selectedUser.name || selectedUser.email} will become an admin.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, make admin",
    });

    if (!confirm.isConfirmed) return;

    try {
      const roleInfo = {
        role: "admin",
        email: selectedUser.email,
      };

      const res = await axiosSecure.patch(
        `/users/${selectedUser._id}/role`,
        roleInfo,
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${selectedUser.name || "User"} is now an Admin`,
          showConfirmButton: false,
          timer: 1500,
        });

        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update user role.", "error");
    }
  };

  const handleDemoteToMember = async (selectedUser) => {
    if (selectedUser.email === currentUser?.email) {
      Swal.fire(
        "Not Allowed",
        "You cannot demote your own account.",
        "warning",
      );
      return;
    }

    if (selectedUser.role === "member") {
      Swal.fire("Already Member", "This user is already a member.", "info");
      return;
    }

    const confirm = await Swal.fire({
      title: "Demote to Member?",
      text: `${selectedUser.name || selectedUser.email} will be changed to member role.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, demote",
    });

    if (!confirm.isConfirmed) return;

    try {
      const roleInfo = {
        role: "member",
        email: selectedUser.email,
      };

      const res = await axiosSecure.patch(
        `/users/${selectedUser._id}/role`,
        roleInfo,
      );

      if (res.data.modifiedCount > 0) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `${selectedUser.name || "User"} is now a Member`,
          showConfirmButton: false,
          timer: 1500,
        });

        refetch();
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to demote user.", "error");
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return "badge-secondary";
      case "clubManager":
        return "badge-accent";
      default:
        return "badge-ghost border-gray-300";
    }
  };

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#17203a] to-[#3a2348] p-[1px] shadow-xl">
          <div className="relative rounded-3xl bg-slate-900/90 p-5 md:p-6 text-white">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/25 blur-3xl"></div>
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-primary">
                  Admin Control
                </p>

                <h2 className="mt-2 text-3xl md:text-4xl font-black leading-tight flex items-center gap-3">
                  <FaUsers />
                  User Management
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  Review users, promote admins, and demote roles back to member.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <label className="input input-bordered bg-white/10 border-white/20 text-white w-full sm:w-72">
                  <FaSearch className="opacity-60" />

                  <input
                    type="search"
                    placeholder="Search by name or email..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="placeholder:text-white/50"
                  />

                  {isFetching && !isLoading && (
                    <span className="loading loading-spinner loading-xs text-white"></span>
                  )}
                </label>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <FaUserTag className="text-2xl text-primary" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                        Showing Users
                      </p>
                      <p className="text-2xl font-black text-white">
                        {users.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {searchText && (
              <div className="relative mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                <p className="text-white/70">
                  Searching for:{" "}
                  <span className="font-bold text-white">{searchText}</span>
                </p>

                <button
                  type="button"
                  onClick={() => setSearchText("")}
                  className="btn btn-xs border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-xl">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="table table-zebra w-full">
            <thead className="sticky top-0 z-10 bg-base-200 text-base-content/70">
              <tr className="whitespace-nowrap">
                <th>#</th>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Current Role</th>
                <th className="text-center w-[130px]">Role Actions</th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </td>
                </tr>
              ) : users.length > 0 ? (
                users.map((selectedUser, index) => {
                  const isSelf = selectedUser.email === currentUser?.email;
                  const canPromoteToAdmin = selectedUser.role !== "admin";
                  const canDemoteToMember = selectedUser.role !== "member";

                  return (
                    <tr
                      key={selectedUser._id}
                      className="hover:bg-primary/5 transition-colors whitespace-nowrap"
                    >
                      <th className="text-base-content/40 font-medium">
                        {index + 1}
                      </th>

                      <td>
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="mask mask-squircle w-12 h-12 border-2 border-primary/10">
                              <img
                                src={
                                  selectedUser.photoURL ||
                                  "https://i.ibb.co/Mgs9hyL/user.png"
                                }
                                alt={selectedUser.name || "User"}
                              />
                            </div>
                          </div>

                          <div className="min-w-0">
                            <div className="font-black text-base-content truncate max-w-[180px]">
                              {selectedUser.name || "Anonymous"}
                            </div>

                            <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                              {selectedUser.role || "member"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="text-base-content/70 font-medium italic max-w-[260px] truncate">
                        {selectedUser.email}
                      </td>

                      <td>
                        <span
                          className={`badge ${getRoleBadge(
                            selectedUser.role,
                          )} p-3 font-bold capitalize`}
                        >
                          {selectedUser.role === "clubManager"
                            ? "Club Manager"
                            : selectedUser.role || "Member"}
                        </span>
                      </td>

                      <td className="text-center align-middle">
                        <div className="mx-auto grid w-[92px] grid-cols-2 place-items-center gap-2">
                          {canPromoteToAdmin ? (
                            <button
                              type="button"
                              disabled={isSelf}
                              className="btn btn-sm btn-circle btn-outline btn-warning hover:text-white disabled:opacity-30"
                              title={
                                isSelf
                                  ? "You cannot change your own role"
                                  : "Promote to Admin"
                              }
                              onClick={() => handleMakeAdmin(selectedUser)}
                            >
                              <FaUserShield size={16} />
                            </button>
                          ) : (
                            <span className="h-8 w-8"></span>
                          )}

                          {canDemoteToMember ? (
                            <button
                              type="button"
                              disabled={isSelf}
                              className="btn btn-sm btn-circle btn-outline btn-error hover:text-white disabled:opacity-30"
                              title={
                                isSelf
                                  ? "You cannot demote yourself"
                                  : "Demote to Member"
                              }
                              onClick={() => handleDemoteToMember(selectedUser)}
                            >
                              <FaUserMinus size={16} />
                            </button>
                          ) : (
                            <span className="h-8 w-8"></span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center py-20">
                      <div className="text-5xl mb-4 text-gray-200 font-bold">
                        Empty
                      </div>
                      <p className="text-gray-400">
                        {debouncedSearchText
                          ? "No users matched your search."
                          : "No users found in the database."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManagement;
