import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import {
  FaTrashCan,
  FaPenToSquare,
  FaUsers,
  FaCalendarDays,
} from "react-icons/fa6";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import useClubStore from "../../store/useClubStore";

const MyClubs = () => {
  const setSelectedClub = useClubStore((state) => state.setSelectedClub);
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: myClubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myClubsWithStats", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs?email=${user?.email}`);
      const clubs = res.data;

      const clubsWithStats = await Promise.all(
        clubs.map(async (club) => {
          const [membersRes, eventsRes] = await Promise.all([
            axiosSecure.get(`/club-members/${club._id}`),
            axiosSecure.get(`/events?clubId=${club._id}`),
          ]);

          return {
            ...club,
            membersCount: membersRes.data?.length || 0,
            eventsCount: eventsRes.data?.length || 0,
          };
        }),
      );

      return clubsWithStats;
    },
    enabled: !!user?.email,
  });

  const handleDeleteClub = (clubId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This club request will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/clubs/${clubId}`);

          if (res.data.deletedCount > 0) {
            refetch();
            Swal.fire("Deleted!", "The club has been removed.", "success");
          }
        } catch (error) {
          console.error(error);
          Swal.fire("Error", "Could not delete the club.", "error");
        }
      }
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-base-100">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex flex-row justify-between items-center gap-3 mb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-base-content leading-tight">
            My Clubs
          </h2>

          <p className="text-sm text-base-content/60 leading-tight">
            You have requested {myClubs.length} clubs so far.
          </p>
        </div>

        <Link
          to="/dashboard/create-a-club"
          className="btn btn-primary btn-sm min-h-0 h-9 px-3 shadow-md"
        >
          + Create Club
        </Link>
      </div>

      {/* Table */}
      <div className="min-h-0 flex-1 overflow-hidden bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <div className="h-full overflow-x-auto overflow-y-auto">
          <table className="table table-xs table-zebra w-full text-xs [&_th]:py-2 [&_td]:py-2 [&_th]:px-3 [&_td]:px-3">
            <thead className="bg-base-200 text-base-content/70 sticky top-0 z-10">
              <tr className="whitespace-nowrap">
                <th className="rounded-tl-2xl">Club Info</th>
                <th>Category</th>
                <th>Fee</th>
                <th>Status</th>
                <th className="text-center rounded-tr-2xl">Actions</th>
              </tr>
            </thead>

            <tbody>
              {myClubs.map((club) => (
                <tr
                  key={club._id}
                  className="hover:bg-base-200 transition-colors whitespace-nowrap"
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="mask mask-squircle w-11 h-11 shadow-sm border border-base-300">
                          <img
                            src={club.bannerImage}
                            alt={club.clubName}
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="font-bold text-sm max-w-[180px] truncate">
                          {club.clubName}
                        </div>

                        <div className="text-[10px] opacity-50 uppercase tracking-tighter">
                          Created:{" "}
                          {club.createdAt
                            ? new Date(club.createdAt).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="badge badge-outline badge-xs px-2">
                      {club.category || "N/A"}
                    </span>
                  </td>

                  <td className="font-medium text-base-content">
                    {Number(club.membershipFee) > 0 ? (
                      <span className="text-success font-semibold">
                        ${club.membershipFee}
                      </span>
                    ) : (
                      <span className="badge badge-info badge-xs">Free</span>
                    )}
                  </td>

                  <td>
                    <div
                      className={`badge badge-xs font-bold uppercase min-h-0 h-5 px-2 ${
                        club.status === "pending"
                          ? "badge-warning"
                          : club.status === "approved"
                            ? "badge-success"
                            : "badge-error"
                      }`}
                    >
                      {club.status}
                    </div>
                  </td>

                  <td>
                    <div className="flex items-center justify-center gap-2">
                      {club.status === "approved" ? (
                        <>
                          <Link
                            to={`/dashboard/my-clubs/manage-club-members/${club._id}`}
                            onClick={() => setSelectedClub(club)}
                            className="group min-w-[82px] rounded-lg border border-secondary/20 bg-secondary/5 px-2 py-1 text-center transition-all duration-300 hover:bg-secondary hover:text-white hover:shadow-md"
                          >
                            <div className="flex items-center justify-center gap-1">
                              <FaUsers
                                size={13}
                                className="text-secondary group-hover:text-white"
                              />
                              <span className="text-sm font-black">
                                {club.membersCount}
                              </span>
                            </div>

                            <p className="text-[9px] font-bold uppercase tracking-wide opacity-70 leading-none">
                              {club.membersCount === 1 ? "Member" : "Members"}
                            </p>
                          </Link>

                          <Link
                            to={`/dashboard/my-clubs/manage-events/${club._id}`}
                            onClick={() => setSelectedClub(club)}
                            className="group min-w-[82px] rounded-lg border border-accent/20 bg-accent/5 px-2 py-1 text-center transition-all duration-300 hover:bg-accent hover:text-white hover:shadow-md"
                          >
                            <div className="flex items-center justify-center gap-1">
                              <FaCalendarDays
                                size={13}
                                className="text-accent group-hover:text-white"
                              />
                              <span className="text-sm font-black">
                                {club.eventsCount}
                              </span>
                            </div>

                            <p className="text-[9px] font-bold uppercase tracking-wide opacity-70 leading-none">
                              {club.eventsCount === 1 ? "Event" : "Events"}
                            </p>
                          </Link>

                          <Link
                            to={`/dashboard/edit-club/${club._id}`}
                            onClick={() => setSelectedClub(club)}
                            className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-warning tooltip"
                            data-tip="Edit Club"
                          >
                            <FaPenToSquare size={14} />
                          </Link>
                        </>
                      ) : (
                        <span className="text-xs italic opacity-40">
                          Awaiting Approval
                        </span>
                      )}

                      <div className="divider divider-horizontal mx-0"></div>

                      <button
                        type="button"
                        className="btn btn-ghost btn-xs min-h-0 h-7 px-2 text-error tooltip"
                        data-tip="Delete Club"
                        onClick={() => handleDeleteClub(club._id)}
                      >
                        <FaTrashCan size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {myClubs.length === 0 && (
            <div className="py-8 text-center text-sm opacity-50">
              <p>No clubs found. Start by creating one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyClubs;
