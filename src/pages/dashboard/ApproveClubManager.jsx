import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import {
  FaEye,
  FaUserCheck,
  FaEnvelope,
  FaIdCard,
  FaLocationDot,
  FaUserXmark,
  FaClock,
  FaCircleCheck,
  FaBan,
} from "react-icons/fa6";

const defaultAvatar =
  "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp";

const ApproveClubManager = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: managerApplications = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["managerApplications"],
    queryFn: async () => {
      const res = await axiosSecure.get("/club-managers");
      return res.data;
    },
  });

  const getApplicantPhoto = (manager) => {
    return (
      manager.photoURL ||
      manager.userPhoto ||
      manager.photo ||
      manager.image ||
      defaultAvatar
    );
  };

  const updateApprovalStatus = async (manager, status) => {
    if (manager.status !== "pending") {
      Swal.fire(
        "Action Not Allowed",
        "Only pending applications can be approved or rejected.",
        "warning",
      );
      return;
    }

    const actionText = status === "approved" ? "approve" : "reject";

    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to ${actionText} ${manager.name || manager.email}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: status === "approved" ? "#22c55e" : "#f59e0b",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${actionText}`,
    });

    if (!confirm.isConfirmed) return;

    try {
      const updateInfo = {
        status,
        email: manager.email,
      };

      const res = await axiosSecure.patch(
        `/club-managers/${manager._id}`,
        updateInfo,
      );

      if (res.data.modifiedCount > 0) {
        refetch();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title:
            status === "approved"
              ? `${manager.name || "User"} is now a Club Manager`
              : `${manager.name || "User"}'s request has been rejected`,
          showConfirmButton: false,
          timer: 1600,
        });
      } else {
        Swal.fire("No Change", "This application was not updated.", "info");
      }
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.message ||
          `Could not ${actionText} this request.`,
        "error",
      );
    }
  };

  const handleApprove = (manager) => {
    updateApprovalStatus(manager, "approved");
  };

  const handleReject = (manager) => {
    updateApprovalStatus(manager, "rejected");
  };

  const handleView = (manager) => {
    const photo = getApplicantPhoto(manager);

    Swal.fire({
      title: manager.name || "Manager Application",
      width: 680,
      html: `
        <div style="text-align:left">
          <div style="display:flex;align-items:center;gap:14px;margin-bottom:18px;padding:14px;border:1px solid #e2e8f0;border-radius:18px;background:#f8fafc">
            <img
              src="${photo}"
              alt="${manager.name || "Applicant"}"
              style="width:64px;height:64px;border-radius:18px;object-fit:cover;border:2px solid #6366f1"
            />
            <div>
              <p style="margin:0;font-weight:800;font-size:18px;color:#0f172a">
                ${manager.name || "Unknown User"}
              </p>
              <p style="margin:4px 0 0;color:#64748b;font-size:13px">
                ${manager.email || "N/A"}
              </p>
            </div>
          </div>

          <div style="margin-bottom:10px">
            <strong>Name:</strong>
            <p style="margin:4px 0;color:#64748b">${manager.name || "N/A"}</p>
          </div>

          <div style="margin-bottom:10px">
            <strong>Email:</strong>
            <p style="margin:4px 0;color:#64748b">${manager.email || "N/A"}</p>
          </div>

          <div style="margin-bottom:10px">
            <strong>NID No:</strong>
            <p style="margin:4px 0;color:#64748b">${manager.nid || "N/A"}</p>
          </div>

          <div style="margin-bottom:10px">
            <strong>Address:</strong>
            <p style="margin:4px 0;color:#64748b">${
              manager.address || "N/A"
            }</p>
          </div>

          <div style="margin-bottom:10px">
            <strong>Status:</strong>
            <p style="margin:4px 0;color:#64748b;text-transform:capitalize">
              ${manager.status || "pending"}
            </p>
          </div>

          <div style="margin-bottom:10px">
            <strong>Applied At:</strong>
            <p style="margin:4px 0;color:#64748b">
              ${
                manager.createdAt
                  ? new Date(manager.createdAt).toLocaleString()
                  : "N/A"
              }
            </p>
          </div>
        </div>
      `,
      confirmButtonText: "Close",
      confirmButtonColor: "#6366f1",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "approved") return "badge-success";
    if (status === "rejected") return "badge-error";
    return "badge-warning";
  };

  const getStatusIcon = (status) => {
    if (status === "approved") return <FaCircleCheck />;
    if (status === "rejected") return <FaBan />;
    return <FaClock />;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const pendingCount = managerApplications.filter(
    (manager) => manager.status === "pending",
  ).length;

  const approvedCount = managerApplications.filter(
    (manager) => manager.status === "approved",
  ).length;

  const rejectedCount = managerApplications.filter(
    (manager) => manager.status === "rejected",
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
                  Manager Applications
                </h2>

                <p className="mt-2 text-sm text-slate-300">
                  Review pending users who applied to become Club Managers.
                  Approved and rejected applications are kept as history.
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
                <th>Applicant</th>
                <th>NID No.</th>
                <th>Address</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {managerApplications.map((manager, index) => {
                const isPending = manager.status === "pending";
                const photo = getApplicantPhoto(manager);

                return (
                  <tr key={manager._id} className="hover whitespace-nowrap">
                    <td>{index + 1}</td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar shrink-0">
                          <div className="h-11 w-11 rounded-xl ring ring-primary/20 ring-offset-1">
                            <img
                              src={photo}
                              alt={manager.name || "Applicant"}
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <div className="min-w-0">
                          <p className="font-black text-sm truncate max-w-[170px]">
                            {manager.name || "Unknown User"}
                          </p>

                          <p className="text-[11px] opacity-60 flex items-center gap-1 truncate max-w-[190px]">
                            <FaEnvelope className="shrink-0" />
                            {manager.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="inline-flex items-center gap-1">
                        <FaIdCard className="text-primary" />
                        {manager.nid || "N/A"}
                      </span>
                    </td>

                    <td className="max-w-[250px] truncate">
                      <span className="inline-flex items-center gap-1">
                        <FaLocationDot className="text-secondary" />
                        {manager.address || "N/A"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge badge-xs font-bold uppercase gap-1 ${getStatusBadge(
                          manager.status,
                        )}`}
                      >
                        {getStatusIcon(manager.status)}
                        {manager.status || "pending"}
                      </span>
                    </td>

                    <td className="overflow-visible">
                      <div className="flex items-center justify-center gap-2 whitespace-nowrap">
                        {isPending && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleApprove(manager)}
                              className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-success"
                              title="Approve Application"
                            >
                              <FaUserCheck size={13} />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleReject(manager)}
                              className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-warning"
                              title="Reject Application"
                            >
                              <FaUserXmark size={13} />
                            </button>
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => handleView(manager)}
                          className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-info"
                          title="View Details"
                        >
                          <FaEye size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {managerApplications.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-500">
              No manager applications found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApproveClubManager;
