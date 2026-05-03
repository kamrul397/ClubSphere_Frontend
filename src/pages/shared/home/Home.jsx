import React from "react";
import Banner from "./Banner";
import { motion } from "framer-motion";
import Coverage from "./Coverage";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAxiosPublic from "../../../hooks/useAxiosPublic";

const Home = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const axiosPublic = useAxiosPublic();

  // Featured Clubs
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["homeApprovedClubs", user?.email],
    queryFn: async () => {
      try {
        if (user?.email) {
          const res = await axiosSecure.get(
            `/clubs/approved?email=${user.email}`,
          );
          return res.data;
        }

        const res = await axiosPublic.get("/clubs/approved");
        return res.data;
      } catch (error) {
        console.error("Failed to load featured clubs:", error);
        return [];
      }
    },
  });

  // Upcoming Events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["homeUpcomingEvents"],
    queryFn: async () => {
      const res = await axiosPublic.get("/events");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100">
      {/* Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Banner />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 py-10">
        {/* Featured Clubs Section */}
        <section className="rounded-[2rem] border border-white/70 bg-white/75 p-5 md:p-8 shadow-xl backdrop-blur">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">
              Featured Communities
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">
              Featured Clubs
            </h2>

            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-3 rounded-full"></div>

            <p className="text-slate-500 mt-4">
              Discover some of our most active local communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clubsLoading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-80 rounded-2xl border border-slate-200 bg-white/80 animate-pulse"
                  ></div>
                ))
              : clubs.slice(0, 3).map((club) => (
                  <motion.div
                    key={club._id}
                    whileHover={{ y: -6 }}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-lg transition-all duration-300 hover:border-primary/40 hover:shadow-2xl"
                  >
                    <figure className="relative overflow-hidden">
                      <img
                        src={
                          club.bannerImage ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={club.clubName}
                        className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent"></div>

                      <span className="absolute left-4 top-4 badge badge-primary badge-sm text-white">
                        {club.category || "Club"}
                      </span>
                    </figure>

                    <div className="p-5">
                      <h2 className="text-xl font-black text-slate-900">
                        {club.clubName}
                      </h2>

                      <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                        {club.description || "No description available."}
                      </p>

                      <div className="mt-5 flex justify-end">
                        <Link
                          to={`/club-details/${club._id}`}
                          className="btn btn-primary btn-sm text-white"
                        >
                          View Details
                          <FaArrowRight />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {!clubsLoading && clubs.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
              No featured clubs available right now.
            </div>
          )}
        </section>

        {/* Upcoming Events Section */}
        <section className="rounded-[2rem] border border-white/70 bg-white/75 p-5 md:p-8 shadow-xl backdrop-blur">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10"
          >
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-secondary">
                Upcoming Activities
              </p>

              <h2 className="mt-2 text-3xl md:text-4xl font-black text-slate-900">
                Upcoming Events
              </h2>

              <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mt-3 rounded-full"></div>
            </div>

            <Link to="/all-events" className="btn btn-primary text-white">
              View All Events
              <FaArrowRight />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsLoading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-52 rounded-2xl border border-slate-200 bg-white/80 animate-pulse"
                  ></div>
                ))
              : events.slice(0, 3).map((event) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -6 }}
                    viewport={{ once: true }}
                    className="flex flex-col rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg transition-all duration-300 hover:border-secondary/40 hover:shadow-2xl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="badge badge-secondary badge-outline">
                        {event.category || "General"}
                      </span>

                      {Number(event.eventFee) > 0 ? (
                        <span className="font-black text-primary">
                          ${event.eventFee}
                        </span>
                      ) : (
                        <span className="font-black text-success">FREE</span>
                      )}
                    </div>

                    <h3 className="text-xl font-black mb-3 text-slate-900">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        {event.eventDate
                          ? new Date(event.eventDate).toLocaleDateString()
                          : "No date"}
                      </div>

                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        {event.location || "No location"}
                      </div>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="btn btn-outline btn-primary btn-sm mt-auto"
                    >
                      View Event
                    </Link>
                  </motion.div>
                ))}
          </div>

          {!eventsLoading && events.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
              No upcoming events available right now.
            </div>
          )}
        </section>

        {/* Coverage Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="rounded-[2rem] border border-white/70 bg-white/75 p-5 md:p-8 shadow-xl backdrop-blur"
        >
          <Coverage />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
