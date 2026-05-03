import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaEye, FaUsers, FaCircleCheck } from "react-icons/fa6";

import useAxiosPublic from "../../../hooks/useAxiosPublic";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const AllEvents = () => {
  const axiosPublic = useAxiosPublic();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["allEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

  const { data: registeredEvents = [], isLoading: registeredLoading } =
    useQuery({
      queryKey: ["registeredEvents", user?.email],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/my-registered-events/${user.email}`,
        );
        return res.data;
      },
      enabled: !!user?.email,
    });

  const registeredEventIds = new Set(
    registeredEvents.map((event) => event._id),
  );

  if (eventsLoading || registeredLoading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-base-content">
          All Events
        </h2>
        <p className="text-sm text-base-content/60">
          Explore all upcoming events from ClubSphere.
        </p>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200 text-base-content/70">
            <tr>
              <th>Event</th>
              <th>Location</th>
              <th>Date</th>
              <th>Fee</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => {
              const isAlreadyJoined = registeredEventIds.has(event._id);

              return (
                <tr key={event._id} className="hover">
                  <td>
                    <div className="font-bold text-primary">
                      {event.title || "Untitled Event"}
                    </div>
                    <div className="text-xs opacity-50 truncate max-w-[240px]">
                      {event.description || "No description available"}
                    </div>
                  </td>

                  <td>{event.location || "N/A"}</td>

                  <td>
                    {event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString()
                      : "N/A"}
                  </td>

                  <td>
                    {event.isPaid ? (
                      <span className="badge badge-warning badge-sm">
                        ${event.eventFee || 0}
                      </span>
                    ) : (
                      <span className="badge badge-success badge-sm">Free</span>
                    )}
                  </td>

                  <td>
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/club-details/${event.clubId}`}
                        className="btn btn-ghost btn-xs text-secondary tooltip"
                        data-tip="Club Details"
                      >
                        <FaUsers size={16} />
                      </Link>

                      {isAlreadyJoined ? (
                        <Link
                          to="/dashboard/member-joined-events"
                          className="btn btn-success btn-xs flex items-center gap-1"
                        >
                          <FaCircleCheck size={14} />
                          Go to My Events
                        </Link>
                      ) : (
                        <Link
                          to={`/events/${event._id}`}
                          className="btn btn-primary btn-xs flex items-center gap-1"
                        >
                          <FaEye size={14} />
                          Details
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {events.length === 0 && (
          <div className="p-10 text-center text-gray-500">No events found.</div>
        )}
      </div>
    </div>
  );
};

export default AllEvents;
