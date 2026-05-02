import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

import {
  FaCalendarDay,
  FaLocationDot,
  FaLayerGroup,
  FaUsers,
} from "react-icons/fa6";
import EventCard from "./EventCard";

const MyEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // 1. Fetch clubs
  const { data: myClubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // 2. Fetch all events
  const { data: allEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["all-manager-events"],
    queryFn: async () => {
      const res = await axiosSecure.get("/events");
      return res.data;
    },
  });

  // 3. Filter events
  const managedClubIds = myClubs.map((club) => club._id);
  const myEvents = allEvents.filter((event) =>
    managedClubIds.includes(event.clubId),
  );

  if (clubsLoading || eventsLoading) {
    return (
      <div className="flex justify-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 text-gray-800">
            <FaCalendarDay className="text-primary" />
            My Managed Events
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Managing activities across {myClubs.length} clubs.
          </p>
        </div>

        {myEvents.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
            <p className="text-xl opacity-50">
              No events found for your clubs.
            </p>
          </div>
        ) : (
          /* ✅ Fixed Grid: grid-cols-1 for mobile, 2 for tablet, 3 for desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((event) => {
              const club = myClubs.find((c) => c._id === event.clubId);
              return (
                <EventCard
                  key={event._id}
                  event={event}
                  clubName={club?.clubName || "N/A"}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;
