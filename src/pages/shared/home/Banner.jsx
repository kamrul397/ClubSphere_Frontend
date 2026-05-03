import { motion } from "framer-motion";
import { Link } from "react-router";
import {
  FaArrowRight,
  FaCalendarDays,
  FaLayerGroup,
  FaUsers,
  FaPlus,
  FaCircleCheck,
} from "react-icons/fa6";

import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import { useQuery } from "@tanstack/react-query";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const Banner = () => {
  const { user } = useAuth();
  const { role } = useRole();

  const axiosPublic = useAxiosPublic();

  const { data: stats = {} } = useQuery({
    queryKey: ["homeStats"],
    queryFn: async () => {
      const res = await axiosPublic.get("/home-stats");
      return res.data;
    },
  });

  const totalClubs = stats.totalClubs || 0;
  const totalEvents = stats.totalEvents || 0;
  const totalMembers = stats.totalMembers || 0;
  const eventsThisMonth = stats.eventsThisMonth || 0;
  const membersThisMonth = stats.membersThisMonth || 0;
  const totalRegistrations = stats.totalRegistrations || 0;
  const latestClubName = stats.latestClubName || "Featured Club";
  const latestEventTitle = stats.latestEventTitle || "Upcoming Event";
  const latestEventJoined = stats.latestEventJoined || 0;

  const getPrimaryAction = () => {
    if (!user) {
      return {
        label: "Explore Clubs",
        path: "/all-clubs",
      };
    }

    if (role === "admin") {
      return {
        label: "Admin Dashboard",
        path: "/dashboard/users-management",
      };
    }

    if (role === "clubManager") {
      return {
        label: "Manager Dashboard",
        path: "/dashboard/manager-overview",
      };
    }

    return {
      label: "Explore Clubs",
      path: "/all-clubs",
    };
  };

  const primaryAction = getPrimaryAction();

  return (
    <section className="relative my-6 overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl">
      {/* Background glow */}
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl"></div>
      <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-secondary/30 blur-3xl"></div>
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-3xl"></div>

      {/* Pattern */}
      <div className="absolute inset-0 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:28px_28px]"></div>
      </div>

      <div className="relative grid min-h-[72vh] grid-cols-1 items-center gap-10 px-6 py-14 md:px-12 lg:grid-cols-2 lg:px-16">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-white/80 backdrop-blur"
          >
            <FaCircleCheck className="text-primary" />
            Local Clubs • Events • Communities
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-black leading-tight md:text-6xl lg:text-7xl"
          >
            Where Passion Meets{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Community
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-300 md:text-base lg:mx-0"
          >
            Discover local clubs, join meaningful communities, register for
            exciting events, and manage your club activities from one smart
            platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            <Link
              to={primaryAction.path}
              className="btn btn-primary text-white shadow-lg shadow-primary/30"
            >
              {primaryAction.label}
              <FaArrowRight />
            </Link>

            {role === "clubManager" ? (
              <Link
                to="/dashboard/create-a-club"
                className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                <FaPlus />
                Create Club
              </Link>
            ) : role === "admin" ? (
              <Link
                to="/dashboard/manage-clubs"
                className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                Manage Clubs
              </Link>
            ) : (
              <Link
                to="/all-events"
                className="btn border-white/20 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                <FaCalendarDays />
                Explore Events
              </Link>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="mt-8 grid grid-cols-3 gap-3 text-center lg:max-w-lg"
          >
            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-2xl font-black text-primary">{totalClubs}+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Clubs
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-2xl font-black text-secondary">
                {totalEvents}+
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Events
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-3 backdrop-blur">
              <p className="text-2xl font-black text-accent">{totalMembers}+</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                Members
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, x: 30 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto h-[430px] max-w-[430px]">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-primary via-secondary to-accent p-[1px] shadow-2xl">
              <div className="h-full rounded-[2rem] bg-slate-900/90 p-6 backdrop-blur">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                      ClubSphere
                    </p>
                    <h3 className="text-2xl font-black">Community Hub</h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg">
                    <FaLayerGroup size={24} />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/20 text-primary">
                        <FaUsers />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-black">{latestClubName}</p>
                        <p className="text-xs text-white/50">
                          {totalMembers}+ active members
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                        <FaCalendarDays />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-black">
                          {latestEventTitle}
                        </p>
                        <p className="text-xs text-white/50">
                          {latestEventJoined} people registered
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/20 text-accent">
                        <FaCircleCheck />
                      </div>

                      <div>
                        <p className="font-black">Membership Active</p>
                        <p className="text-xs text-white/50">
                          {totalClubs}+ clubs ready to explore
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary/20 to-secondary/20 p-4">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/50">
                    This Month
                  </p>

                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black">{eventsThisMonth}</p>
                      <p className="text-xs text-white/50">New events</p>
                    </div>

                    <div>
                      <p className="text-3xl font-black">{membersThisMonth}</p>
                      <p className="text-xs text-white/50">New members</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -right-8 top-10 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-xl"
            >
              <p className="text-xs font-bold text-slate-500">Total Events</p>
              <p className="text-xl font-black text-primary">{totalEvents}+</p>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity }}
              className="absolute -left-8 bottom-12 rounded-2xl bg-white px-4 py-3 text-slate-900 shadow-xl"
            >
              <p className="text-xs font-bold text-slate-500">Registrations</p>
              <p className="text-xl font-black text-secondary">
                {totalRegistrations}+
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Banner;
