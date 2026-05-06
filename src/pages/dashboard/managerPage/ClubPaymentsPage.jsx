import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion"; // For animations

import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ClubPaymentsPage = () => {
  const { clubId } = useParams(); // Get clubId from the URL
  const axiosSecure = useAxiosSecure();
  const { role, isLoading: isRoleLoading } = useRole(); // Custom hook to get user role
  const navigate = useNavigate();

  // Fetch club name using TanStack Query (React Query)
  const {
    data: clubData,
    error: clubError,
    isLoading: isClubLoading,
  } = useQuery({
    queryKey: ["club", clubId], // Fetch club data
    queryFn: async () => {
      const response = await axiosSecure.get(`/clubs/${clubId}`);
      return response.data; // Assuming the response contains club info
    },
    enabled: !!clubId, // Only fetch if clubId is available
  });

  // Fetch club payments using TanStack Query (React Query)
  const { data, error, isLoading } = useQuery({
    queryKey: ["clubPayments", clubId], // Update queryKey to use object format
    queryFn: async () => {
      const response = await axiosSecure.get(`/club-payments/${clubId}`);
      return response.data.payments;
    },
    enabled: !!clubId && !isRoleLoading && role === "clubManager", // Only fetch if user is a club manager
  });

  // Handle loading, error, and data states
  if (isLoading || isRoleLoading || isClubLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="loading loading-spinner text-primary text-3xl"></span>
      </div>
    );
  }

  if (clubError) {
    return <div>Error fetching club data: {clubError.message}</div>;
  }

  if (error) {
    return <div>Error fetching payments: {error.message}</div>;
  }

  if (data?.length === 0) {
    return <p>No payments have been made for this club yet.</p>;
  }

  // Total Amount Calculation (for statistics)
  const totalAmount = (
    data.reduce((acc, payment) => acc + payment.amountInCents, 0) / 100
  ).toFixed(2);

  return (
    <div className="p-6 space-y-6">
      {/* Club Header */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">
          Payments for Club:{" "}
          <span className="text-blue-500">
            {clubData?.clubName || "Loading..."}
          </span>
        </h2>

        {/* Club Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card w-full bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Total Members</h3>
              <p className="text-2xl">{data.length}</p>
            </div>
          </div>
          <div className="card w-full bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">Total Payments</h3>
              <p className="text-2xl">${totalAmount}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate(-1)} // Navigate back to previous page
          className="btn btn-outline btn-sm"
        >
          Back
        </button>
      </div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <table className="table table-zebra w-full mt-4">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
              <th>Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {data.map((payment) => (
              <motion.tr
                key={payment._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <td>{payment.userName}</td>
                <td>{payment.userEmail}</td>
                <td>${(payment.amountInCents / 100).toFixed(2)}</td>
                <td>
                  <span
                    className={`badge ${
                      payment.status === "succeeded"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {payment.status === "succeeded" ? "Paid" : "Pending"}
                  </span>
                </td>
                <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td>{payment.stripePaymentIntentId}</td>{" "}
                {/* Display Transaction ID */}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
};

export default ClubPaymentsPage;
