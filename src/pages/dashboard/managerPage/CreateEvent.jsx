import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useClubStore from "../../../store/useClubStore";
import Swal from "sweetalert2";
import { useEffect } from "react";
import {
  FaCalendarDay,
  FaLocationDot,
  FaUsers,
  FaCircleInfo,
} from "react-icons/fa6";

const CreateEvent = () => {
  const { clubId, eventId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const isEditMode = !!eventId;

  const club = useClubStore((state) => state.selectedClub);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const formatDateTimeLocal = (dateValue) => {
    if (!dateValue) return "";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "";

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);

    return localDate.toISOString().slice(0, 16);
  };

  const { data: eventData, isLoading } = useQuery({
    queryKey: ["event", eventId],
    enabled: isEditMode,
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${eventId}`);
      return res.data;
    },
  });

  useEffect(() => {
    if (isEditMode && eventData) {
      reset({
        title: eventData.title || "",
        description: eventData.description || "",
        eventDate: formatDateTimeLocal(eventData.eventDate),
        location: eventData.location || "",
        maxAttendees: eventData.maxAttendees || "",
      });
    }
  }, [eventData, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      const eventPayload = {
        clubId: isEditMode ? eventData.clubId : clubId,
        title: data.title.trim(),
        description: data.description.trim(),
        eventDate: data.eventDate,
        location: data.location.trim(),

        // All events are always free
        isPaid: false,
        eventFee: 0,

        maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : null,
        createdAt: isEditMode ? eventData.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      let res;

      if (isEditMode) {
        res = await axiosSecure.put(`/events/${eventId}`, eventPayload);
      } else {
        res = await axiosSecure.post("/events", eventPayload);
      }

      if (
        res.data.insertedId ||
        res.data.modifiedCount > 0 ||
        res.data.acknowledged
      ) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `Event ${isEditMode ? "updated" : "created"} successfully.`,
          timer: 1500,
          showConfirmButton: false,
        });

        const finalClubId = isEditMode ? eventData.clubId : clubId;
        navigate(`/dashboard/my-clubs/manage-events/${finalClubId}`);
      } else {
        Swal.fire({
          icon: "info",
          title: "No Changes",
          text: "No event changes were saved.",
        });
      }
    } catch (error) {
      console.error("Event operation failed:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.baseURL + error.config?.url,
      });

      Swal.fire({
        icon: "error",
        title: "Operation Failed",
        text:
          error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} event.`,
      });
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-base-100 shadow-2xl rounded-2xl border border-base-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary p-6 text-primary-content">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaCalendarDay />
            {isEditMode ? "Edit Event" : "Create New Event"}
          </h2>

          <p className="opacity-80 text-sm mt-1">
            {isEditMode
              ? `Adjusting details for ${eventData?.title || "this event"}`
              : `Scheduling an activity for ${club?.clubName || "your club"}`}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="form-control md:col-span-2">
              <label className="label font-semibold">Event Title</label>

              <input
                type="text"
                placeholder="e.g. Annual Photography Workshop"
                className={`input input-bordered w-full ${
                  errors.title ? "input-error" : ""
                }`}
                {...register("title", {
                  required: "Title is required",
                  minLength: {
                    value: 3,
                    message: "Title must be at least 3 characters",
                  },
                })}
              />

              {errors.title && (
                <span className="text-error text-xs mt-1">
                  {errors.title.message}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="form-control md:col-span-2">
              <label className="label font-semibold">Description</label>

              <textarea
                placeholder="What is this event about?"
                className={`textarea textarea-bordered h-24 ${
                  errors.description ? "textarea-error" : ""
                }`}
                {...register("description", {
                  required: "Description is required",
                  minLength: {
                    value: 10,
                    message: "Description must be at least 10 characters",
                  },
                })}
              />

              {errors.description && (
                <span className="text-error text-xs mt-1">
                  {errors.description.message}
                </span>
              )}
            </div>

            {/* Date */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaCalendarDay className="text-primary" />
                Event Date
              </label>

              <input
                type="datetime-local"
                className={`input input-bordered ${
                  errors.eventDate ? "input-error" : ""
                }`}
                {...register("eventDate", {
                  required: "Date is required",
                })}
              />

              {errors.eventDate && (
                <span className="text-error text-xs mt-1">
                  {errors.eventDate.message}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaLocationDot className="text-primary" />
                Location
              </label>

              <input
                type="text"
                placeholder="Venue name or online link"
                className={`input input-bordered ${
                  errors.location ? "input-error" : ""
                }`}
                {...register("location", {
                  required: "Location is required",
                })}
              />

              {errors.location && (
                <span className="text-error text-xs mt-1">
                  {errors.location.message}
                </span>
              )}
            </div>

            {/* Max Attendees */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaUsers className="text-primary" />
                Max Attendees
              </label>

              <input
                type="number"
                placeholder="Leave blank for unlimited"
                className={`input input-bordered ${
                  errors.maxAttendees ? "input-error" : ""
                }`}
                {...register("maxAttendees", {
                  min: {
                    value: 1,
                    message: "Max attendees must be at least 1",
                  },
                })}
              />

              {errors.maxAttendees && (
                <span className="text-error text-xs mt-1">
                  {errors.maxAttendees.message}
                </span>
              )}
            </div>

            {/* Free Event Info */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaCircleInfo className="text-primary" />
                Access Type
              </label>

              <div className="flex items-center justify-between rounded-xl border border-success/20 bg-success/10 px-4 py-3">
                <div>
                  <p className="font-bold text-success">Free Event</p>
                  <p className="text-xs text-base-content/60">
                    All events are free for members.
                  </p>
                </div>

                <span className="badge badge-success text-white">FREE</span>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary flex-1"
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : isEditMode ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
