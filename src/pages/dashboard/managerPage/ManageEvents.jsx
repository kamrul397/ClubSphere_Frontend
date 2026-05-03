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
  FaArrowLeft,
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
    queryKey: ["events-with-participants", clubId],
    queryFn: async () => {
      const eventsRes = await axiosSecure.get(`/events?clubId=${clubId}`);
      const eventList = eventsRes.data;

      const eventsWithParticipants = await Promise.all(
        eventList.map(async (event) => {
          const participantsRes = await axiosSecure.get(
            `/event-registrations/${event._id}`,
          );

          return {
            ...event,
            joinedCount: participantsRes.data?.length || 0,
          };
        }),
      );

      return eventsWithParticipants;
    },
    enabled: !!clubId,
  });

  return (
    <div className="h-full min-h-0 overflow-hidden bg-base-100 flex flex-col">
      {/* Header */}
      <div className="shrink-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 mb-3 border-b pb-3">
        <div>
          <h2 className="text-2xl font-extrabold text-base-content leading-tight">
            {club?.clubName || "Club"} Events
          </h2>

          <p className="text-sm opacity-60">
            Manage your activities and schedule
          </p>
        </div>

        <div className="flex gap-2">
          <Link
            to="/dashboard/my-clubs"
            className="btn btn-outline btn-sm min-h-0 h-9"
          >
            <FaArrowLeft size={13} />
            Back
          </Link>

          <Link
            to={`/dashboard/my-clubs/create-event/${clubId}`}
            className="btn btn-primary btn-sm min-h-0 h-9 gap-2"
          >
            <FaPlus />
            New Event
          </Link>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <span className="loading loading-ring loading-lg text-primary"></span>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && events.length === 0 && (
        <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl bg-base-200/30">
          <FaCalendarPlus size={42} className="opacity-20 mb-4" />

          <h3 className="text-xl font-bold">No events scheduled</h3>

          <p className="text-base-content/60 mb-6">
            Your club has not created any events yet.
          </p>

          <Link
            to={`/dashboard/my-clubs/create-event/${clubId}`}
            className="btn btn-primary"
          >
            Create First Event
          </Link>
        </div>
      )}

      {/* Events Table */}
      {!isLoading && events.length > 0 && (
        <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-base-200 shadow-sm">
          <div className="h-full overflow-x-auto overflow-y-auto">
            <table className="table table-xs table-zebra w-full text-xs [&_th]:py-2 [&_td]:py-2 [&_th]:px-3 [&_td]:px-3">
              <thead className="bg-base-200 sticky top-0 z-10">
                <tr className="whitespace-nowrap">
                  <th>Event Info</th>
                  <th>Description</th>
                  <th>Pricing & Capacity</th>
                  <th>Joined</th>
                  <th>Created At</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {events.map((event) => (
                  <tr key={event._id} className="hover whitespace-nowrap">
                    {/* Event Info */}
                    <td>
                      <div>
                        <h3 className="font-bold text-sm text-base-content">
                          {event.title}
                        </h3>

                        <div className="flex flex-col gap-1 text-[11px] opacity-70 mt-1">
                          <span className="flex items-center gap-1">
                            <FaCalendarDay className="text-primary" />
                            {event.eventDate
                              ? new Date(event.eventDate).toLocaleString()
                              : "N/A"}
                          </span>

                          <span className="flex items-center gap-1">
                            <FaLocationDot className="text-secondary" />
                            {event.location || "N/A"}
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
                          <span className="badge badge-success badge-xs text-white font-bold">
                            ${event.eventFee}
                          </span>
                        ) : (
                          <span className="badge badge-ghost badge-xs font-bold opacity-60">
                            FREE
                          </span>
                        )}

                        <span className="text-[10px] font-semibold flex items-center gap-1 opacity-70 uppercase">
                          <FaUsers />
                          {event.maxAttendees
                            ? `${event.maxAttendees} Slots`
                            : "Unlimited"}
                        </span>
                      </div>
                    </td>

                    {/* Joined Count */}
                    <td>
                      <Link
                        to={`/dashboard/my-clubs/event-participants/${event._id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-info/20 bg-info/10 px-3 py-2 text-info transition-all duration-300 hover:bg-info hover:text-white hover:shadow-md"
                      >
                        <FaUsers size={13} />
                        <div className="leading-none">
                          <p className="text-sm font-black">
                            {event.joinedCount}
                          </p>
                          <p className="text-[9px] font-bold uppercase">
                            Joined
                          </p>
                        </div>
                      </Link>
                    </td>

                    {/* Created Date */}
                    <td>
                      <div className="flex items-center gap-2 text-xs opacity-60">
                        <FaClock />
                        {event.createdAt
                          ? new Date(event.createdAt).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          to={`/dashboard/my-clubs/edit-event/${event._id}`}
                          className="btn btn-ghost btn-xs text-warning tooltip"
                          data-tip="Edit Event"
                        >
                          <FaPenToSquare size={15} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
