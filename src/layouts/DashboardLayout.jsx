import React from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaHistory,
  FaPlusCircle,
  FaLayerGroup,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { FaApper } from "react-icons/fa6";
import useRole from "../hooks/useRole";

const DashboardLayout = () => {
  // TODO: Get user role from your AuthContext/Hook
  const { role } = useRole();
  console.log(role); // Example: 'admin' | 'clubManager' | 'member'

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Page Content */}
      <div className="drawer-content flex flex-col bg-base-200">
        {/* Top Navbar for Mobile */}
        <div className="navbar bg-base-100 lg:hidden shadow-sm">
          <div className="flex-none">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-square btn-ghost drawer-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-5 h-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2 font-bold uppercase">ClubSphere</div>
        </div>

        {/* Main Dashboard Content */}
        <div className="p-8 min-h-screen">
          <Outlet /> {/* This is where role-specific pages will render */}
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="drawer-side z-50">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-72 min-h-full bg-base-100 text-base-content shadow-xl">
          {/* Logo / Brand */}
          <div className="flex flex-col items-center mb-8 mt-4">
            <h1 className="text-2xl font-black text-primary italic">
              ClubSphere
            </h1>
            <div className="badge badge-secondary badge-outline mt-2 uppercase text-[10px] tracking-widest">
              {role} Dashboard
            </div>
          </div>

          <div className="divider opacity-50">MENU</div>

          {/* Role-Based Links */}
          {role === "admin" && (
            <>
              <li>
                <Link to="/dashboard/users-management">
                  <FaUsers /> Users Management
                </Link>
              </li>
              <li>
                <Link to="/dashboard/club-manager-approvals">
                  <FaApper /> Club Manager Approvals
                </Link>
              </li>

              <li>
                <Link to="/dashboard/admin">
                  <FaLayerGroup /> Admin Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-users">
                  <FaUsers /> Manage Users
                </Link>
              </li>
              <li>
                <Link to="/dashboard/manage-clubs">
                  <FaHome /> Manage Clubs
                </Link>
              </li>
              <li>
                <Link to="/dashboard/payments">
                  <FaHistory /> Transactions
                </Link>
              </li>
            </>
          )}

          {role === "clubManager" && (
            <>
              <li>
                <Link to="/dashboard/manager">
                  <FaLayerGroup /> Manager Overview
                </Link>
              </li>
              <li>
                <Link to="/create-a-club">
                  <FaPlusCircle /> Create A Club
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-clubs">
                  <FaHome /> My Managed Clubs
                </Link>
              </li>
              <li>
                <Link to="/dashboard/events-management">
                  <FaCalendarAlt /> Events Management
                </Link>
              </li>
              <li>
                <Link to="/dashboard/be-a-creator">
                  <FaCalendarAlt /> Be A Club Manager
                </Link>
              </li>
              {/* dashboard links */}

              <li>
                <NavLink
                  to="/dashboard/my-clubs"
                  className="flex items-center gap-2"
                >
                  <HiUserGroup className="text-xl" />
                  <span>My Clubs</span>
                </NavLink>
              </li>
              {/* <li>
                <Link to="/dashboard/payment">
                  <FaHistory /> Payment
                </Link>
              </li> */}
            </>
          )}

          {role === "member" && (
            <>
              <li>
                <Link to="/dashboard/member">
                  <FaLayerGroup /> Member Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-joined-clubs">
                  <FaHome /> My Joined Clubs
                </Link>
              </li>
              <li>
                <Link to="/dashboard/my-events">
                  <FaCalendarAlt /> Registered Events
                </Link>
              </li>
            </>
          )}

          {/* Shared Links */}
          <div className="divider opacity-50 mt-auto">PUBLIC SITES</div>
          <li>
            <Link to="/">
              <FaHome /> Home
            </Link>
          </li>

          <li>
            <Link to="/clubs">Explore Clubs</Link>
          </li>
          <li>
            <Link to="/events">Upcoming Events</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
