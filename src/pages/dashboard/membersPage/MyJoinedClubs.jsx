import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const MyJoinedClubs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: myClubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myJoinedClubs", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-joined-clubs/${user?.email}`);
      return res.data;
    },
  });

  const handleLeaveClub = async (clubId, clubName) => {
    Swal.fire({
      title: `Leave ${clubName}?`,
      text: "You will no longer be a member of this club.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, leave it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(
            `/leave-club?email=${user.email}&clubId=${clubId}`,
          );
          if (res.data.deletedCount > 0) {
            Swal.fire("Left!", `You have left ${clubName}.`, "success");
            refetch(); // Refresh the list immediately
          }
        } catch (error) {
          Swal.fire("Error", "Something went wrong.", "error");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-spinner"></span>
      </div>
    );

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">My Joined Clubs</h2>

      {myClubs.length === 0 ? (
        <div className="bg-base-100 p-10 rounded-xl shadow text-center">
          <p className="text-gray-500">You haven't joined any clubs yet.</p>
          <Link to="/clubs" className="btn btn-primary mt-4">
            Explore Clubs
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myClubs.map((club) => (
            <div
              key={club._id}
              className="flex flex-col md:flex-row items-center bg-base-100 border border-base-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Small Preview Image */}
              <div className="w-full md:w-48 h-32 md:h-full">
                <img
                  src={club.bannerImage}
                  alt={club.clubName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Club Content */}
              <div className="flex-1 p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <h3 className="font-bold text-lg text-neutral">
                    {club.clubName}
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
                    <span className="badge badge-outline badge-sm">
                      {club.category}
                    </span>
                    <span className="badge badge-success badge-xs text-white capitalize">
                      {club.membershipStatus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Joined: {new Date(club.joinedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link
                    to={`/club-details/${club._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    Visit
                  </Link>
                  <button
                    onClick={() => handleLeaveClub(club._id, club.clubName)}
                    className="btn btn-sm btn-outline btn-error"
                  >
                    Leave Club
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJoinedClubs;
