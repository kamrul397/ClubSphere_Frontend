import React from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

// Fix for default marker icons not showing in React-Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const Coverage = () => {
  const position = [23.685, 90.3563]; // Center of Bangladesh

  // Data for 8 Divisions
  const divisions = [
    { id: 1, name: "Dhaka", coords: [23.8103, 90.4125], clubs: 15 },
    { id: 2, name: "Chattogram", coords: [22.3569, 91.7832], clubs: 8 },
    { id: 3, name: "Rajshahi", coords: [24.3745, 88.6042], clubs: 5 },
    { id: 4, name: "Khulna", coords: [22.8456, 89.5403], clubs: 4 },
    { id: 5, name: "Barishal", coords: [22.701, 90.3535], clubs: 3 },
    { id: 6, name: "Sylhet", coords: [24.8949, 91.8687], clubs: 7 },
    { id: 7, name: "Rangpur", coords: [25.7439, 89.2752], clubs: 4 },
    { id: 8, name: "Mymensingh", coords: [24.7471, 90.4203], clubs: 2 },
  ];

  return (
    <section className="py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-neutral">Our Club Network</h2>
        <div className="w-20 h-1 bg-primary mx-auto mt-2"></div>
        <p className="text-gray-500 mt-4">
          Explore branches across all 8 divisions
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-base-200">
        <MapContainer
          center={position}
          zoom={7}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {divisions.map((div) => (
            <Marker key={div.id} position={div.coords}>
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg text-primary">{div.name}</h3>
                  <p className="text-sm font-medium">
                    {div.clubs} Active Clubs
                  </p>
                  <button className="btn btn-xs btn-outline btn-primary mt-2">
                    View Clubs
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </section>
  );
};

export default Coverage;
