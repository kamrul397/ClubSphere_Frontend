import React from "react";
import { Link } from "react-router";
import { FaLayerGroup } from "react-icons/fa6";

const Logo = ({ variant = "default", compact = false }) => {
  const isLight = variant === "light";

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 rounded-2xl transition-all duration-300 ${
        compact ? "px-2 py-1.5" : "px-2 py-2"
      } ${isLight ? "hover:bg-white/10" : "hover:bg-base-200"}`}
    >
      <div
        className={`flex items-center justify-center rounded-2xl shadow-lg ${
          compact ? "h-11 w-11" : "h-12 w-12"
        } ${
          isLight
            ? "bg-white/10 border border-white/15 text-white backdrop-blur"
            : "bg-primary text-white"
        }`}
      >
        <FaLayerGroup className={compact ? "text-lg" : "text-xl"} />
      </div>

      <div className="leading-none">
        <h1
          className={`font-extrabold tracking-tight ${
            compact ? "text-[1.55rem]" : "text-[1.65rem]"
          } ${isLight ? "text-white" : "text-slate-800"}`}
        >
          ClubSphere
          <span className="text-primary">.</span>
        </h1>

        {!compact && (
          <p
            className={`mt-1 text-[10px] font-bold uppercase tracking-[0.22em] ${
              isLight ? "text-white/60" : "text-slate-400"
            }`}
          >
            Community Platform
          </p>
        )}
      </div>
    </Link>
  );
};

export default Logo;
