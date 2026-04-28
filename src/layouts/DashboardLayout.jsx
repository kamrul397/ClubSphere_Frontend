import React from "react";
import { NavLink, Outlet } from "react-router"; // Use NavLink for active states
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
import { FaApper } from "react-icons/fa6";
import useRole from "../hooks/useRole";
import Logo from "../components/Logo";

const DashboardLayout = () => {
  const { role } = useRole();

  // Reusable style logic for NavLinks
  const navStyle = ({ isActive }) =>
    `flex items-center   rounded-lg transition-all duration-300 font-medium ${
      isActive
        ? "bg-primary text-white shadow-md transform scale-105"
        : "text-gray-600 hover:bg-base-200 hover:text-primary"
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col bg-slate-50">
        {/* Top Navbar for Mobile */}
        <div className="navbar bg-white lg:hidden shadow-sm px-4">
          <div className="flex-none">
            <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
              <Logo></Logo>
            </label>
          </div>
          <div className="flex-1 px-2 font-bold text-primary tracking-tighter">
            CLUBSPHERE
          </div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-4 md:p-8 min-h-screen">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="drawer-side z-50">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="menu p-6 w-72 min-h-full bg-white text-base-content border-r border-base-200">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg mb-3">
              <FaLayerGroup className="text-white text-2xl" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800">
              ClubSphere <span className="text-primary">.</span>
            </h1>
            <span className="badge badge-sm badge-ghost opacity-70 mt-1 uppercase tracking-widest text-[9px]">
              {role || "user"} Mode
            </span>
          </div>

          <ul className="space-y-2">
            <p className="text-[11px] font-bold text-gray-400 tracking-widest ml-4 mb-2 uppercase">
              Main Menu
            </p>

            {/* Admin Links */}
            {role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/users-management"
                    className={navStyle}
                  >
                    <FaUsers /> Users Management
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/club-manager-approvals"
                    className={navStyle}
                  >
                    <FaApper /> Approvals
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/admin" className={navStyle}>
                    <FaLayerGroup /> Admin Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/manage-clubs" className={navStyle}>
                    <FaHome /> Manage Clubs
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/payments" className={navStyle}>
                    <FaHistory /> Transactions
                  </NavLink>
                </li>
              </>
            )}

            {/* Club Manager Links */}
            {role === "clubManager" && (
              <>
                <li>
                  <NavLink to="/dashboard/manager" className={navStyle}>
                    <FaLayerGroup /> Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/create-a-club" className={navStyle}>
                    <FaPlusCircle /> Create A Club
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/events-management"
                    className={navStyle}
                  >
                    <FaCalendarAlt /> Events
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-clubs" className={navStyle}>
                    <HiUserGroup /> My Clubs
                  </NavLink>
                </li>
              </>
            )}

            {/* Member Links */}
            {role === "member" && (
              <>
                <li>
                  <NavLink to="/dashboard/member" className={navStyle}>
                    <FaLayerGroup /> Overview
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-joined-clubs" className={navStyle}>
                    <FaHome /> Joined Clubs
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/my-events" className={navStyle}>
                    <FaCalendarAlt /> My Events
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/be-a-creator" className={navStyle}>
                    <FaPlusCircle /> Become Manager
                  </NavLink>
                </li>
              </>
            )}

            {/* Shared Links */}
            <div className="pt-6 pb-2">
              <p className="text-[11px] font-bold text-gray-400 tracking-widest ml-4 uppercase">
                Portal
              </p>
            </div>
            <li>
              <NavLink to="/" className={navStyle}>
                <FaHome /> Home Page
              </NavLink>
            </li>
            <li>
              <NavLink to="/clubs" className={navStyle}>
                <FaSearch /> Explore Clubs
              </NavLink>
            </li>
          </ul>

          {/* User Status Card (Nice extra touch) */}
          <div className="mt-auto p-4 bg-slate-100 rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500 text-center">Connected as</p>
            <p className="text-sm font-bold text-slate-800 text-center truncate">
              {role}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
