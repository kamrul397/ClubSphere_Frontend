import React from "react";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";

const RegisteredEvents = () => {
  // Dummy Data for Preview
  const events = [
    {
      _id: 101,
      title: "Tech Meetup 2024",
      date: "Dec 15, 2024",
      location: "Auditorium A",
      status: "Upcoming",
    },
    {
      _id: 102,
      title: "Chess Tournament",
      date: "Jan 05, 2025",
      location: "Room 302",
      status: "Upcoming",
    },
    {
      _id: 103,
      title: "Winter Photo Walk",
      date: "Dec 20, 2024",
      location: "City Park",
      status: "Upcoming",
    },
  ];

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        My Registered Events
      </h2>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100">
        <table className="table w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-gray-600">Event Details</th>
              <th className="text-gray-600">Date & Time</th>
              <th className="text-gray-600">Location</th>
              <th className="text-gray-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event._id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td>
                  <div className="font-bold text-gray-800">{event.title}</div>
                  <div className="text-xs badge badge-outline mt-1">
                    {event.status}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="text-blue-500" /> {event.date}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-red-500" /> {event.location}
                  </div>
                </td>
                <td className="text-center">
                  <button className="btn btn-error btn-xs btn-outline">
                    Cancel
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

export default RegisteredEvents;
