import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaHistory,
  FaPlusCircle,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { FaApper, FaUserCheck } from "react-icons/fa6";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  const { role } = useRole();

  const navStyle = ({ isActive }) =>
    `flex w-full min-w-0 items-center gap-3 rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "text-gray-600 hover:bg-base-200 hover:text-primary"
    }`;

  return (
    <div className="drawer lg:drawer-open fixed inset-0 h-dvh w-screen overflow-hidden bg-slate-50">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex h-dvh min-h-0 flex-col overflow-hidden bg-slate-50">
        {/* Top Navbar for Mobile */}
        <div className="navbar shrink-0 bg-white px-4 shadow-sm lg:hidden">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
          </div>

          <Link
            to="/"
            className="flex flex-1 items-center gap-2 px-2 font-bold tracking-tighter text-primary"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
              <FaLayerGroup />
            </div>
            CLUBSPHERE
          </Link>
        </div>

        {/* Main Dashboard Content */}
        <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8">
          <div className="mx-auto h-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Sidebar Navigation */}
      <div className="drawer-side z-50 h-dvh overflow-hidden">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>

        <aside className="flex h-dvh w-72 max-w-72 flex-col overflow-hidden border-r border-base-200 bg-white p-6 text-base-content">
          {/* Clickable Logo Section */}
          <Link
            to="/"
            className="mb-8 flex shrink-0 flex-col items-center rounded-2xl p-2 transition-all duration-300 hover:bg-base-200"
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <FaLayerGroup className="text-2xl text-white" />
            </div>

            <h1 className="text-xl font-bold tracking-tight text-gray-800">
              ClubSphere <span className="text-primary">.</span>
            </h1>

            <span className="badge badge-sm badge-ghost mt-1 text-[9px] uppercase tracking-widest opacity-70">
              {role || "user"} Mode
            </span>
          </Link>

          {/* Scrollable sidebar links */}
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <ul className="menu w-full space-y-1 overflow-x-hidden p-0">
              <p className="mb-2 ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Main Menu
              </p>

              {/* Admin Links */}
              {/* Admin Links */}
              {role === "admin" && (
                <>
                  <li className="w-full">
                    <NavLink
                      to="/dashboard/admin-overview"
                      className={navStyle}
                    >
                      <FaLayerGroup className="shrink-0" />
                      <span className="truncate">Admin Overview</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink
                      to="/dashboard/users-management"
                      className={navStyle}
                    >
                      <FaUsers className="shrink-0" />
                      <span className="truncate">Users Management</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink
                      to="/dashboard/club-manager-approvals"
                      className={navStyle}
                    >
                      <FaUserCheck className="shrink-0" />
                      <span className="truncate">Manager Approvals</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink to="/dashboard/manage-clubs" className={navStyle}>
                      <FaHome className="shrink-0" />
                      <span className="truncate">Manage Clubs</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink to="/dashboard/payment" className={navStyle}>
                      <FaHistory className="shrink-0" />
                      <span className="truncate">Transactions</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Club Manager Links */}
              {role === "clubManager" && (
                <>
                  <li className="w-full">
                    <NavLink
                      to="/dashboard/manager-overview"
                      className={navStyle}
                    >
                      <FaLayerGroup className="shrink-0" />
                      <span className="truncate">Overview</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink to="/dashboard/my-clubs" className={navStyle}>
                      <HiUserGroup className="shrink-0" />
                      <span className="truncate">My Clubs</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink to="/dashboard/create-a-club" className={navStyle}>
                      <FaPlusCircle className="shrink-0" />
                      <span className="truncate">Create A Club</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Member Links */}
              {role === "member" && (
                <>
                  <li className="w-full">
                    <NavLink to="/dashboard/member" className={navStyle}>
                      <FaLayerGroup className="shrink-0" />
                      <span className="truncate">Overview</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink
                      to="/dashboard/my-joined-clubs"
                      className={navStyle}
                    >
                      <FaHome className="shrink-0" />
                      <span className="truncate">Joined Clubs</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink
                      to="/dashboard/member-joined-events"
                      className={navStyle}
                    >
                      <FaCalendarAlt className="shrink-0" />
                      <span className="truncate">My Events</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink to="/dashboard/be-a-creator" className={navStyle}>
                      <FaPlusCircle className="shrink-0" />
                      <span className="truncate">Become Manager</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Portal Links */}
              <div className="pb-2 pt-6">
                <p className="ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                  Portal
                </p>
              </div>

              {/* Only members can see All Events and Explore Clubs */}
              {role === "member" && (
                <>
                  <li className="w-full">
                    <NavLink to="/all-events" className={navStyle}>
                      <FaCalendarAlt className="shrink-0" />
                      <span className="truncate">All Events</span>
                    </NavLink>
                  </li>

                  <li className="w-full">
                    <NavLink to="/all-clubs" className={navStyle}>
                      <FaSearch className="shrink-0" />
                      <span className="truncate">Explore Clubs</span>
                    </NavLink>
                  </li>
                </>
              )}

              {/* Everyone can see Home Page */}
              <li className="w-full">
                <NavLink to="/" className={navStyle}>
                  <FaHome className="shrink-0" />
                  <span className="truncate">Home Page</span>
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* User Status Card */}
          <div className="mt-4 shrink-0 rounded-2xl border border-slate-200 bg-slate-100 p-4">
            <p className="text-center text-xs text-slate-500">Connected as</p>
            <p className="truncate text-center text-sm font-bold text-slate-800">
              {role}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
