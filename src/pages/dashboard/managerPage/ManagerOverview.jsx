import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FaLayerGroup, FaClock, FaArrowRight, FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManagerOverview = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch only clubs managed by the current user
  const { data: myClubs = [], isLoading } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  // Derived Club Data
  const approvedClubs = myClubs.filter((club) => club.status === "approved");
  const pendingClubs = myClubs.filter((club) => club.status === "pending");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 space-y-8 bg-base-100 min-h-screen">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-base-content">
            Manager Overview
          </h1>
          <p className="text-base-content/60">
            Manage your club applications and active communities.
          </p>
        </div>
        <Link to="/dashboard/create-a-club" className="btn btn-primary gap-2">
          <FaPlus /> Register New Club
        </Link>
      </div>

      {/* Club Stats Section[cite: 16] */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stats shadow border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaLayerGroup size={24} />
            </div>
            <div className="stat-title font-semibold">Total Requests</div>
            <div className="stat-value text-primary">{myClubs.length}</div>
          </div>
        </div>

        <div className="stats shadow border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <FaClock size={24} />
            </div>
            <div className="stat-title font-semibold">Approved Clubs</div>
            <div className="stat-value text-success">
              {approvedClubs.length}
            </div>
          </div>
        </div>

        <div className="stats shadow border border-base-200">
          <div className="stat">
            <div className="stat-figure text-warning">
              <FaClock size={24} />
            </div>
            <div className="stat-title font-semibold">Pending Approval</div>
            <div className="stat-value text-warning">{pendingClubs.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Club Activities[cite: 19] */}
        <div className="bg-base-200/50 rounded-2xl p-6 border border-base-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Your Clubs</h3>
            <Link
              to="/dashboard/my-clubs"
              className="btn btn-ghost btn-sm text-primary"
            >
              Manage All <FaArrowRight />
            </Link>
          </div>

          <div className="space-y-4">
            {myClubs.slice(0, 5).map((club) => (
              <div
                key={club._id}
                className="flex items-center justify-between p-4 bg-base-100 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-lg">
                      <img src={club.bannerImage} alt={club.clubName} />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{club.clubName}</h4>
                    <p className="text-xs opacity-60 italic">{club.category}</p>
                  </div>
                </div>
                <div
                  className={`badge badge-sm font-bold ${
                    club.status === "approved"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {club.status}
                </div>
              </div>
            ))}
            {myClubs.length === 0 && (
              <p className="text-center py-10 opacity-50">
                No clubs registered yet.
              </p>
            )}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-base-200">
          <h3 className="text-xl font-bold mb-6">Club Categories</h3>
          <div className="space-y-4">
            {["Photography", "Sports", "Tech", "Book Club"].map((cat) => {
              const count = myClubs.filter((c) => c.category === cat).length;
              return (
                <div key={cat} className="flex flex-col gap-1">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{cat}</span>
                    <span>{count}</span>
                  </div>
                  <progress
                    className="progress progress-primary w-full"
                    value={count}
                    max={myClubs.length || 1}
                  ></progress>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerOverview;
