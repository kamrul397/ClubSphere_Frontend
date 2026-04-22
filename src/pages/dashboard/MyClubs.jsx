import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "./../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";

const MyClubs = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: myClubs = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["myClubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleDeleteClub = (clubId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/clubs/${clubId}`);
          if (res.data.deletedCount > 0) {
            // Refetch the data so the UI updates
            refetch();
            Swal.fire(
              "Deleted!",
              "Your club request has been removed.",
              "success",
            );
          }
        } catch (error) {
          Swal.fire("Error", "Could not delete the club.", "error");
        }
      }
    });
  };

  if (isLoading)
    return <div className="p-10 text-center text-2xl">Loading Clubs...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          My Requested Clubs: {myClubs.length}
        </h2>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-lg border border-base-300">
        <table className="table w-full">
          {/* Table Head */}
          <thead className="bg-primary text-primary-content">
            <tr>
              <th>#</th>
              <th>Banner</th>
              <th>Club Name</th>
              <th>Category</th>
              <th>Membership Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {myClubs.map((club, index) => (
              <tr key={club._id} className="hover:bg-base-200">
                <th>{index + 1}</th>
                <td>
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src={club.bannerImage} alt={club.clubName} />
                    </div>
                  </div>
                </td>
                <td className="font-bold">{club.clubName}</td>
                <td>
                  <span className="badge badge-ghost badge-sm">
                    {club.category}
                  </span>
                </td>
                <td>
                  {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                </td>
                <td>
                  <div
                    className={`badge font-semibold ${
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
                  <button className="btn btn-ghost btn-xs text-primary">
                    Details
                  </button>

                  <button
                    className="btn btn-ghost btn-xs text-primary"
                    onClick={() => handleDeleteClub(club._id)}
                  >
                    <FaTrashCan></FaTrashCan>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyClubs;
