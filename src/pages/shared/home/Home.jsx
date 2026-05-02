import React from "react";
import Banner from "./Banner";
import { motion } from "framer-motion";
import Coverage from "./Coverage";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const Home = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch Approved Clubs
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["approvedClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/approved?email=${user?.email}`);
      return res.data;
    },
  });

  // Fetch Upcoming Events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["upcomingEvents"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-events");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Banner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
        {/* --- Featured Clubs Section --- */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-3xl font-bold text-neutral">Featured Clubs</h2>
            <div className="w-20 h-1 bg-primary mx-auto mt-2"></div>
            <p className="text-gray-500 mt-4">
              Discover some of our most active local communities.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubsLoading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="card bg-base-100 shadow-xl animate-pulse h-80"
                  ></div>
                ))
              : clubs.slice(0, 3).map((club) => (
                  <motion.div
                    key={club._id}
                    whileHover={{ scale: 1.02 }}
                    className="card bg-base-100 shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <figure>
                      <img
                        src={
                          club.bannerImage ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={club.clubName}
                        className="h-48 w-full object-cover"
                      />
                    </figure>
                    <div className="card-body p-6">
                      <h2 className="card-title text-neutral">
                        {club.clubName}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {club.description}
                      </p>
                      <div className="card-actions justify-end mt-4">
                        <Link
                          to={`/club-details/${club._id}`}
                          className="btn btn-primary btn-sm"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        </section>

        {/* --- Upcoming Events Section --- */}
        <section>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-10"
          >
            <div>
              <h2 className="text-3xl font-bold text-neutral">
                Upcoming Events
              </h2>
              <div className="w-20 h-1 bg-secondary mt-2"></div>
            </div>
            <Link
              to="/events"
              className="text-primary font-semibold hover:underline"
            >
              View All Events
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventsLoading
              ? [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="h-40 bg-white rounded-xl shadow animate-pulse"
                  ></div>
                ))
              : events.map((event) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span className="badge badge-secondary badge-outline">
                        {event.category || "General"}
                      </span>
                      {event.eventFee > 0 ? (
                        <span className="text-primary font-bold">
                          ${event.eventFee}
                        </span>
                      ) : (
                        <span className="text-success font-bold">FREE</span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-800">
                      {event.title}
                    </h3>
                    <div className="space-y-2 mb-6 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-primary" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-primary" />
                        {event.location}
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
        </section>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <Coverage />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
