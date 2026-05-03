import React from "react";
import { Link } from "react-router";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
  FaLocationDot,
  FaPhone,
  FaArrowRight,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/20 blur-3xl"></div>
      <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-secondary/20 blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-7 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_1.15fr_0.9fr] gap-8 lg:gap-10 items-start">
          {/* Brand */}
          <div className="max-w-sm">
            <h2 className="text-xl font-black mb-2">
              ClubSphere<span className="text-primary">.</span>
            </h2>

            <p className="text-xs text-slate-300 leading-relaxed">
              ClubSphere helps people discover local clubs, join communities,
              and register for events. Club managers can organize clubs,
              members, and event registrations easily.
            </p>

            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-circle btn-xs bg-white/10 border-white/10 text-white hover:bg-primary hover:border-primary"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-circle btn-xs bg-white/10 border-white/10 text-white hover:bg-primary hover:border-primary"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="btn btn-circle btn-xs bg-white/10 border-white/10 text-white hover:bg-primary hover:border-primary"
                aria-label="X"
              >
                <FaXTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:justify-self-center">
            <h3 className="text-base font-black mb-3">Quick Links</h3>

            <ul className="space-y-2 text-xs text-slate-300">
              {[
                ["Home", "/"],
                ["Explore Clubs", "/all-clubs"],
                ["All Events", "/all-events"],
                ["Login", "/login"],
                ["Register", "/signup"],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link
                    to={path}
                    className="inline-flex items-center gap-2 hover:text-primary transition-colors"
                  >
                    <FaArrowRight className="text-[10px]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-base font-black mb-3">ClubSphere For</h3>

            <ul className="space-y-2 text-xs text-slate-300">
              <li className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="font-bold text-white">Members</p>
                <p className="text-[11px] text-slate-400">
                  Join clubs and register for events.
                </p>
              </li>

              <li className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="font-bold text-white">Club Managers</p>
                <p className="text-[11px] text-slate-400">
                  Manage clubs, members, and events.
                </p>
              </li>

              {/* <li className="rounded-xl bg-white/5 border border-white/10 px-3 py-2">
                <p className="font-bold text-white">Admins</p>
                <p className="text-[11px] text-slate-400">
                  Approve clubs and monitor platform.
                </p>
              </li> */}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:justify-self-end">
            <h3 className="text-base font-black mb-3">Contact</h3>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 text-primary">
                  <FaEnvelope />
                </span>
                <div>
                  <p className="font-semibold text-white">Email</p>
                  <p>support@clubsphere.com</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="mt-1 text-primary">
                  <FaPhone />
                </span>
                <div>
                  <p className="font-semibold text-white">Phone</p>
                  <p>+880 1234-567890</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <span className="mt-1 text-primary">
                  <FaLocationDot />
                </span>
                <div>
                  <p className="font-semibold text-white">Location</p>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-7 pt-4 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[11px] text-slate-400 text-center md:text-left">
            © {new Date().getFullYear()} ClubSphere. All rights reserved.
          </p>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <Link to="/" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <span className="h-1 w-1 rounded-full bg-slate-600"></span>
            <Link to="/" className="hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
