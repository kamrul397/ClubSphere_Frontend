import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { NavLink } from "react-router";
import { div } from "framer-motion/client";

const ManageClubMembers = () => {
  const { clubId } = useParams(); // Retrieves the ID from the URL
  const axiosSecure = useAxiosSecure();

  if (!clubId) {
    return (
      <div className="p-5 text-center">
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-error">No Club Selected</h2>
          <p>Please go to "My Clubs" and select a club to manage.</p>
        </div>
        <NavLink to="/dashboard/my-clubs" className="btn btn-primary mt-4">
          Go to My Clubs
        </NavLink>
      </div>
    );
  }

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["clubMembers", clubId],
    queryFn: async () => {
      // Calls your existing backend route
      const res = await axiosSecure.get(`/club-members/${clubId}`);
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="p-10 text-center">
        <span className="loading loading-spinner"></span>
      </div>
    );

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">
        Club Members: {members.length}
      </h2>

      <div className="overflow-x-auto shadow rounded-lg border border-base-300">
        <table className="table w-full">
          <thead>
            <tr className="bg-base-200">
              <th>#</th>
              <th>Member Name</th>
              <th>Email</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={member._id}>
                <td>{index + 1}</td>
                <td className="font-medium">{member.userName}</td>
                <td>{member.userEmail}</td>
                <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No members have joined this club yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClubMembers;
