import React from "react";
import { FaUsers, FaCalendarCheck, FaAward } from "react-icons/fa";

const MemberOverview = () => {
  // Dummy Data for Preview
  const stats = { joinedClubs: 4, registeredEvents: 7, points: 120 };

  return (
    <div className="p-8 animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-3xl text-white mb-8 shadow-lg">
        <h2 className="text-3xl font-bold">Welcome Back, Member!</h2>
        <p className="mt-2 opacity-90">
          Here is what's happening with your clubs and events today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <FaUsers size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Joined Clubs</p>
            <h3 className="text-2xl font-bold">{stats.joinedClubs}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-xl">
            <FaCalendarCheck size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Events Registrations</p>
            <h3 className="text-2xl font-bold">{stats.registeredEvents}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-orange-100 text-orange-600 rounded-xl">
            <FaAward size={24} />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Club Points</p>
            <h3 className="text-2xl font-bold">{stats.points}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberOverview;
