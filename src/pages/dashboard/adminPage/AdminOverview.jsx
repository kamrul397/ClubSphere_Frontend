import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  FaUsers,
  FaLayerGroup,
  FaCalendarDays,
  FaUserShield,
  FaCircleCheck,
  FaHourglassHalf,
  FaXmark,
  FaSackDollar,
  FaArrowRight,
  FaClipboardCheck,
} from "react-icons/fa6";

import useAxiosSecure from "../../../hooks/useAxiosSecure";

const AdminOverview = () => {
  const axiosSecure = useAxiosSecure();

  const { data: overview = {}, isLoading } = useQuery({
    queryKey: ["adminOverview"],
    queryFn: async () => {
      const [usersRes, clubsRes, managersRes, eventsRes] = await Promise.all([
        axiosSecure.get("/users"),
        axiosSecure.get("/clubs"),
        axiosSecure.get("/club-managers"),
        axiosSecure.get("/events"),
      ]);

      const users = usersRes.data || [];
      const clubs = clubsRes.data || [];
      const managerApplications = managersRes.data || [];
      const events = eventsRes.data || [];

      const clubsWithMembers = await Promise.all(
        clubs.map(async (club) => {
          try {
            const membersRes = await axiosSecure.get(
              `/club-members/${club._id}`,
            );

            const members = membersRes.data || [];

            const membershipRevenue = members.reduce(
              (sum, member) => sum + Number(member.fee || 0),
              0,
            );

            return {
              ...club,
              membersCount: members.length,
              membershipRevenue,
            };
          } catch {
            return {
              ...club,
              membersCount: 0,
              membershipRevenue: 0,
            };
          }
        }),
      );

      const approvedClubs = clubsWithMembers.filter(
        (club) => club.status === "approved",
      );
      const pendingClubs = clubsWithMembers.filter(
        (club) => club.status === "pending",
      );
      const rejectedClubs = clubsWithMembers.filter(
        (club) => club.status === "rejected",
      );

      const pendingManagers = managerApplications.filter(
        (manager) => manager.status === "pending",
      );
      const approvedManagers = managerApplications.filter(
        (manager) => manager.status === "approved",
      );

      const totalMembers = clubsWithMembers.reduce(
        (sum, club) => sum + club.membersCount,
        0,
      );

      const totalRevenue = clubsWithMembers.reduce(
        (sum, club) => sum + club.membershipRevenue,
        0,
      );

      const admins = users.filter((user) => user.role === "admin");
      const clubManagers = users.filter((user) => user.role === "clubManager");
      const members = users.filter((user) => user.role === "member");

      return {
        users,
        clubs: clubsWithMembers,
        managerApplications,
        events,
        approvedClubs,
        pendingClubs,
        rejectedClubs,
        pendingManagers,
        approvedManagers,
        admins,
        clubManagers,
        members,
        totalMembers,
        totalRevenue,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const {
    users = [],
    clubs = [],
    managerApplications = [],
    events = [],
    approvedClubs = [],
    pendingClubs = [],
    rejectedClubs = [],
    pendingManagers = [],
    approvedManagers = [],
    admins = [],
    clubManagers = [],
    members = [],
    totalMembers = 0,
    totalRevenue = 0,
  } = overview;

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <FaUsers />,
      color: "text-primary",
      bg: "bg-primary/10",
      link: "/dashboard/users-management",
    },
    {
      title: "Total Clubs",
      value: clubs.length,
      icon: <FaLayerGroup />,
      color: "text-secondary",
      bg: "bg-secondary/10",
      link: "/dashboard/manage-clubs",
    },
    {
      title: "Total Events",
      value: events.length,
      icon: <FaCalendarDays />,
      color: "text-accent",
      bg: "bg-accent/10",
      link: "/all-events",
    },
    {
      title: "Total Memberships",
      value: totalMembers,
      icon: <FaClipboardCheck />,
      color: "text-success",
      bg: "bg-success/10",
      link: "/dashboard/manage-clubs",
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
                  Admin Dashboard
                </p>

                <h1 className="mt-2 text-3xl md:text-4xl font-black leading-tight">
                  Admin Overview
                </h1>

                <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                  Monitor users, clubs, manager requests, events, and membership
                  activity from one control center.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/dashboard/users-management"
                  className="btn btn-primary btn-sm text-white"
                >
                  Manage Users
                  <FaArrowRight />
                </Link>

                <Link
                  to="/dashboard/manage-clubs"
                  className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-900 btn-sm"
                >
                  Manage Clubs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="min-h-0 flex-1 overflow-y-auto pr-1 space-y-4">
        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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

        {/* Revenue + Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-base-200 bg-gradient-to-br from-success/10 to-primary/10 p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success text-xl">
                <FaSackDollar />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-60">
                  Membership Revenue
                </p>

                <h3 className="text-3xl font-black text-success">
                  ${totalRevenue}
                </h3>
              </div>
            </div>

            <p className="mt-3 text-xs text-base-content/60">
              Calculated from membership fee records in club members data.
            </p>
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black">Club Status Overview</h3>

              <Link
                to="/dashboard/manage-clubs"
                className="btn btn-ghost btn-xs text-primary"
              >
                Review Clubs <FaArrowRight />
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
                    <FaXmark /> Rejected
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

        {/* User Roles + Manager Requests */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* User Role Breakdown */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">User Role Breakdown</h3>
                <p className="text-xs text-base-content/50">
                  Platform users grouped by role.
                </p>
              </div>

              <Link
                to="/dashboard/users-management"
                className="btn btn-primary btn-xs text-white"
              >
                Manage
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-primary/10 p-4 text-center">
                <FaUserShield className="mx-auto text-primary text-xl mb-2" />
                <p className="text-2xl font-black text-primary">
                  {admins.length}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Admins
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/10 p-4 text-center">
                <FaUsers className="mx-auto text-secondary text-xl mb-2" />
                <p className="text-2xl font-black text-secondary">
                  {clubManagers.length}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Managers
                </p>
              </div>

              <div className="rounded-2xl bg-accent/10 p-4 text-center">
                <FaUsers className="mx-auto text-accent text-xl mb-2" />
                <p className="text-2xl font-black text-accent">
                  {members.length}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Members
                </p>
              </div>
            </div>
          </div>

          {/* Manager Applications */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">Manager Applications</h3>
                <p className="text-xs text-base-content/50">
                  Review club manager role requests.
                </p>
              </div>

              <Link
                to="/dashboard/club-manager-approvals"
                className="btn btn-primary btn-xs text-white"
              >
                Review
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-warning/10 p-4 text-center">
                <FaHourglassHalf className="mx-auto text-warning text-xl mb-2" />
                <p className="text-2xl font-black text-warning">
                  {pendingManagers.length}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Pending
                </p>
              </div>

              <div className="rounded-2xl bg-success/10 p-4 text-center">
                <FaCircleCheck className="mx-auto text-success text-xl mb-2" />
                <p className="text-2xl font-black text-success">
                  {approvedManagers.length}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Approved
                </p>
              </div>

              <div className="rounded-2xl bg-primary/10 p-4 text-center">
                <FaClipboardCheck className="mx-auto text-primary text-xl mb-2" />
                <p className="text-2xl font-black text-primary">
                  {managerApplications.length}
                </p>
                <p className="text-[10px] font-bold uppercase opacity-60">
                  Total
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Recent Clubs */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">Recent Clubs</h3>
                <p className="text-xs text-base-content/50">
                  Latest club requests and statuses.
                </p>
              </div>

              <Link
                to="/dashboard/manage-clubs"
                className="btn btn-outline btn-xs"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {clubs.slice(0, 5).map((club) => (
                <div
                  key={club._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-base-200 p-3 hover:bg-base-200/40 transition"
                >
                  <div className="min-w-0">
                    <h4 className="font-black text-sm truncate">
                      {club.clubName}
                    </h4>
                    <p className="text-xs opacity-60 truncate">
                      {club.managerEmail || "No manager"} •{" "}
                      {club.membersCount || 0} members
                    </p>
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
                <div className="rounded-xl border border-dashed border-base-300 p-8 text-center text-sm opacity-60">
                  No clubs found.
                </div>
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="rounded-2xl border border-base-200 bg-base-100 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black">Recent Users</h3>
                <p className="text-xs text-base-content/50">
                  Latest registered users on ClubSphere.
                </p>
              </div>

              <Link
                to="/dashboard/users-management"
                className="btn btn-outline btn-xs"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2">
              {users.slice(0, 5).map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-base-200 p-3 hover:bg-base-200/40 transition"
                >
                  <div className="min-w-0">
                    <h4 className="font-black text-sm truncate">
                      {user.name || "Unknown User"}
                    </h4>
                    <p className="text-xs opacity-60 truncate">{user.email}</p>
                  </div>

                  <span className="badge badge-primary badge-xs text-white capitalize">
                    {user.role || "member"}
                  </span>
                </div>
              ))}

              {users.length === 0 && (
                <div className="rounded-xl border border-dashed border-base-300 p-8 text-center text-sm opacity-60">
                  No users found.
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

export default AdminOverview;
