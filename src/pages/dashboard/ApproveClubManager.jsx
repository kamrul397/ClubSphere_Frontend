import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaEye, FaUser, FaUserCheck, FaUserTimes } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";

const ApproveClubManager = () => {
  const axiosSecure = useAxiosSecure();

  const { data: pendingClubManagers = [], refetch } = useQuery({
    queryKey: ["pendingClubManagers", "pending"],
    queryFn: async () => {
      // Assuming your backend filters by status="pending"
      const res = await axiosSecure.get("/club-managers?status=pending");
      return res.data;
    },
  });

  const updateApprovalStatus = (manager, status) => {
    const updateInfo = {
      status: status,
      email: manager.email, // Added this so backend can update the user's role
    };
    console.log("manager", manager);

    axiosSecure
      .patch(`/club-managers/${manager._id}`, updateInfo)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${manager.name} is now a ${status}`,
            showConfirmButton: false,
            timer: 1500,
          });
          refetch();
        }
      })
      .catch((error) => {
        console.error(error);
        Swal.fire("Error", "Could not approve manager", "error");
      });
  };

  const handleApprove = async (manager) => {
    updateApprovalStatus(manager, "approved");
  };
  const handleReject = async (manager) => {
    updateApprovalStatus(manager, "rejected");
  };
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pending Manager Applications</h2>
        <div className="badge badge-primary p-4 text-lg">
          {pendingClubManagers.length} Total
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
        <table className="table table-zebra w-full">
          {/* Table Head */}
          <thead className="bg-primary text-white">
            <tr>
              <th>#</th>
              <th>Manager Info</th>
              <th>NID No.</th>
              <th>Address</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {pendingClubManagers.map((manager, index) => (
              <tr key={manager._id}>
                <th>{index + 1}</th>
                <td>
                  <div className="flex flex-col">
                    <span className="font-bold">{manager.name}</span>
                    <span className="text-sm opacity-60">{manager.email}</span>
                  </div>
                </td>
                <td>{manager.nid}</td>
                <td className="max-w-xs truncate">{manager.address}</td>
                <td>
                  <span
                    className={`badge ${
                      manager.status === "pending"
                        ? "badge-warning"
                        : manager.status === "approved"
                          ? "badge-success"
                          : "badge-error"
                    }`}
                  >
                    {manager.status}
                  </span>
                </td>
                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() => handleApprove(manager)}
                    className="btn btn-success btn-sm text-white"
                  >
                    <FaUserCheck className="inline mr-1" />
                  </button>
                  <button
                    onClick={() => handleView(manager)}
                    className="btn btn-success btn-sm text-white"
                  >
                    <FaEye className="inline mr-1" />
                  </button>
                  <button
                    onClick={() => handleReject(manager)}
                    className="btn btn-error btn-sm text-white"
                  >
                    <FaUserTimes className="inline mr-1" />
                  </button>
                  <button
                    onClick={() => handleDelete(manager)}
                    className="btn btn-error btn-sm text-white"
                  >
                    <FaTrashCan className="inline mr-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {pendingClubManagers.length === 0 && (
          <div className="text-center py-10 text-gray-500 italic">
            No pending applications found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveClubManager;
