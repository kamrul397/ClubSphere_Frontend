import React from "react";
import Banner from "./Banner";
import { motion } from "framer-motion";
import Coverage from "./Coverage";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* 1. Hero Section */}
      <Banner />

      {/* 2. Basic Content Wrapper */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
        {/* Placeholder for Featured Clubs (Requirement Check) */}
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

          {/* This is where your TanStack Query mapping will go later */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="card bg-base-100 shadow-xl border border-gray-100"
              >
                <figure className="px-4 pt-4">
                  <div className="bg-gray-200 h-48 w-full rounded-xl animate-pulse"></div>
                </figure>
                <div className="card-body">
                  <h2 className="card-title text-neutral">Loading Club...</h2>
                  <p className="text-sm text-gray-500">
                    Club details will appear here once connected to the
                    database.
                  </p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary btn-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
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
