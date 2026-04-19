import React from "react";

import logo from "../assets/Gemini_Generated_Image_izpvx0izpvx0izpv.png";
import { Link } from "react-router";

const Logo = () => {
  return (
    <div className="w-[100px] h-[100px]">
      <Link
        to="/"
        className="btn btn-ghost hover:bg-transparent px-2 h-auto min-h-fit"
      >
        <img src={logo} alt="Logo" />
      </Link>
    </div>
  );
};

export default Logo;
