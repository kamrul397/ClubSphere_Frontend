import React from "react";
import Banner from "./Banner";
import { motion } from "framer-motion";
import Coverage from "./Coverage";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
// Correct path based on your folder structure: src/pages/home/Home.jsx -> src/hooks/

const Home = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Get current logged-in user

  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["approvedClubs", user?.email], // Include email in queryKey to refetch on login
    queryFn: async () => {
      // Pass the user email as a query parameter
      const res = await axiosSecure.get(`/clubs/approved?email=${user?.email}`);
      return res.data;
    },
  });
  return (
    <div className="min-h-screen">
      <Banner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
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
            {isLoading
              ? // Skeleton Loader
                [1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="card bg-base-100 shadow-xl animate-pulse"
                  >
                    <div className="bg-gray-200 h-48 w-full rounded-t-xl"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))
              : // Render approved clubs from database
                clubs.map((club) => (
                  <motion.div
                    key={club._id}
                    whileHover={{ scale: 1.02 }}
                    className="card bg-base-100 shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <figure>
                      <img
                        src={
                          club.bannerImage ||
                          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                        }
                        alt={club.clubName}
                        className="h-48 w-full object-cover"
                      />
                    </figure>
                    <div className="card-body">
                      <h2 className="card-title text-neutral">
                        {club.clubName}
                      </h2>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {club.description || "No description available."}
                      </p>
                      <div className="card-actions justify-end mt-4">
                        // Inside clubs.map logic:
                        <div className="card-actions justify-end mt-4">
                          <Link to={`/club-details/${club._id}`}>
                            <button className="btn btn-primary btn-sm">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>

          {!isLoading && clubs.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400">
                No approved clubs to show at the moment.
              </p>
            </div>
          )}
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
