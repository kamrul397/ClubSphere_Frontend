import { motion } from "framer-motion";
const Banner = () => {
  return (
    <div className="hero min-h-[70vh] bg-base-200 rounded-3xl overflow-hidden my-6">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-neutral"
          >
            Where Passion Meets <span className="text-primary">Community</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="py-6 text-gray-600"
          >
            Discover local clubs, attend exciting events, and manage your
            memberships all in one place.
          </motion.p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-primary text-white">
              Explore Clubs
            </button>
            <button className="btn btn-secondary">Create a Club</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
