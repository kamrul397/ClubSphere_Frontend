import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  FaUsers,
  FaCalendarCheck,
  FaCalendarDays,
  FaArrowRight,
  FaLocationDot,
  FaCircleCheck,
  FaLayerGroup,
} from "react-icons/fa6";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const MemberOverview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: joinedClubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["memberOverviewJoinedClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-joined-clubs/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: registeredEvents = [], isLoading: registeredEventsLoading } =
    useQuery({
      queryKey: ["memberOverviewRegisteredEvents", user?.email],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/my-registered-events/${user.email}`,
        );
        return res.data;
      },
      enabled: !!user?.email,
    });

  const { data: clubEvents = [], isLoading: clubEventsLoading } = useQuery({
    queryKey: ["memberOverviewClubEvents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/member-events/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isLoading =
    clubsLoading || registeredEventsLoading || clubEventsLoading;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const userName = user?.displayName || "Member";

  const upcomingEvents = clubEvents
    .filter((event) => {
      if (!event.eventDate) return true;
      return new Date(event.eventDate) >= new Date();
    })
    .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
    .slice(0, 4);

  const latestClubs = joinedClubs.slice(0, 3);

  const stats = [
    {
      title: "Joined Clubs",
      value: joinedClubs.length,
      icon: <FaUsers />,
      color: "text-primary",
      bg: "bg-primary/10",
      link: "/dashboard/my-joined-clubs",
    },
    {
      title: "Registered Events",
      value: registeredEvents.length,
      icon: <FaCalendarCheck />,
      color: "text-secondary",
      bg: "bg-secondary/10",
      link: "/dashboard/member-joined-events",
    },
    {
      title: "Upcoming Club Events",
      value: upcomingEvents.length,
      icon: <FaCalendarDays />,
      color: "text-accent",
      bg: "bg-accent/10",
      link: "/all-events",
    },
  ];

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
                  Member Dashboard
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                  Welcome, {userName}
                </h1>

                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  Track your joined clubs, registered events, and upcoming club
                  activities from one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/all-clubs"
                  className="btn btn-primary btn-sm text-white"
                >
                  Explore Clubs
                  <FaArrowRight />
                </Link>

                <Link
                  to="/all-events"
                  className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900 btn-sm"
                >
                  Browse Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.title}
              to={stat.link}
              className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">
                    {stat.title}
                  </p>

                  <p className={`mt-1 text-4xl font-black ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${stat.bg} ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Joined Clubs */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-black text-base-content">
                  My Joined Clubs
                </h2>
                <p className="text-xs text-base-content/50">
                  Clubs where your membership is active.
                </p>
              </div>

              <Link
                to="/dashboard/my-joined-clubs"
                className="btn btn-primary btn-xs text-white"
              >
                View All
              </Link>
            </div>

            {latestClubs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
                <FaLayerGroup className="mx-auto text-3xl opacity-30 mb-3" />
                <p className="text-sm text-base-content/60">
                  You have not joined any clubs yet.
                </p>
                <Link to="/all-clubs" className="btn btn-primary btn-sm mt-3">
                  Explore Clubs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {latestClubs.map((club) => (
                  <div
                    key={club._id}
                    className="flex items-center gap-3 rounded-xl border border-base-200 bg-base-100 p-3 hover:bg-base-200/40 transition"
                  >
                    <div className="avatar shrink-0">
                      <div className="h-12 w-12 rounded-xl">
                        <img
                          src={
                            club.bannerImage || "https://via.placeholder.com/80"
                          }
                          alt={club.clubName}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-sm truncate">
                        {club.clubName}
                      </h3>

                      <p className="text-xs opacity-60 truncate">
                        {club.category || "Club"} •{" "}
                        {club.joinedAt
                          ? new Date(club.joinedAt).toLocaleDateString()
                          : "Joined"}
                      </p>
                    </div>

                    <span className="badge badge-success badge-xs text-white capitalize">
                      {club.membershipStatus || "active"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="text-lg font-black text-base-content">
                  Upcoming Events From My Clubs
                </h2>
                <p className="text-xs text-base-content/50">
                  Events created under the clubs you joined.
                </p>
              </div>

              <Link to="/all-events" className="btn btn-outline btn-xs">
                View All
              </Link>
            </div>

            {upcomingEvents.length === 0 ? (
              <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
                <FaCalendarDays className="mx-auto text-3xl opacity-30 mb-3" />
                <p className="text-sm text-base-content/60">
                  No upcoming events from your clubs right now.
                </p>
                <Link to="/all-events" className="btn btn-primary btn-sm mt-3">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div
                    key={event._id}
                    className="rounded-xl border border-base-200 bg-base-100 p-3 hover:bg-base-200/40 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-black text-sm truncate">
                          {event.title}
                        </h3>

                        <p className="text-xs opacity-60 mt-1">
                          {event.eventDate
                            ? new Date(event.eventDate).toLocaleDateString()
                            : "No date"}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs opacity-60 truncate">
                          <FaLocationDot />
                          {event.location || "No location"}
                        </p>
                      </div>

                      <Link
                        to={`/events/${event._id}`}
                        className="btn btn-primary btn-xs text-white shrink-0"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Registered Events */}
        <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-black text-base-content">
                My Registered Events
              </h2>
              <p className="text-xs text-base-content/50">
                Events you have already joined.
              </p>
            </div>

            <Link
              to="/dashboard/member-joined-events"
              className="btn btn-secondary btn-xs text-white"
            >
              My Events
            </Link>
          </div>

          {registeredEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
              <FaCalendarCheck className="mx-auto text-3xl opacity-30 mb-3" />
              <p className="text-sm text-base-content/60">
                You have not registered for any event yet.
              </p>
              <Link to="/all-events" className="btn btn-primary btn-sm mt-3">
                Explore Events
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {registeredEvents.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  className="rounded-xl border border-base-200 bg-base-100 p-4 hover:bg-base-200/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-black text-sm truncate">
                        {event.title}
                      </h3>

                      <p className="text-xs opacity-60 mt-1">
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "No date"}
                      </p>
                    </div>

                    <span className="badge badge-success badge-xs text-white">
                      <FaCircleCheck />
                      Joined
                    </span>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="btn btn-outline btn-primary btn-xs mt-4"
                  >
                    View Event
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-2"></div>
      </div>
    </div>
  );
};

export default MemberOverview;
