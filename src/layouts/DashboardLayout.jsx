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
import { FaUserCheck } from "react-icons/fa6";
import useRole from "../hooks/useRole";
import Logo from "../components/Logo";

const DashboardLayout = () => {
  const { role } = useRole();

  const navStyle = ({ isActive }) =>
    `flex w-full min-w-0 items-center gap-3 rounded-xl px-4 py-2.5 font-medium transition-all duration-300 ${
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
        <div className="navbar shrink-0 border-b border-base-200 bg-white px-4 shadow-sm lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost rounded-xl"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div className="flex-1 pl-2">
            <Logo compact />
          </div>
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

        <aside className="flex h-dvh w-72 max-w-72 flex-col overflow-hidden border-r border-base-200 bg-white p-5 text-base-content">
          {/* Logo Section */}
          <div className="mb-6 shrink-0 rounded-2xl border border-base-200 bg-base-100 p-3">
            <div className="flex flex-col items-center">
              <Logo />
              <span className="badge badge-sm badge-ghost mt-3 text-[10px] uppercase tracking-widest opacity-70">
                {role || "user"} Mode
              </span>
            </div>
          </div>

          {/* Scrollable sidebar links */}
          <nav className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-1">
            <ul className="menu w-full space-y-1 overflow-x-hidden p-0">
              <p className="mb-2 ml-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Main Menu
              </p>

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
            <p className="truncate text-center text-sm font-bold capitalize text-slate-800">
              {role || "user"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
