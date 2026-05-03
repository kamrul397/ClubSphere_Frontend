import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaTrashCan, FaArrowLeft } from "react-icons/fa6";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageClubMembers = () => {
  const { clubId } = useParams();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/club-members/${clubId}`);
      return res.data;
    },
    enabled: !!clubId,
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (member) => {
      const res = await axiosSecure.delete(
        `/leave-club?email=${member.userEmail}&clubId=${clubId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubMembers", clubId] });
      Swal.fire(
        "Removed!",
        "Member has been removed from this club.",
        "success",
      );
    },
    onError: () => {
      Swal.fire("Error", "Could not remove this member.", "error");
    },
  });

  const handleRemoveMember = (member) => {
    Swal.fire({
      title: "Remove this member?",
      text: `${member.userName || member.userEmail} will be removed from this club.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove",
    }).then((result) => {
      if (result.isConfirmed) {
        removeMemberMutation.mutate(member);
      }
    });
  };

  if (!clubId) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <div className="text-center">
          <h2 className="text-xl font-bold text-error">No Club Selected</h2>
          <p className="text-sm text-gray-500 mt-2">
            Please go to My Clubs and select a club to manage.
          </p>

          <NavLink
            to="/dashboard/my-clubs"
            className="btn btn-primary btn-sm mt-4"
          >
            Go to My Clubs
          </NavLink>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const clubName = members[0]?.clubName || "Club";

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex flex-row justify-between items-center gap-3 mb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-base-content leading-tight">
            Manage Members
          </h2>

          <p className="text-sm text-base-content/60 leading-tight">
            {clubName} • Total members: {members.length}
          </p>
        </div>

        <NavLink
          to="/dashboard/my-clubs"
          className="btn btn-outline btn-sm min-h-0 h-9 px-3"
        >
          <FaArrowLeft size={13} />
          Back to My Clubs
        </NavLink>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="table table-xs table-zebra w-full text-xs [&_th]:py-2 [&_td]:py-2 [&_th]:px-3 [&_td]:px-3">
            <thead className="bg-base-200 text-base-content/70 sticky top-0 z-10">
              <tr className="whitespace-nowrap">
                <th>#</th>
                <th>Member Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {members.map((member, index) => {
                const joinedDate =
                  member.joinedDate || member.joinedAt || member.createdAt;

                return (
                  <tr key={member._id} className="whitespace-nowrap">
                    <td>{index + 1}</td>

                    <td className="font-semibold max-w-[180px] truncate">
                      {member.userName || "Unknown User"}
                    </td>

                    <td className="max-w-[260px] truncate">
                      {member.userEmail || "N/A"}
                    </td>

                    <td>
                      <span
                        className={`badge badge-xs min-h-0 h-5 px-2 ${
                          member.status === "active"
                            ? "badge-success"
                            : member.status === "expired"
                              ? "badge-warning"
                              : "badge-ghost"
                        }`}
                      >
                        {member.status || "N/A"}
                      </span>
                    </td>

                    <td>
                      {joinedDate
                        ? new Date(joinedDate).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <td className="text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member)}
                        disabled={removeMemberMutation.isPending}
                        className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-error tooltip"
                        data-tip="Remove Member"
                      >
                        <FaTrashCan size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {members.length === 0 && (
            <div className="py-8 text-center text-sm text-gray-500">
              No members have joined this club yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageClubMembers;
