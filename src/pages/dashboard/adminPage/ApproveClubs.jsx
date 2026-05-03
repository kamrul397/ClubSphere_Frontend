import { useQuery } from "@tanstack/react-query";
import React from "react";
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

  const escapeHTML = (value = "") => {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  const getStatusBadge = (status) => {
    if (status === "approved") return "badge-success";
    if (status === "rejected") return "badge-error";
    return "badge-warning";
  };

  const handleViewClub = (club) => {
    const banner =
      club.bannerImage ||
      "https://via.placeholder.com/700x300?text=ClubSphere+Club";

    Swal.fire({
      width: 760,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#6366f1",
      html: `
        <div style="text-align:left">
          <div style="overflow:hidden;border-radius:22px;margin-bottom:18px;border:1px solid #e2e8f0">
            <img
              src="${escapeHTML(banner)}"
              alt="${escapeHTML(club.clubName || "Club")}"
              style="width:100%;height:220px;object-fit:cover;display:block"
            />
          </div>

          <div style="display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:16px">
            <div>
              <p style="margin:0;color:#6366f1;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:2px">
                Club Details
              </p>
              <h2 style="margin:6px 0 0;font-size:28px;font-weight:900;color:#0f172a">
                ${escapeHTML(club.clubName || "Unnamed Club")}
              </h2>
              <p style="margin:6px 0 0;color:#64748b;font-size:14px">
                ${escapeHTML(club.location || "No location")}
              </p>
            </div>

            <span style="
              padding:6px 12px;
              border-radius:999px;
              font-size:11px;
              font-weight:800;
              text-transform:uppercase;
              background:${
                club.status === "approved"
                  ? "#dcfce7"
                  : club.status === "rejected"
                    ? "#fee2e2"
                    : "#fef3c7"
              };
              color:${
                club.status === "approved"
                  ? "#166534"
                  : club.status === "rejected"
                    ? "#991b1b"
                    : "#92400e"
              };
            ">
              ${escapeHTML(club.status || "pending")}
            </span>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px">
            <div style="padding:14px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc">
              <strong style="color:#0f172a">Category</strong>
              <p style="margin:4px 0 0;color:#64748b">${escapeHTML(
                club.category || "N/A",
              )}</p>
            </div>

            <div style="padding:14px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc">
              <strong style="color:#0f172a">Membership Fee</strong>
              <p style="margin:4px 0 0;color:#64748b">
                ${
                  Number(club.membershipFee) > 0
                    ? `$${escapeHTML(club.membershipFee)}`
                    : "Free"
                }
              </p>
            </div>

            <div style="padding:14px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc">
              <strong style="color:#0f172a">Manager Name</strong>
              <p style="margin:4px 0 0;color:#64748b">${escapeHTML(
                club.managerName || "N/A",
              )}</p>
            </div>

            <div style="padding:14px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc">
              <strong style="color:#0f172a">Manager Email</strong>
              <p style="margin:4px 0 0;color:#64748b;word-break:break-all">${escapeHTML(
                club.managerEmail || "N/A",
              )}</p>
            </div>
          </div>

          <div style="padding:14px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc;margin-bottom:12px">
            <strong style="color:#0f172a">Description</strong>
            <p style="margin:6px 0 0;color:#64748b;line-height:1.6">
              ${escapeHTML(club.description || "No description available.")}
            </p>
          </div>

          <div style="padding:14px;border:1px solid #e2e8f0;border-radius:16px;background:#f8fafc">
            <strong style="color:#0f172a">Created At</strong>
            <p style="margin:4px 0 0;color:#64748b">
              ${
                club.createdAt
                  ? new Date(club.createdAt).toLocaleString()
                  : "N/A"
              }
            </p>
          </div>
        </div>
      `,
    });
  };

  const handleUpdateStatus = async (club, newStatus) => {
    if (club.status !== "pending") {
      Swal.fire(
        "Action Not Allowed",
        "Only pending clubs can be approved or rejected.",
        "warning",
      );
      return;
    }

    const actionText = newStatus === "approved" ? "approve" : "reject";

    const confirm = await Swal.fire({
      title: "Are you sure?",
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
      } else {
        Swal.fire("No Change", "Club status was not changed.", "info");
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
      } else {
        Swal.fire("Not Deleted", "No club was deleted.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Could not delete the club.", "error");
    }
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
                  View club details safely, approve pending clubs, reject
                  invalid requests, or delete unnecessary records.
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
              {clubs.map((club, index) => {
                const isPending = club.status === "pending";

                return (
                  <tr key={club._id} className="hover whitespace-nowrap">
                    <td>{index + 1}</td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar shrink-0">
                          <div className="mask mask-squircle h-11 w-11 border border-base-300">
                            {club.bannerImage ? (
                              <img
                                src={club.bannerImage}
                                alt={club.clubName || "Club"}
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
                        {club.status || "pending"}
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
                        <button
                          type="button"
                          onClick={() => handleViewClub(club)}
                          className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-info"
                          title="View Club Details"
                        >
                          <FaEye size={13} />
                        </button>

                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(club, "approved")
                              }
                              className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-success"
                              title="Approve Club"
                            >
                              <FaCheck size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStatus(club, "rejected")
                              }
                              className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-warning"
                              title="Reject Club"
                            >
                              <FaTimes size={13} />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(club)}
                          className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-error"
                          title="Delete Club"
                        >
                          <FaTrashCan size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
