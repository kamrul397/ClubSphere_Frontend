import React from "react";

const MyJoinedClubs = () => {
  // Dummy Data for Preview
  const joinedClubs = [
    {
      _id: 1,
      name: "Photography Club",
      category: "Art",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500",
    },
    {
      _id: 2,
      name: "Coding Warriors",
      category: "Tech",
      image:
        "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=500",
    },
    {
      _id: 3,
      name: "Chess Masters",
      category: "Gaming",
      image:
        "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?q=80&w=500",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Joined Clubs</h2>
        <button className="btn btn-primary btn-sm">Explore More</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {joinedClubs.map((club) => (
          <div
            key={club._id}
            className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <img src={club.image} alt="" className="h-40 w-full object-cover" />
            <div className="p-5">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                {club.category}
              </span>
              <h3 className="text-xl font-bold text-gray-800 mt-1">
                {club.name}
              </h3>
              <button className="btn btn-ghost btn-sm mt-4 text-red-500 hover:bg-red-50">
                Leave Club
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJoinedClubs;
