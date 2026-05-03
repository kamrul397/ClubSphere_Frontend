import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaLayerGroup,
  FaArrowRight,
  FaPlus,
  FaUsers,
  FaCalendarDays,
  FaClock,
  FaCircleCheck,
  FaHourglassHalf,
  FaSackDollar,
  FaLocationDot,
} from "react-icons/fa6";
import { Link } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManagerOverview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: overview = {}, isLoading } = useQuery({
    queryKey: ["managerOverview", user?.email],
    queryFn: async () => {
      const clubsRes = await axiosSecure.get(`/clubs?email=${user?.email}`);
      const clubs = clubsRes.data || [];

      const clubsWithStats = await Promise.all(
        clubs.map(async (club) => {
          const [membersRes, eventsRes] = await Promise.all([
            axiosSecure.get(`/club-members/${club._id}`),
            axiosSecure.get(`/events?clubId=${club._id}`),
          ]);

          const members = membersRes.data || [];
          const events = eventsRes.data || [];

          const eventsWithJoinedCount = await Promise.all(
            events.map(async (event) => {
              const registrationsRes = await axiosSecure.get(
                `/event-registrations/${event._id}`,
              );

              return {
                ...event,
                clubName: club.clubName,
                joinedCount: registrationsRes.data?.length || 0,
              };
            }),
          );

          const clubRevenue = members.reduce(
            (sum, member) => sum + Number(member.fee || 0),
            0,
          );

          return {
            ...club,
            membersCount: members.length,
            eventsCount: events.length,
            revenue: clubRevenue,
            events: eventsWithJoinedCount,
          };
        }),
      );

      const approvedClubs = clubsWithStats.filter(
        (club) => club.status === "approved",
      );
      const pendingClubs = clubsWithStats.filter(
        (club) => club.status === "pending",
      );
      const rejectedClubs = clubsWithStats.filter(
        (club) => club.status === "rejected",
      );

      const totalMembers = clubsWithStats.reduce(
        (sum, club) => sum + club.membersCount,
        0,
      );

      const totalEvents = clubsWithStats.reduce(
        (sum, club) => sum + club.eventsCount,
        0,
      );

      const totalRevenue = clubsWithStats.reduce(
        (sum, club) => sum + club.revenue,
        0,
      );

      const allEvents = clubsWithStats
        .flatMap((club) => club.events)
        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

      const totalParticipants = allEvents.reduce(
        (sum, event) => sum + event.joinedCount,
        0,
      );

      return {
        clubs: clubsWithStats,
        approvedClubs,
        pendingClubs,
        rejectedClubs,
        totalMembers,
        totalEvents,
        totalRevenue,
        totalParticipants,
        allEvents,
      };
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const {
    clubs = [],
    approvedClubs = [],
    pendingClubs = [],
    rejectedClubs = [],
    totalMembers = 0,
    totalEvents = 0,
    totalRevenue = 0,
    totalParticipants = 0,
    allEvents = [],
  } = overview;

  const statusCards = [
    {
      title: "Managed Clubs",
      value: clubs.length,
      icon: <FaLayerGroup />,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      title: "Total Members",
      value: totalMembers,
      icon: <FaUsers />,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: <FaCalendarDays />,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      title: "Event Joined",
      value: totalParticipants,
      icon: <FaCircleCheck />,
      color: "text-success",
      bg: "bg-success/10",
    },
  ];

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-base-content leading-tight">
            Manager Overview
          </h1>

          <p className="text-sm text-base-content/60">
            Welcome back, {user?.displayName || "Club Manager"}. Track your
            clubs, members, and events from one place.
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/dashboard/my-clubs"
            className="btn btn-outline btn-sm min-h-0 h-9"
          >
            My Clubs
          </Link>

          <Link
            to="/dashboard/create-a-club"
            className="btn btn-primary btn-sm min-h-0 h-9 gap-2"
          >
            <FaPlus />
            Create Club
          </Link>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 space-y-4">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-[1px] shadow-xl">
          <div className="relative rounded-3xl bg-base-100/90 p-5 md:p-6 backdrop-blur">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/30 blur-3xl"></div>

            <div className="relative flex flex-col lg:flex-row justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
                  ClubSphere Manager
                </p>

                <h2 className="mt-2 text-2xl md:text-4xl font-black text-base-content">
                  Your community control center
                </h2>

                <p className="mt-2 max-w-2xl text-sm text-base-content/60">
                  Manage club applications, monitor members, create events, and
                  review event registrations.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 min-w-[260px]">
                <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
                  <p className="text-2xl font-black text-success">
                    {approvedClubs.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase opacity-60">
                    Approved
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
                  <p className="text-2xl font-black text-warning">
                    {pendingClubs.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase opacity-60">
                    Pending
                  </p>
                </div>

                <div className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
                  <p className="text-2xl font-black text-error">
                    {rejectedClubs.length}
                  </p>
                  <p className="text-[10px] font-bold uppercase opacity-60">
                    Rejected
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {statusCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-base-200 bg-base-100 p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">
                    {card.title}
                  </p>

                  <p className={`mt-1 text-3xl font-black ${card.color}`}>
                    {card.value}
                  </p>
                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${card.bg} ${card.color}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue + Quick Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-base-200 bg-gradient-to-br from-success/10 to-primary/10 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success text-xl">
                <FaSackDollar />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Collected Membership Fees
                </p>

                <h3 className="text-3xl font-black text-success">
                  ${totalRevenue}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs text-base-content/60">
              Calculated from membership fee records in your club members data.
            </p>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black">Club Status Overview</h3>

              <Link
                to="/dashboard/my-clubs"
                className="btn btn-ghost btn-xs text-primary"
              >
                Manage All <FaArrowRight />
              </Link>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1 text-success">
                    <FaCircleCheck /> Approved
                  </span>
                  <span>{approvedClubs.length}</span>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={approvedClubs.length}
                  max={clubs.length || 1}
                ></progress>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1 text-warning">
                    <FaHourglassHalf /> Pending
                  </span>
                  <span>{pendingClubs.length}</span>
                </div>
                <progress
                  className="progress progress-warning w-full"
                  value={pendingClubs.length}
                  max={clubs.length || 1}
                ></progress>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="flex items-center gap-1 text-error">
                    <FaClock /> Rejected
                  </span>
                  <span>{rejectedClubs.length}</span>
                </div>
                <progress
                  className="progress progress-error w-full"
                  value={rejectedClubs.length}
                  max={clubs.length || 1}
                ></progress>
              </div>
            </div>
          </div>
        </div>

        {/* Clubs + Events */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Your Clubs */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">Your Clubs</h3>
                <p className="text-xs text-base-content/50">
                  Latest clubs managed by you
                </p>
              </div>

              <Link to="/dashboard/my-clubs" className="btn btn-primary btn-xs">
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {clubs.slice(0, 5).map((club) => (
                <div
                  key={club._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-base-200 bg-base-100 p-3 hover:bg-base-200/40 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="avatar shrink-0">
                      <div className="h-11 w-11 rounded-xl">
                        <img
                          src={club.bannerImage}
                          alt={club.clubName}
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-black">
                        {club.clubName}
                      </h4>

                      <p className="text-xs opacity-60">
                        {club.category || "No category"} • {club.membersCount}{" "}
                        members • {club.eventsCount} events
                      </p>
                    </div>
                  </div>

                  <span
                    className={`badge badge-xs font-bold uppercase ${
                      club.status === "approved"
                        ? "badge-success"
                        : club.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {club.status}
                  </span>
                </div>
              ))}

              {clubs.length === 0 && (
                <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
                  <p className="text-sm opacity-60">No clubs registered yet.</p>

                  <Link
                    to="/dashboard/create-a-club"
                    className="btn btn-primary btn-sm mt-3"
                  >
                    Create Your First Club
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">Upcoming Events</h3>
                <p className="text-xs text-base-content/50">
                  Events created under your clubs
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {allEvents.slice(0, 5).map((event) => (
                <div
                  key={event._id}
                  className="rounded-xl border border-base-200 bg-base-100 p-3 hover:bg-base-200/40 transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-black">
                        {event.title}
                      </h4>

                      <p className="text-xs opacity-60">
                        {event.clubName} •{" "}
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "No date"}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs opacity-60">
                        <FaLocationDot />
                        {event.location || "No location"}
                      </p>
                    </div>

                    <Link
                      to={`/dashboard/my-clubs/event-participants/${event._id}`}
                      className="btn btn-info btn-xs text-white shrink-0"
                    >
                      {event.joinedCount} Joined
                    </Link>
                  </div>
                </div>
              ))}

              {allEvents.length === 0 && (
                <div className="rounded-xl border border-dashed border-base-300 p-8 text-center">
                  <p className="text-sm opacity-60">No events created yet.</p>

                  <Link
                    to="/dashboard/my-clubs"
                    className="btn btn-outline btn-sm mt-3"
                  >
                    Go to My Clubs
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-2"></div>
      </div>
    </div>
  );
};

export default ManagerOverview;
