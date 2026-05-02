import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  FaTrashCan,
  FaPenToSquare,
  FaUsers,
  FaCalendarDays,
} from "react-icons/fa6";
import Swal from "sweetalert2";
import { Link, Outlet, useLocation } from "react-router-dom";
import useClubStore from "../../store/useClubStore";

const MyClubs = () => {
  const setSelectedClub = useClubStore((state) => state.setSelectedClub);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const {
    data: myClubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDeleteClub = (clubId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This club request will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/clubs/${clubId}`);
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "The club has been removed.", "success");
          }
        } catch (error) {
          Swal.fire("Error", "Could not delete the club.", "error");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );

  // Check if we are currently in a sub-management view[cite: 10]
  const isManaging =
    location.pathname.includes("manage-club-members") ||
    location.pathname.includes("manage-events") ||
    location.pathname.includes("create-event") || // Add this
    location.pathname.includes("edit-event") ||
    location.pathname.includes("event-participants");

  if (isManaging) {
    return <Outlet />;
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-base-content">
            My Clubs
          </h2>
          <p className="text-sm text-base-content/60">
            You have requested {myClubs.length} clubs so far.
          </p>
        </div>
        <Link
          to="/dashboard/create-a-club"
          className="btn btn-primary btn-sm md:btn-md shadow-md"
        >
          + Create New Club
        </Link>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <table className="table table-zebra w-full">
          {/* Head */}
          <thead className="bg-base-200 text-base-content/70">
            <tr>
              <th className="rounded-tl-2xl">Club Info</th>
              <th>Category</th>
              <th>Fee</th>
              <th>Status</th>
              <th className="text-center rounded-tr-2xl">Actions</th>
            </tr>
          </thead>

          <tbody>
            {myClubs.map((club) => (
              <tr
                key={club._id}
                className="hover:bg-base-200 transition-colors"
              >
                <td>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="mask mask-squircle w-14 h-14 shadow-sm border border-base-300">
                        <img src={club.bannerImage} alt={club.clubName} />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{club.clubName}</div>
                      <div className="text-xs opacity-50 uppercase tracking-tighter">
                        Created: {new Date(club.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-outline badge-md py-3 px-4 border-base-300">
                    {club.category}
                  </span>
                </td>
                <td className="font-medium text-base-content">
                  {club.membershipFee > 0 ? (
                    <span className="text-success">${club.membershipFee}</span>
                  ) : (
                    <span className="text-info">Free</span>
                  )}
                </td>
                <td>
                  <div
                    className={`badge badge-sm font-bold uppercase p-3 ${
                      club.status === "pending"
                        ? "badge-warning"
                        : club.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                    }`}
                  >
                    {club.status}
                  </div>
                </td>

                <td>
                  <div className="flex items-center justify-center gap-2">
                    {club.status === "approved" ? (
                      <div className="join">
                        <Link
                          to={`/dashboard/my-clubs/manage-club-members/${club._id}`}
                          onClick={() => setSelectedClub(club)}
                          className="btn btn-ghost btn-sm join-item text-secondary tooltip"
                          data-tip="Manage Members"
                        >
                          <FaUsers size={18} />
                        </Link>
                        <Link
                          to={`/dashboard/my-clubs/manage-events/${club._id}`}
                          onClick={() => setSelectedClub(club)}
                          className="btn btn-ghost btn-sm join-item text-accent tooltip"
                          data-tip="Manage Events"
                        >
                          <FaCalendarDays size={18} />
                        </Link>
                        <Link
                          to={`/dashboard/edit-club/${club._id}`}
                          onClick={() => setSelectedClub(club)}
                          className="btn btn-ghost btn-sm join-item text-warning tooltip"
                          data-tip="Edit Club"
                        >
                          <FaPenToSquare size={18} />
                        </Link>
                      </div>
                    ) : (
                      <span className="text-xs italic opacity-40">
                        Awaiting Approval
                      </span>
                    )}

                    <div className="divider divider-horizontal mx-0"></div>

                    <button
                      className="btn btn-ghost btn-sm text-error tooltip"
                      data-tip="Delete Club"
                      onClick={() => handleDeleteClub(club._id)}
                    >
                      <FaTrashCan size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {myClubs.length === 0 && (
          <div className="text-center py-10 opacity-50">
            <p>No clubs found. Start by creating one!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyClubs;
