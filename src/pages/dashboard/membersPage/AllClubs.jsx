import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FaEye, FaLocationDot, FaCircleCheck } from "react-icons/fa6";

import useAxiosPublic from "../../../hooks/useAxiosPublic"; // Public axios instance for approved clubs
import useAxiosSecure from "../../../hooks/useAxiosSecure"; // Secure axios instance for user's joined clubs
import useAuth from "../../../hooks/useAuth"; // Custom hook to get the logged-in user

const AllClubs = () => {
  const axiosPublic = useAxiosPublic(); // Public axios instance for fetching approved clubs
  const axiosSecure = useAxiosSecure(); // Secure axios instance for fetching user's joined clubs
  const { user } = useAuth(); // Get logged-in user

  // 1. Fetch All Approved Clubs (public API request)
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["approvedClubs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/clubs/approved"); // Public route to fetch approved clubs
      return res.data;
    },
  });

  // 2. Fetch IDs of clubs the user already joined (secure API request for logged-in users)
  const { data: joinedClubIds = [], isLoading: membershipLoading } = useQuery({
    queryKey: ["myMembershipIds", user?.email],
    enabled: !!user?.email, // Only fetch if the user is logged in
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-memberships/${user.email}`);
      return res.data; // Array of club IDs the user has joined
    },
  });

  const joinedClubIdSet = new Set(joinedClubIds); // Using Set for fast lookup of joined clubs
  const isLoading = clubsLoading || (user && membershipLoading); // Combined loading state

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="mb-6">
        <h2 className="text-3xl font-extrabold text-base-content">
          Explore All Clubs
        </h2>
        <p className="text-sm text-base-content/60">
          Explore all approved clubs from ClubSphere.
        </p>
      </div>

      {/* Grid Layout for Clubs - 3 cards per row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club) => {
          const isJoined = joinedClubIdSet.has(club._id); // Check if the user has already joined this club

          return (
            <div
              key={club._id}
              className="card bg-base-100 shadow-xl border rounded-lg"
            >
              <figure>
                <img
                  src={club.bannerImage}
                  alt={club.clubName}
                  className="h-48 w-full object-cover rounded-t-lg"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{club.clubName}</h2>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {club.description || "No description available"}
                </p>

                <div className="card-actions justify-end mt-4">
                  {isJoined ? (
                    <div className="flex items-center gap-2">
                      <span className="badge badge-success gap-2 py-3 px-4 text-white">
                        Joined
                      </span>
                      <Link
                        to={`/club-details/${club._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        View
                      </Link>
                    </div>
                  ) : (
                    <Link
                      to={`/club-details/${club._id}`}
                      className="btn btn-primary btn-sm"
                    >
                      Details & Join
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fallback message if no clubs are found */}
      {clubs.length === 0 && (
        <div className="p-10 text-center text-gray-500">
          No approved clubs found.
        </div>
      )}
    </div>
  );
};

export default AllClubs;
