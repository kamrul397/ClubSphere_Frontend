import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { FaTrashCan, FaLayerGroup } from "react-icons/fa6";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ApproveClubs = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: clubs = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["admin-all-clubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs");
      return res.data;
    },
  });

  const handleUpdateStatus = async (club, newStatus) => {
    if (club.status === newStatus) {
      Swal.fire(
        "Already Updated",
        `This club is already ${newStatus}.`,
        "info",
      );
      return;
    }

    const actionText = newStatus === "approved" ? "approve" : "reject";

    const confirm = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${actionText} "${club.clubName}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: newStatus === "approved" ? "#22c55e" : "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const updateInfo = {
        status: newStatus,
        managerEmail: club.managerEmail,
      };

      const res = await axiosSecure.patch(
        `/clubs/${club._id}/status`,
        updateInfo,
      );

      if (res.data.modifiedCount > 0) {
        refetch();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Club is now ${newStatus}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", `Failed to ${actionText} club.`, "error");
    }
  };

  const handleDelete = async (club) => {
    const confirm = await Swal.fire({
      title: "Delete this club?",
      text: `"${club.clubName}" will be permanently deleted.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/clubs/${club._id}`);

      if (res.data.deletedCount > 0) {
        refetch();

        Swal.fire("Deleted!", "The club has been removed.", "success");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not delete the club.", "error");
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return "badge-success";
    }

    if (status === "pending") {
      return "badge-warning";
    }

    if (status === "rejected") {
      return "badge-error";
    }

    return "badge-ghost";
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const pendingCount = clubs.filter((club) => club.status === "pending").length;
  const approvedCount = clubs.filter(
    (club) => club.status === "approved",
  ).length;
  const rejectedCount = clubs.filter(
    (club) => club.status === "rejected",
  ).length;

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
                  Admin Control
                </p>

                <h2 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                  Manage Clubs
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  Review all clubs, approve pending requests, reject invalid
                  clubs, or delete unnecessary records.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center">
                  <p className="text-2xl font-black text-warning">
                    {pendingCount}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-white/60">
                    Pending
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center">
                  <p className="text-2xl font-black text-success">
                    {approvedCount}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-white/60">
                    Approved
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-center">
                  <p className="text-2xl font-black text-error">
                    {rejectedCount}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-white/60">
                    Rejected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-base-200 bg-base-100 shadow-xl">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="table table-xs table-zebra w-full text-xs [&_th]:py-2 [&_td]:py-2 [&_th]:px-3 [&_td]:px-3">
            <thead className="sticky top-0 z-10 bg-base-200 text-base-content/70">
              <tr className="whitespace-nowrap">
                <th>#</th>
                <th>Club Details</th>
                <th>Status</th>
                <th>Category</th>
                <th>Manager Email</th>
                <th>Fee</th>
                <th>Created</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {clubs.map((club, index) => (
                <tr key={club._id} className="hover whitespace-nowrap">
                  <td>{index + 1}</td>

                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle h-11 w-11 border border-base-300">
                          {club.bannerImage ? (
                            <img
                              src={club.bannerImage}
                              alt={club.clubName}
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                              <FaLayerGroup />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="min-w-0">
                        <div className="max-w-[180px] truncate font-black text-sm">
                          {club.clubName || "Unnamed Club"}
                        </div>
                        <div className="max-w-[180px] truncate text-[11px] opacity-60">
                          {club.location || "No location"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span
                      className={`badge badge-xs font-bold uppercase ${getStatusBadge(
                        club.status,
                      )}`}
                    >
                      {club.status || "unknown"}
                    </span>
                  </td>

                  <td>
                    <span className="badge badge-outline badge-xs">
                      {club.category || "N/A"}
                    </span>
                  </td>

                  <td className="max-w-[220px] truncate text-[11px]">
                    {club.managerEmail || "N/A"}
                  </td>

                  <td className="font-semibold">
                    {Number(club.membershipFee) > 0
                      ? `$${club.membershipFee}`
                      : "Free"}
                  </td>

                  <td>
                    {club.createdAt
                      ? new Date(club.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/club-details/${club._id}`}
                        className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-info tooltip"
                        data-tip="View Club"
                      >
                        <FaEye size={13} />
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(club, "approved")}
                        disabled={club.status === "approved"}
                        className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-success tooltip disabled:opacity-30"
                        data-tip="Approve Club"
                      >
                        <FaCheck size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleUpdateStatus(club, "rejected")}
                        disabled={club.status === "rejected"}
                        className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-warning tooltip disabled:opacity-30"
                        data-tip="Reject Club"
                      >
                        <FaTimes size={13} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(club)}
                        className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-error tooltip"
                        data-tip="Delete Club"
                      >
                        <FaTrashCan size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {clubs.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              No clubs found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveClubs;
