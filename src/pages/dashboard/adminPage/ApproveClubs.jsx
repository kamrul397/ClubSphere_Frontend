import { useQuery } from "@tanstack/react-query";
import React from "react";

import Swal from "sweetalert2";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApproveClubs = () => {
  const axiosSecure = useAxiosSecure();

  // 1. Fetching Clubs using TanStack Query
  const {
    data: clubs = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["all-clubs"],
    queryFn: async () => {
      // Fetches all clubs; we filter for pending in the UI
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  // 2. Handle Status Update (Approve/Reject)
  const handleUpdateStatus = (club, newStatus) => {
    const updateInfo = {
      status: newStatus,
      managerEmail: club.managerEmail, // Pass email to update user role in backend if needed
    };

    axiosSecure
      .patch(`/clubs/${club._id}/status`, updateInfo)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Club is now ${newStatus}`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", `Failed to ${newStatus} club`, "error");
      });
  };

  // 3. Handle Delete
  const handleDelete = (clubId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This request will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/clubs/${clubId}`);
          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire(
              "Deleted!",
              "The club request has been removed.",
              "success",
            );
          }
        } catch (error) {
          Swal.fire("Error", "Could not delete the club.", "error");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  const pendingClubs = clubs.filter((club) => club.status === "pending");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">
          Club Approval Requests
        </h2>
        <div className="badge badge-secondary p-4 text-lg font-bold">
          {pendingClubs.length} Pending
        </div>
      </div>

      <div className="overflow-x-auto shadow-xl rounded-2xl border border-base-300 bg-white">
        <table className="table table-zebra w-full">
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Club Details</th>
              <th>Category</th>
              <th>Manager Email</th>
              <th>Fee</th>
              <th className="text-center">Decision</th>
            </tr>
          </thead>

          <tbody>
            {pendingClubs.map((club, index) => (
              <tr key={club._id} className="hover">
                <th>{index + 1}</th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <img src={club.bannerImage} alt="Club Banner" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{club.clubName}</div>
                      <div className="text-xs opacity-60">{club.location}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge badge-ghost font-medium">
                    {club.category}
                  </span>
                </td>
                <td className="italic text-sm">{club.managerEmail}</td>
                <td className="font-semibold">
                  {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                </td>
                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleUpdateStatus(club, "approved")}
                    className="btn btn-success btn-sm tooltip"
                    data-tip="Approve Club"
                  >
                    <FaCheck className="text-white" />
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(club, "rejected")}
                    className="btn btn-warning btn-sm tooltip"
                    data-tip="Reject"
                  >
                    <FaTimes className="text-white" />
                  </button>
                  <button
                    onClick={() => handleDelete(club._id)}
                    className="btn btn-error btn-sm tooltip"
                    data-tip="Delete Permanently"
                  >
                    <FaTrashCan className="text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pendingClubs.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 italic text-lg">
              No new club requests found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveClubs;
