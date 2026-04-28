import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaTrashAlt, FaUserShield, FaUsers, FaUserTag } from "react-icons/fa";
import axios from "axios";

const UsersManagement = () => {
  const axiosSecure = useAxiosSecure();
  const [searchText, setSearchText] = useState("");

  const { data: users = [], refetch } = useQuery({
    // Adding searchText to queryKey is correct—it triggers a refetch automatically
    queryKey: ["users", searchText],
    queryFn: async () => {
      // Only fetch if searchText is actually used or clear it
      const res = await axiosSecure.get(`/users?searchText=${searchText}`);
      return res.data;
    },
  });

  const handleMakeUser = (user) => {
    const roleInfo = {
      role: "admin",
      email: user.email,
    };

    // 1. Removed semicolon after axiosSecure.patch
    axiosSecure
      .patch(`/users/${user._id}/role`, roleInfo)
      .then((res) => {
        // 2. Added arrow '=>'
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.name} is now an Admin`,
            showConfirmButton: false,
            timer: 1500, // Added timer so it closes automatically
          });
          // 3. Move refetch inside the if block for efficiency
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Failed to update user role", "error");
      });
  };

  const handleDeleteUser = (user) => {
    const roleInfo = {
      role: "member",
      email: user.email,
    };
    axiosSecure
      .patch(`/users/${user._id}/role`, roleInfo)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${user.name} is removed from Admin`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Failed to update user role", "error");
      });
  };
  // --- Design Helper: Badge colors based on role ---
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
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-3">
            <FaUsers className="text-primary" />
            User Management
          </h2>
          <p className="text-gray-500 mt-1">
            Review, promote, or manage all platform members.
          </p>
        </div>
        {/* search */}
        <label className="input">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input
            type="search"
            required
            placeholder="Search users..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </label>

        <div className="stats shadow bg-white border border-gray-100">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaUserTag size={30} />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{users.length}</div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="max-w-7xl mx-auto overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            {/* Table Head */}
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-4">#</th>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Current Role</th>
                <th className="text-center">Quick Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <th className="text-gray-400 font-medium">{index + 1}</th>
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12 border-2 border-primary/10">
                          <img
                            src={
                              user.photoURL ||
                              "https://i.ibb.co/Mgs9hyL/user.png"
                            }
                            alt="avatar"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800">
                          {user.name || "Anonymous"}
                        </div>
                        <div className="text-xs font-semibold text-primary uppercase tracking-wider">
                          {user.role || "Member"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="text-gray-600 font-medium italic">
                    {user.email}
                  </td>
                  <td>
                    <span
                      className={`badge ${getRoleBadge(user.role)} p-3 font-bold`}
                    >
                      {user.role === "clubManager"
                        ? "Manager"
                        : user.role || "Member"}
                    </span>
                  </td>
                  <td>
                    <div className="flex justify-center gap-3">
                      {/* Action: Promote */}
                      {user.role !== "admin" && (
                        <button
                          className="btn btn-sm btn-circle btn-outline btn-warning hover:text-white tooltip"
                          data-tip="Promote to Admin"
                          onClick={() => handleMakeUser(user)}
                        >
                          <FaUserShield size={16} />
                        </button>
                      )}

                      {/* Action: Delete */}
                      <button
                        className="btn btn-sm btn-circle btn-outline btn-error hover:text-white tooltip"
                        data-tip="Delete User"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <FaTrashAlt size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 text-gray-200 font-bold">Empty</div>
            <p className="text-gray-400">No users found in the database.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
