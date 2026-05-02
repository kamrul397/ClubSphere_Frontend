import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useClubStore from "../../../store/useClubStore";
import {
  FaPlus,
  FaCalendarPlus,
  FaPenToSquare,
  FaLocationDot,
  FaCalendarDay,
  FaClock,
  FaUsers,
  FaCircleInfo,
} from "react-icons/fa6";

const ManageEvents = () => {
  const { clubId } = useParams();
  const axiosSecure = useAxiosSecure();
  const clubFromStore = useClubStore((state) => state.selectedClub);

  const { data: clubFromAPI } = useQuery({
    queryKey: ["club", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${clubId}`);
      return res.data;
    },
    enabled: !clubFromStore && !!clubId,
  });

  const club = clubFromStore || clubFromAPI;

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", clubId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events?clubId=${clubId}`);
      return res.data;
    },
    enabled: !!clubId,
  });

  return (
    <div className="p-4 md:p-8 bg-base-100 min-h-screen">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h2 className="text-3xl font-extrabold">
            {club?.clubName || "Club"} Events
          </h2>
          <p className="text-sm opacity-60">
            Manage your activities and schedule
          </p>
        </div>
        <Link
          to={`/dashboard/my-clubs/create-event/${clubId}`}
          className="btn btn-primary btn-sm gap-2"
        >
          <FaPlus /> New Event
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      )}

      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-2xl bg-base-200/30">
          <FaCalendarPlus size={48} className="opacity-20 mb-4" />
          <h3 className="text-xl font-bold">No events scheduled</h3>
          <p className="text-base-content/60 mb-6">
            Your club hasn't created any events yet.
          </p>
          <Link
            to={`/dashboard/my-clubs/create-event/${clubId}`}
            className="btn btn-primary"
          >
            Create First Event
          </Link>
        </div>
      )}

      {!isLoading && events.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-base-200 shadow-sm">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200">
              <tr>
                <th>Event Info</th>
                <th>Description</th>
                <th>Pricing & Capacity</th>
                <th>Created At</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="hover">
                  {/* Title, Date, and Location */}
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-md text-primary">
                        {event.title}
                      </span>
                      <div className="flex flex-col text-[11px] opacity-70 italic">
                        <span className="flex items-center gap-1">
                          <FaCalendarDay className="text-secondary" />
                          {new Date(event.eventDate).toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaLocationDot className="text-secondary" />{" "}
                          {event.location}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="max-w-xs">
                    <p
                      className="text-xs line-clamp-2 opacity-80"
                      title={event.description}
                    >
                      {event.description || "N/A"}
                    </p>
                  </td>

                  {/* Paid Status, Fee, and Max Attendees */}
                  <td>
                    <div className="flex flex-col gap-1">
                      {event.isPaid ? (
                        <span className="badge badge-success badge-sm text-white font-bold">
                          ${event.eventFee}
                        </span>
                      ) : (
                        <span className="badge badge-ghost badge-sm font-bold opacity-60">
                          FREE
                        </span>
                      )}
                      <span className="text-[10px] font-semibold flex items-center gap-1 opacity-70 uppercase">
                        <FaUsers />{" "}
                        {event.maxAttendees
                          ? `${event.maxAttendees} Slots`
                          : "Unlimited"}
                      </span>
                    </div>
                  </td>

                  {/* Created Date[cite: 15] */}
                  <td>
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <FaClock />
                      {new Date(event.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="text-center">
                    <Link
                      to={`/dashboard/my-clubs/edit-event/${event._id}`}
                      className="btn btn-ghost btn-sm text-warning tooltip"
                      data-tip="Edit Event"
                    >
                      <FaPenToSquare size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
