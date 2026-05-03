import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // 1. Get event details
  const { data: event = {}, isLoading: eventLoading } = useQuery({
    queryKey: ["eventDetails", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 2. Get club details using event.clubId
  const { data: club = {}, isLoading: clubLoading } = useQuery({
    queryKey: ["eventClub", event?.clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${event.clubId}`);
      return res.data;
    },
    enabled: !!event?.clubId,
  });

  // 3. Check if user is a member of this event's club
  const { data: membershipData = {}, isLoading: membershipLoading } = useQuery({
    queryKey: ["membership-check", user?.email, event?.clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/membership-check?email=${user.email}&clubId=${event.clubId}`,
      );
      return res.data;
    },
    enabled: !!user?.email && !!event?.clubId,
  });

  // 4. Check if user already registered for this event
  const { data: registeredEvent = null, isLoading: registerCheckLoading } =
    useQuery({
      queryKey: ["event-registration-check", user?.email, id],
      queryFn: async () => {
        const res = await axiosSecure.get(
          `/event-registrations/check?email=${user.email}&eventId=${id}`,
        );
        return res.data;
      },
      enabled: !!user?.email && !!id,
    });

  const registerMutation = useMutation({
    mutationFn: async () => {
      const registrationInfo = {
        eventId: event._id,
        eventTitle: event.title,
        clubId: event.clubId,
        clubName: club.clubName || event.clubName || "Unknown Club",
        userEmail: user.email,
        userName: user.displayName || "Unknown User",
        status: "registered",
        registeredAt: new Date().toISOString(),
      };

      const res = await axiosSecure.post(
        "/event-registrations",
        registrationInfo,
      );

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["event-registration-check", user?.email, id],
      });

      Swal.fire("Success!", "You registered for this event.", "success");
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error?.response?.data?.message || "Could not register for this event.",
        "error",
      );
    },
  });

  const handleRegisterEvent = () => {
    registerMutation.mutate();
  };

  if (
    eventLoading ||
    clubLoading ||
    membershipLoading ||
    registerCheckLoading
  ) {
    return (
      <div className="p-10 text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const isMember = membershipData?.isMember;
  const isAlreadyRegistered = !!registeredEvent;

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-base-200 p-6 md:p-8">
        <h2 className="text-3xl font-extrabold text-base-content mb-3">
          {event.title}
        </h2>

        <p className="text-base-content/70 mb-6">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-base-200">
            <p className="text-xs uppercase opacity-60">Location</p>
            <p className="font-semibold">{event.location || "N/A"}</p>
          </div>

          <div className="p-4 rounded-xl bg-base-200">
            <p className="text-xs uppercase opacity-60">Date</p>
            <p className="font-semibold">
              {event.eventDate
                ? new Date(event.eventDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-base-200">
            <p className="text-xs uppercase opacity-60">Fee</p>
            <p className="font-semibold">
              {event.isPaid ? `$${event.eventFee || 0}` : "Free"}
            </p>
          </div>

          <Link
            to={`/club-details/${event.clubId}`}
            className="group relative block overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary via-secondary to-accent p-[1px] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="relative h-full rounded-2xl bg-base-100/90 p-4 backdrop-blur-sm transition-all duration-300 group-hover:bg-base-100/20">
              <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/30 blur-2xl transition-all duration-300 group-hover:bg-white/30"></div>

              <p className="relative text-xs font-extrabold uppercase tracking-[0.25em] text-primary group-hover:text-white/80">
                Club
              </p>

              <p className="relative mt-2 text-lg font-black text-base-content group-hover:text-white">
                {club.clubName || event.clubName || "View Club Details"}
              </p>

              <p className="relative mt-1 text-xs font-medium text-base-content/60 group-hover:text-white/75">
                Tap to explore this club
              </p>
            </div>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {!isMember && (
            <Link
              to={`/club-details/${event.clubId}`}
              className="btn btn-warning"
            >
              Join Club First
            </Link>
          )}

          {isMember && !isAlreadyRegistered && (
            <button
              onClick={handleRegisterEvent}
              disabled={registerMutation.isPending}
              className="btn btn-primary"
            >
              {registerMutation.isPending ? "Registering..." : "Register Event"}
            </button>
          )}

          {isMember && isAlreadyRegistered && (
            <Link
              to="/dashboard/member-joined-events"
              className="btn btn-success"
            >
              Already Joined - Go to My Events
            </Link>
          )}

          <Link to="/all-events" className="btn btn-outline">
            Back to All Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
