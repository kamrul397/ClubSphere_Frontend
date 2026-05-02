import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const RegisteredEvents = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: myEvents = [] } = useQuery({
    queryKey: ["myEvents", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-registered-events/${user?.email}`);
      return res.data;
    },
  });

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">My Registered Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myEvents.map((event) => (
          <div key={event._id} className="card bg-base-100 shadow-xl border">
            <div className="card-body">
              <h2 className="card-title">{event.title}</h2>
              <p>
                Status:{" "}
                <span className="badge badge-success">{event.status}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default RegisteredEvents;
