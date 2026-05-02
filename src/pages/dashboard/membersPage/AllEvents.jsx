import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import useEventStore from "../../../store/useEventStore";
import { FaEye, FaUsers } from "react-icons/fa6";

const AllEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const setSelectedEvent = useEventStore((state) => state.setSelectedEvent);

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["memberEvents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/member-events/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-slate-800">All Events</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
        <table className="table table-zebra w-full">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th>Event Title</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="hover">
                <td>
                  <div className="font-bold text-primary">{event.title}</div>
                  <div className="text-xs opacity-50 truncate max-w-[200px]">
                    {event.description}
                  </div>
                </td>
                <td className="text-sm">{event.location}</td>
                <td className="text-sm">
                  {new Date(event.eventDate).toLocaleDateString()}
                </td>
                <td>
                  <span
                    className={`badge badge-sm ${event.isPaid ? "badge-warning" : "badge-success text-white"}`}
                  >
                    {event.isPaid ? `$${event.eventFee}` : "Free"}
                  </span>
                </td>
                <td className="flex justify-end gap-2">
                  <Link
                    to={`/club-details/${event.clubId}`}
                    className="btn btn-ghost btn-xs text-secondary tooltip"
                    data-tip="Club Info"
                  >
                    <FaUsers size={16} />
                  </Link>
                  <Link
                    to={`/events/${event._id}`}
                    onClick={() => setSelectedEvent(event)}
                    className="btn btn-primary btn-xs flex items-center gap-1"
                  >
                    <FaEye size={14} /> Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllEvents;
