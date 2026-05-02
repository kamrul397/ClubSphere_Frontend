import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Swal from "sweetalert2";
import { FaTrashCan } from "react-icons/fa6";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EventParticipants = () => {
  const { eventId } = useParams();
  const axiosSecure = useAxiosSecure();

  // Fetch participants
  const {
    data: participants = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["event-participants", eventId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/event-registrations/${eventId}`);
      return res.data;
    },
    enabled: !!eventId,
  });

  // Delete participant
  const handleDelete = async (email) => {
    const confirm = await Swal.fire({
      title: "Remove Participant?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      confirmButtonColor: "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(
        `/event-registrations?email=${email}&eventId=${eventId}`,
      );

      Swal.fire("Removed!", "Participant has been removed", "success");
      refetch();
    } catch (error) {
      Swal.fire("Error", "Failed to remove participant", "error");
    }
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Event Participants ({participants.length})
      </h2>

      <div className="overflow-x-auto bg-base-100 shadow rounded-xl">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Joined At</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {participants.length > 0 ? (
              participants.map((p, index) => (
                <tr key={p._id || index}>
                  <td>{index + 1}</td>

                  <td className="font-medium">
                    {p.userName || "Unknown User"}
                  </td>

                  <td>{p.userEmail}</td>

                  <td>
                    {p.joinedAt
                      ? new Date(p.joinedAt).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(p.userEmail)}
                      className="btn btn-sm btn-error text-white"
                    >
                      <FaTrashCan />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 opacity-60">
                  No participants found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventParticipants;
