import { useQuery } from "@tanstack/react-query";

import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useEventStore from "../../../store/useEventStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

const MemberJoinedEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const setSelectedEvent = useEventStore((s) => s.setSelectedEvent);

  const queryClient = useQueryClient();

  const leaveMutation = useMutation({
    mutationFn: async (eventId) => {
      const res = await axiosSecure.delete(
        `/event-registrations?email=${user.email}&eventId=${eventId}`,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-registered-events"]);
      Swal.fire("Left!", "You have left the event", "success");
    },
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["my-registered-events", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-registered-events/${user.email}`);
      return res.data;
    },
  });
  const handleLeave = (eventId) => {
    Swal.fire({
      title: "Leave this event?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, leave",
    }).then((result) => {
      if (result.isConfirmed) {
        leaveMutation.mutate(eventId);
      }
    });
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Events</h2>

      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event._id} className="card p-4 shadow">
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p>{event.location}</p>

              <div className="flex gap-2 mt-3">
                {/* VIEW */}
                <Link
                  to={`/events/${event._id}`}
                  onClick={() => setSelectedEvent(event)}
                  className="btn btn-primary btn-sm"
                >
                  View
                </Link>

                {/* LEAVE BUTTON */}
                <button
                  onClick={() => handleLeave(event._id)}
                  className="btn btn-warning btn-sm"
                >
                  Leave Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MemberJoinedEvents;
