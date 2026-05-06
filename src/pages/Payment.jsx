import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  FaCreditCard,
  FaDollarSign,
  FaReceipt,
  FaSearch,
  FaSyncAlt,
  FaUsers,
} from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";

const Payment = () => {
  const axiosSecure = useAxiosSecure();

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchText);
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  const limit = 10;

  // Debounce the search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchText);
    }, 500); // Adjust the delay here

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const {
    data = {},
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["adminPayments", debouncedSearch, status, type, page],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/payments", {
        params: {
          search: debouncedSearch,
          status,
          type,
          page,
          limit,
        },
      });

      return res.data;
    },
  });

  const payments = data?.payments || [];
  const totalPayments = data?.totalPayments || 0;
  const totalPages = data?.totalPages || 1;

  const summary = data?.summary || {
    totalAmount: 0,
    totalAmountInCents: 0,
    totalTransactions: 0,
  };

  const formatCurrency = (amount) => {
    const numberAmount = Number(amount || 0);

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(numberAmount);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(1);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchText("");
    setStatus("");
    setType("");
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border border-error/20 bg-error/10 p-6 text-center">
          <h2 className="text-xl font-black text-error">
            Failed to load payments
          </h2>
          <p className="mt-2 text-sm text-error/80">
            {error?.response?.data?.message || error?.message}
          </p>
          <button
            onClick={() => refetch()}
            className="btn btn-error btn-sm mt-4 text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-primary">
              Admin Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-black text-base-content md:text-4xl">
              All Payment Records
            </h1>
            <p className="mt-2 text-sm text-base-content/60">
              Track all membership payments, transaction IDs, payment status,
              members, and club revenue.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="btn btn-primary rounded-xl"
            disabled={isFetching}
          >
            <FaSyncAlt className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-primary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-base-content/60">
                Total Revenue
              </p>
              <h3 className="mt-2 text-3xl font-black text-primary">
                {formatCurrency(summary.totalAmount)}
              </h3>
            </div>
            <div className="rounded-2xl bg-primary/10 p-4 text-primary">
              <FaDollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-base-content/60">
                Total Payments
              </p>
              <h3 className="mt-2 text-3xl font-black text-secondary">
                {totalPayments}
              </h3>
            </div>
            <div className="rounded-2xl bg-secondary/10 p-4 text-secondary">
              <FaReceipt size={24} />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-accent/10 bg-base-100 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-base-content/60">
                Transactions
              </p>
              <h3 className="mt-2 text-3xl font-black text-accent">
                {summary.totalTransactions || totalPayments}
              </h3>
            </div>
            <div className="rounded-2xl bg-accent/10 p-4 text-accent">
              <FaCreditCard size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-base-300 bg-base-100 p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="input input-bordered flex items-center gap-2 rounded-xl">
            <FaSearch className="text-base-content/40" />
            <input
              type="text"
              value={searchText}
              onChange={handleSearchChange}
              className="grow"
              placeholder="Search user, email, club, transaction..."
            />
          </label>

          <select
            value={status}
            onChange={handleStatusChange}
            className="select select-bordered rounded-xl"
          >
            <option value="">All Status</option>
            <option value="succeeded">Succeeded</option>
            <option value="processing">Processing</option>
            <option value="requires_payment_method">
              Requires Payment Method
            </option>
            <option value="canceled">Canceled</option>
          </select>

          <select
            value={type}
            onChange={handleTypeChange}
            className="select select-bordered rounded-xl"
          >
            <option value="">All Types</option>
            <option value="membership">Membership</option>
            <option value="event">Event</option>
          </select>

          <button
            onClick={handleResetFilters}
            className="btn btn-outline rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-sm">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200 text-base-content">
              <tr>
                <th>#</th>
                <th>Member</th>
                <th>Club</th>
                <th>Amount</th>
                {/* <th>Type</th> */}
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((payment, index) => (
                  <tr key={payment._id} className="hover:bg-base-200/60">
                    <td className="font-bold">
                      {(page - 1) * limit + index + 1}
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <FaUsers />
                        </div>

                        <div>
                          <p className="font-bold">
                            {payment.userName || "Unknown User"}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {payment.userEmail || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td>
                      <p className="font-semibold">
                        {payment.clubName || "Unknown Club"}
                      </p>
                      <p className="max-w-[180px] truncate text-xs text-base-content/50">
                        {payment.clubId}
                      </p>
                    </td>

                    <td>
                      <span className="font-black text-primary">
                        {formatCurrency(payment.amount)}
                      </span>
                    </td>

                    {/* <td>
                      <span className="badge badge-outline capitalize">
                        {payment.type || "N/A"}
                      </span>
                    </td> */}

                    <td>
                      <p className="max-w-[190px] truncate rounded-lg bg-base-200 px-2 py-1 font-mono text-xs">
                        {payment.stripePaymentIntentId || "N/A"}
                      </p>
                    </td>

                    <td className="font-medium">
                      {formatDate(payment.createdAt)}
                    </td>

                    <td>
                      <span
                        className={`badge font-bold capitalize ${
                          payment.status === "succeeded"
                            ? "badge-success text-white text-sm"
                            : payment.status === "canceled"
                              ? "badge-error text-white"
                              : "badge-warning"
                        }`}
                      >
                        {payment.status || "Unknown"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="py-12 text-center">
                      <FaReceipt className="mx-auto text-4xl text-base-content/20" />
                      <h3 className="mt-3 text-lg font-black">
                        No payments found
                      </h3>
                      <p className="text-sm text-base-content/60">
                        Try changing your search or filter options.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-base-100 p-4 shadow-sm md:flex-row">
        <p className="text-sm font-semibold text-base-content/60">
          Showing page {page} of {totalPages}
        </p>

        <div className="join">
          <button
            className="btn join-item btn-sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <button className="btn join-item btn-sm btn-primary">{page}</button>

          <button
            className="btn join-item btn-sm"
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
