import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useEventStore from "../../../store/useEventStore";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaDollarSign,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const EventDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const selectedEvent = useEventStore((state) => state.selectedEvent);

  // 1. Fetch Event Details
  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${id}`);
      return res.data;
    },
    enabled: !selectedEvent && !!id,
  });

  // 2. Check if user is already registered
  const { data: registrationRecord, isLoading: isRegLoading } = useQuery({
    queryKey: ["checkRegistration", id, user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/event-registrations/check?email=${user?.email}&eventId=${id}`,
      );
      return res.data;
    },
    enabled: !!user?.email && !!id,
  });

  const finalEvent = selectedEvent || event;
  const isAlreadyJoined = !!registrationRecord;

  // --- Mutation for Free Registration ---
  const { mutateAsync: registerFree } = useMutation({
    mutationFn: async (registrationData) => {
      const res = await axiosSecure.post(
        "/event-registrations",
        registrationData,
      );
      return res.data;
    },
    onSuccess: () => {
      Swal.fire({
        title: "Registered!",
        text: "You have successfully joined this event.",
        icon: "success",
        confirmButtonColor: "#3085d6",
      });
      navigate("/dashboard/my-events");
    },
    onError: (error) => {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Registration failed",
        "error",
      );
    },
  });

  const handleFreeJoin = async () => {
    if (!user)
      return Swal.fire(
        "Please Login",
        "You must be logged in to join events",
        "warning",
      );

    const registrationInfo = {
      eventId: finalEvent._id,
      userEmail: user.email,
      userName: user.displayName,
      clubId: finalEvent.clubId,
      status: "registered",
      registeredAt: new Date(),
    };

    await registerFree(registrationInfo);
  };

  if ((isEventLoading || isRegLoading) && !finalEvent) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }

  // If even after loading there's no event, show error
  if (!finalEvent) {
    return <div className="text-center py-20 text-error">Event not found.</div>;
  }

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4 md:px-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300"
      >
        {/* Header Hero Section */}
        <div className="bg-primary p-8 md:p-12 text-primary-content relative overflow-hidden">
          <div className="relative z-10">
            <span className="badge badge-secondary mb-4 uppercase tracking-widest font-bold">
              Upcoming Event
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4">
              {finalEvent?.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-lg opacity-90">
              <span className="flex items-center gap-2">
                <FaCalendarAlt />{" "}
                {new Date(finalEvent?.eventDate).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-2">
                <FaClock />{" "}
                {new Date(finalEvent?.eventDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center gap-2">
                <FaMapMarkerAlt /> {finalEvent?.location}
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-base-300">
          {/* Main Content Area */}
          <div className="lg:col-span-2 p-8 md:p-12">
            <section className="mb-10">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaUsers className="text-primary" /> About this Event
              </h3>
              <p className="text-lg leading-relaxed text-base-content/80">
                {finalEvent?.description ||
                  "Join us for this exciting community gathering."}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card bg-base-200 p-6 rounded-2xl">
                <h4 className="font-bold text-sm text-base-content/50 uppercase mb-2">
                  Maximum Capacity
                </h4>
                <p className="text-xl font-bold">
                  {finalEvent?.maxAttendees
                    ? `${finalEvent.maxAttendees} People`
                    : "Unlimited Space"}
                </p>
              </div>
              <div className="card bg-base-200 p-6 rounded-2xl">
                <h4 className="font-bold text-sm text-base-content/50 uppercase mb-2">
                  Pricing Type
                </h4>
                <p className="text-xl font-bold">
                  {finalEvent?.isPaid ? "Paid Entry" : "Free Entry"}
                </p>
              </div>
            </div>
          </div>

          {/* Registration Sidebar */}
          <div className="p-8 md:p-12 bg-base-50 flex flex-col justify-between">
            <div>
              <div className="mb-8">
                <h4 className="text-sm font-bold text-base-content/50 uppercase mb-4 tracking-tighter">
                  Registration Fee
                </h4>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-primary">
                    {finalEvent?.isPaid ? `$${finalEvent.eventFee}` : "FREE"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {isAlreadyJoined ? (
                <div className="bg-info/10 p-4 rounded-2xl border border-info/20 text-center">
                  <div className="flex items-center justify-center gap-2 text-info font-bold mb-2">
                    <FaCheckCircle /> You have already joined!
                  </div>
                  <p className="text-sm opacity-70 mb-4">
                    Manage your events in the dashboard.
                  </p>
                  <Link
                    to="/dashboard/member-joined-events"
                    className="btn btn-info btn-outline btn-block rounded-2xl"
                  >
                    Manage My Events
                  </Link>
                </div>
              ) : (
                <>
                  {finalEvent?.isPaid ? (
                    <Link
                      to={`/dashboard/payment`}
                      state={{
                        amount: finalEvent.eventFee,
                        eventId: finalEvent._id,
                        clubId: finalEvent.clubId,
                        type: "event",
                      }}
                      className="btn btn-primary btn-lg w-full rounded-2xl text-lg font-bold shadow-xl"
                    >
                      <FaDollarSign /> Join Event Now
                    </Link>
                  ) : (
                    <button
                      className="btn btn-success btn-lg w-full rounded-2xl text-lg font-bold text-white shadow-xl hover:scale-[1.02] transition-transform"
                      onClick={handleFreeJoin}
                    >
                      Register for Free
                    </button>
                  )}
                </>
              )}

              <Link to="/all-events" className="btn btn-ghost btn-block">
                Back to Events
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EventDetails;
