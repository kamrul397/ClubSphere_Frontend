import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";

const AllClubs = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // 1. Fetch All Approved Clubs
  const { data: clubs = [], isLoading: clubsLoading } = useQuery({
    queryKey: ["approvedClubs"],
    queryFn: async () => {
      const res = await axiosSecure.get("/clubs/approved");
      return res.data;
    },
  });

  // 2. Fetch IDs of clubs the user already joined
  const { data: joinedClubIds = [], isLoading: membershipLoading } = useQuery({
    queryKey: ["myMembershipIds", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-memberships/${user?.email}`);
      return res.data; // Array of IDs
    },
  });

  const isLoading = clubsLoading || (user && membershipLoading);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-10">
        Explore All Clubs
      </h2>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => {
            const isJoined = joinedClubIds.includes(club._id);

            return (
              <div key={club._id} className="card bg-base-100 shadow-xl border">
                <figure>
                  <img
                    src={club.bannerImage}
                    alt={club.clubName}
                    className="h-48 w-full object-cover"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{club.clubName}</h2>
                  <p className="text-sm line-clamp-2">{club.description}</p>

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
      )}
    </div>
  );
};

export default AllClubs;
