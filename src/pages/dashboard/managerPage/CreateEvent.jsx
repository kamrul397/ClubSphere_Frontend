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
  FaDollarSign,
  FaCircleInfo,
} from "react-icons/fa6";

const CreateEvent = () => {
  const { clubId, eventId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  // Identify Mode
  const isEditMode = !!eventId;

  // Use the store to get the club name for the heading[cite: 13]
  const club = useClubStore((state) => state.selectedClub);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isPaid: "false",
    },
  });

  // Watch isPaid to show/hide the fee field[cite: 13]
  const isPaidValue = watch("isPaid");

  // 1. Fetch event data if in Edit Mode[cite: 13]
  const { data: eventData, isLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/events/${eventId}`);
      return res.data;
    },
    enabled: isEditMode,
  });

  // 2. Pre-fill form when data arrives[cite: 13]
  useEffect(() => {
    if (isEditMode && eventData) {
      reset({
        ...eventData,
        isPaid: eventData.isPaid ? "true" : "false",
      });
    }
  }, [eventData, isEditMode, reset]);

  const onSubmit = async (data) => {
    try {
      const eventPayload = {
        clubId: isEditMode ? eventData.clubId : clubId, //[cite: 13]
        title: data.title,
        description: data.description,
        eventDate: data.eventDate,
        location: data.location,
        isPaid: data.isPaid === "true",
        eventFee: data.isPaid === "true" ? Number(data.eventFee) : 0,
        maxAttendees: data.maxAttendees ? Number(data.maxAttendees) : null,
        createdAt: isEditMode ? eventData.createdAt : new Date(), //[cite: 13]
        updatedAt: new Date(),
      };

      let res;
      if (isEditMode) {
        res = await axiosSecure.put(`/events/${eventId}`, eventPayload); //[cite: 13]
      } else {
        res = await axiosSecure.post("/events", eventPayload); //[cite: 13]
      }

      if (
        res.data.insertedId ||
        res.data.modifiedCount > 0 ||
        res.data.acknowledged
      ) {
        Swal.fire(
          "Success",
          `Event ${isEditMode ? "updated" : "created"} successfully`,
          "success",
        );
        const finalClubId = isEditMode ? eventData.clubId : clubId;
        navigate(`/dashboard/my-clubs/manage-events/${finalClubId}`); //[cite: 13]
      }
    } catch (error) {
      Swal.fire("Error", "Operation failed", "error");
    }
  };

  if (isEditMode && isLoading)
    return (
      <div className="text-center p-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="bg-base-100 shadow-2xl rounded-2xl border border-base-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-primary p-6 text-primary-content">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FaCalendarDay /> {isEditMode ? "Edit Event" : "Create New Event"}
          </h2>
          <p className="opacity-80 text-sm mt-1">
            {isEditMode
              ? `Adjusting details for ${eventData?.title}`
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
                className={`input input-bordered w-full ${errors.title ? "input-error" : ""}`}
                {...register("title", { required: "Title is required" })}
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
                className="textarea textarea-bordered h-24"
                {...register("description", {
                  required: "Description is required",
                })}
              />
            </div>

            {/* Date */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaCalendarDay className="text-primary" /> Event Date
              </label>
              <input
                type="datetime-local"
                className="input input-bordered"
                {...register("eventDate", { required: "Date is required" })}
              />
            </div>

            {/* Location */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaLocationDot className="text-primary" /> Location
              </label>
              <input
                type="text"
                placeholder="Venue name or Online link"
                className="input input-bordered"
                {...register("location", { required: "Location is required" })}
              />
            </div>

            {/* Max Attendees */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaUsers className="text-primary" /> Max Attendees (Optional)
              </label>
              <input
                type="number"
                placeholder="Leave blank for unlimited"
                className="input input-bordered"
                {...register("maxAttendees", { min: 1 })}
              />
            </div>

            {/* Paid Toggle */}
            <div className="form-control">
              <label className="label font-semibold flex items-center gap-2">
                <FaDollarSign className="text-primary" /> Access Type
              </label>
              <select
                className="select select-bordered"
                {...register("isPaid")}
              >
                <option value="false">Free Event</option>
                <option value="true">Paid Event</option>
              </select>
            </div>

            {/* Conditional Event Fee */}
            {isPaidValue === "true" && (
              <div className="form-control md:col-span-2 animate-fadeIn">
                <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
                  <label className="label font-bold text-warning-content">
                    Event Fee ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Enter registration amount"
                    className="input input-bordered w-full bg-base-100"
                    {...register("eventFee", {
                      required:
                        isPaidValue === "true"
                          ? "Fee is required for paid events"
                          : false,
                      min: { value: 1, message: "Fee must be at least $1" },
                    })}
                  />
                  {errors.eventFee && (
                    <span className="text-error text-xs mt-1">
                      {errors.eventFee.message}
                    </span>
                  )}
                </div>
              </div>
            )}
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
            <button type="submit" className="btn btn-primary flex-1">
              {isEditMode ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
