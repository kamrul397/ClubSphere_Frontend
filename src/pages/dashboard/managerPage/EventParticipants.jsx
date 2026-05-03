import React from "react";
import { useParams, NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaArrowLeft, FaUsers } from "react-icons/fa6";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EventParticipants = () => {
  const { eventId } = useParams();
  const axiosSecure = useAxiosSecure();

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ["event-participants", eventId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/event-registrations/${eventId}`);
      return res.data;
    },
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const eventTitle = participants[0]?.eventTitle || "Event";

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-base-content leading-tight flex items-center gap-2">
            <FaUsers className="text-primary" />
            Event Participants
          </h2>

          <p className="text-sm text-base-content/60 leading-tight">
            {eventTitle} • Total joined: {participants.length}
          </p>
        </div>

        <NavLink to={-1} className="btn btn-outline btn-sm min-h-0 h-9 px-3">
          <FaArrowLeft size={13} />
          Back
        </NavLink>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="table table-xs table-zebra w-full text-xs [&_th]:py-2 [&_td]:py-2 [&_th]:px-3 [&_td]:px-3">
            <thead className="bg-base-200 text-base-content/70 sticky top-0 z-10">
              <tr className="whitespace-nowrap">
                <th>#</th>
                <th>Event Title</th>
                <th>User Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Registered At</th>
              </tr>
            </thead>

            <tbody>
              {participants.length > 0 ? (
                participants.map((participant, index) => {
                  const registeredDate =
                    participant.registeredAt ||
                    participant.joinedAt ||
                    participant.createdAt;

                  return (
                    <tr
                      key={participant._id || index}
                      className="whitespace-nowrap"
                    >
                      <td>{index + 1}</td>

                      <td className="font-semibold max-w-[180px] truncate">
                        {participant.eventTitle || "N/A"}
                      </td>

                      <td className="font-medium max-w-[160px] truncate">
                        {participant.userName || "Unknown User"}
                      </td>

                      <td className="max-w-[260px] truncate">
                        {participant.userEmail || "N/A"}
                      </td>

                      <td>
                        <span
                          className={`badge badge-xs min-h-0 h-5 px-2 ${
                            participant.status === "registered"
                              ? "badge-success"
                              : participant.status === "cancelled"
                                ? "badge-warning"
                                : "badge-ghost"
                          }`}
                        >
                          {participant.status || "N/A"}
                        </span>
                      </td>

                      <td>
                        {registeredDate
                          ? new Date(registeredDate).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 opacity-60">
                    No participants found for this event.
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

export default EventParticipants;
