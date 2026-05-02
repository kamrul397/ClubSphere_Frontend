import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FaCalendarDay,
  FaLocationDot,
  FaLayerGroup,
  FaUsers,
} from "react-icons/fa6";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EventCard = ({ event, clubName }) => {
  const axiosSecure = useAxiosSecure();

  // ✅ The hook is now correctly at the top level of its own component
  const { data: participants = [] } = useQuery({
    queryKey: ["participants", event._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/event-registrations/${event._id}`);
      return res.data;
    },
  });

  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 hover:shadow-2xl transition-all">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <h3 className="card-title text-primary leading-tight">
            {event.title}
          </h3>
          <div className="badge badge-secondary badge-outline text-[10px]">
            {clubName}
          </div>
        </div>

        <p className="text-sm opacity-70 line-clamp-2 my-2">
          {event.description}
        </p>

        <div className="space-y-2 mt-2 text-xs font-medium opacity-80">
          <div className="flex items-center gap-2">
            <FaCalendarDay className="text-secondary" />
            {new Date(event.eventDate).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-secondary" />
            {event.location}
          </div>
        </div>

        <div className="mt-3">
          <span className="badge badge-info flex items-center gap-1">
            <FaUsers /> {participants.length} Joined
          </span>
        </div>

        <div className="card-actions justify-between items-center mt-4 pt-4 border-t border-base-200">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold opacity-50">
            <FaLayerGroup /> {clubName}
          </div>
          {event.isPaid ? (
            <span className="text-success font-bold">${event.eventFee}</span>
          ) : (
            <span className="badge badge-ghost badge-sm">FREE</span>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <Link
            to={`/dashboard/my-clubs/edit-event/${event._id}`}
            className="btn btn-warning btn-sm flex-1"
          >
            Update
          </Link>
          <Link
            to={`/dashboard/my-clubs/event-participants/${event._id}`}
            className="btn btn-outline btn-sm flex-1"
          >
            Participants
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
