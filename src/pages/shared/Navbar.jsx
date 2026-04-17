import React from "react";
import Logo from "../../components/Logo";
import { Link, NavLink } from "react-router";

const Navbar = () => {
  const links = (
    <>
      <li>
        <NavLink to="">Item 1</NavLink>
      </li>

      <li>
        <NavLink to="">Item 2</NavLink>
      </li>
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
          <Link
            to="/"
            className="btn btn-ghost hover:bg-transparent px-2 h-auto min-h-fit"
          >
            <Logo className="h-10 w-auto" />
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end">
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
