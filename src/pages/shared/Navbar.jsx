import React from "react";
import Logo from "../../components/Logo";
import { Link, NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { user, logOut } = useAuth();

  const handleLogout = () => {
    logOut()
      .then(() => {
        // Handle successful logout
        console.log("User logged out");
      })
      .catch((error) => {
        // Handle logout error
        console.error("Error logging out:", error);
      });
  };

  const links = (
    <>
      <li>
        <NavLink to="">Item 1</NavLink>
      </li>

      <li>
        <NavLink to="">Item 2</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/create-a-club">Create A Club</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/my-clubs">My Clubs</NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div className="max-lg:collapse bg-base-200 shadow-sm w-full rounded-md">
      <input id="navbar-1-toggle" className="peer hidden" type="checkbox" />
      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 hidden max-lg:peer-checked:block"
      ></label>
      <div className="collapse-title navbar">
        <div className="navbar-start">
          <label htmlFor="navbar-1-toggle" className="btn btn-ghost lg:hidden">
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
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
          {/* login/logout button  */}
          <div className="flex items-center gap-2 mr-4">
            {user ? (
              <div className="dropdown dropdown-end">
                {/* The Trigger (The User's Image) */}
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar border-primary"
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

                {/* The Popover/Dropdown Content */}
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow-2xl border border-base-200"
                >
                  <li className="px-4 py-2 font-bold text-primary border-b border-base-200 mb-2">
                    {user?.displayName || "Member"}
                  </li>

                  <li>
                    <Link to="/profile">View Profile</Link>
                  </li>

                  {/* Your "Be a Creator" button is now neat and tidy inside the menu */}

                  <li className="mt-2">
                    <button
                      onClick={handleLogout}
                      className="btn btn-sm btn-error btn-outline"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary text-white">
                Login
              </Link>
            )}

            <li>
              <Link to="/be-a-creator" className="text-secondary font-semibold">
                Be a Creator
              </Link>
            </li>
          </div>
          {/* search bar */}
          <input
            type="text"
            placeholder="Search"
            className="input input-bordered w-64 lg:w-auto"
          />
        </div>
      </div>

      <div className="collapse-content lg:hidden z-1">
        <ul className="menu">{links}</ul>
      </div>
    </div>
  );
};

export default Navbar;
