import React from "react";
import Logo from "../../components/Logo";
import { Link, NavLink } from "react-router";
import {
  FaCalendarAlt,
  FaHome,
  FaSearch,
  FaTachometerAlt,
  FaUser,
  FaSignOutAlt,
  FaPlusCircle,
  FaUsers,
} from "react-icons/fa";

import useAuth from "../../hooks/useAuth";
import useRole from "../../hooks/useRole";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { role } = useRole();

  const closeDropdown = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLogout = () => {
    closeDropdown();

    logOut()
      .then(() => {
        console.log("User logged out");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  const getDashboardPath = () => {
    if (role === "admin") return "/dashboard/users-management";
    if (role === "clubManager") return "/dashboard/manager-overview";
    return "/dashboard/member";
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold leading-none transition-all duration-300 ${
      isActive
        ? "bg-white text-primary shadow-lg"
        : "text-white/85 hover:bg-white/10 hover:text-white"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="/" onClick={closeDropdown} className={navLinkClass}>
          <FaHome className="text-[16px] shrink-0" />
          <span className="flex items-center">Home</span>
        </NavLink>
      </li>

      {(!user || role === "member") && (
        <>
          <li>
            <NavLink
              to="/all-clubs"
              onClick={closeDropdown}
              className={navLinkClass}
            >
              <FaSearch className="text-[14px] shrink-0" />
              <span className="flex items-center">Explore Clubs</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/all-events"
              onClick={closeDropdown}
              className={navLinkClass}
            >
              <FaCalendarAlt className="text-[14px] shrink-0" />
              <span className="flex items-center">All Events</span>
            </NavLink>
          </li>
        </>
      )}

      {user && (
        <li>
          <NavLink
            to={getDashboardPath()}
            onClick={closeDropdown}
            className={navLinkClass}
          >
            <FaTachometerAlt className="text-[14px] shrink-0" />
            <span className="flex items-center">Dashboard</span>
          </NavLink>
        </li>
      )}

      {user && role === "member" && (
        <>
          <li>
            <NavLink
              to="/dashboard/my-joined-clubs"
              onClick={closeDropdown}
              className={navLinkClass}
            >
              <FaUsers className="text-[14px] shrink-0" />
              <span className="flex items-center">My Clubs</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/member-joined-events"
              onClick={closeDropdown}
              className={navLinkClass}
            >
              <FaCalendarAlt className="text-[14px] shrink-0" />
              <span className="flex items-center">My Events</span>
            </NavLink>
          </li>
        </>
      )}

      {user && role === "clubManager" && (
        <>
          <li>
            <NavLink
              to="/dashboard/my-clubs"
              onClick={closeDropdown}
              className={navLinkClass}
            >
              <FaUsers className="text-[14px] shrink-0" />
              <span className="flex items-center">My Clubs</span>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/create-a-club"
              onClick={closeDropdown}
              className={navLinkClass}
            >
              <FaPlusCircle className="text-[14px] shrink-0" />
              <span className="flex items-center">Create Club</span>
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-50 w-full px-3 pt-3">
      <div className="relative mx-auto max-w-7xl overflow-visible rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-[#17203a] to-[#4a2856] shadow-2xl backdrop-blur-xl">
        {/* glow */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-secondary/20 blur-3xl"></div>

        <div className="navbar relative min-h-[74px] px-3 md:px-6">
          {/* Navbar Start */}
          <div className="navbar-start">
            <div className="dropdown">
              <label
                tabIndex={0}
                className="btn btn-ghost text-white hover:bg-white/10 lg:hidden"
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
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>

              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-4 z-[80] w-64 gap-1 rounded-2xl border border-white/10 bg-slate-900/95 p-3 text-white shadow-2xl backdrop-blur-xl"
              >
                {links}
              </ul>
            </div>

            {/* Logo already has Link inside */}
            <div onClick={closeDropdown} className="flex items-center">
              <Logo variant="light" compact />
            </div>
          </div>

          {/* Navbar Center */}
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal items-center gap-1 px-1">
              {links}
            </ul>
          </div>

          {/* Navbar End */}
          <div className="navbar-end">
            {user ? (
              <div className="dropdown dropdown-end">
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end leading-tight">
                    <p className="max-w-[160px] truncate text-sm font-extrabold tracking-[0.02em] text-white">
                      {user?.displayName || "User"}
                    </p>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                      {role || "member"}
                    </p>
                  </div>

                  <div
                    tabIndex={0}
                    role="button"
                    className="avatar btn btn-ghost btn-circle ring-2 ring-white/30 transition-all hover:bg-white/10 hover:ring-white"
                  >
                    <div className="w-10 rounded-full">
                      <img
                        alt="User Profile"
                        src={
                          user?.photoURL ||
                          "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        }
                      />
                    </div>
                  </div>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-[80] mt-4 w-72 rounded-3xl border border-white/10 bg-white p-4 text-slate-800 shadow-2xl"
                >
                  <li className="mb-2 border-b border-slate-200 px-3 py-3">
                    <p className="p-0 font-black text-primary">
                      {user?.displayName || "User"}
                    </p>

                    <p className="truncate p-0 text-xs text-slate-500">
                      {user?.email}
                    </p>

                    <span className="badge badge-primary badge-xs mt-2 capitalize text-white">
                      {role || "member"}
                    </span>
                  </li>

                  <li>
                    <Link to={getDashboardPath()} onClick={closeDropdown}>
                      <FaTachometerAlt />
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <Link to="/profile" onClick={closeDropdown}>
                      <FaUser />
                      View Profile
                    </Link>
                  </li>

                  {role === "member" && (
                    <li>
                      <Link
                        to="/dashboard/be-a-creator"
                        onClick={closeDropdown}
                      >
                        <FaPlusCircle />
                        Become Manager
                      </Link>
                    </li>
                  )}

                  <li className="mt-3">
                    <button
                      onClick={handleLogout}
                      className="btn btn-error btn-outline btn-sm w-full"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  onClick={closeDropdown}
                  className="btn btn-ghost btn-sm border-white/10 text-white hover:bg-white/10"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeDropdown}
                  className="btn btn-primary btn-sm text-white shadow-lg shadow-primary/30"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
