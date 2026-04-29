import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth"; // Assuming you have a useAuth hook
import Swal from "sweetalert2";

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth(); // Get current logged-in user

  const { data: club = {}, isLoading } = useQuery({
    queryKey: ["club", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${id}`);
      return res.data;
    },
  });

  // Inside ClubDetails component
  const { data: membershipData, refetch: refetchMembership } = useQuery({
    queryKey: ["membershipStatus", id, user?.email],
    enabled: !!user?.email && !!id, // Only run if user and id exist
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/membership-check?email=${user.email}&clubId=${id}`,
      );
      return res.data;
    },
  });

  const isAlreadyMember = membershipData?.isMember;

  const handleJoinClub = async () => {
    if (!user) {
      return Swal.fire(
        "Please Login",
        "You must be logged in to join a club",
        "warning",
      );
    }

    const joinData = {
      clubId: club._id,
      clubName: club.clubName,
      userEmail: user.email,
      userName: user.displayName,
      fee: club.membershipFee,
      joinedDate: new Date(),
      status: club.membershipFee > 0 ? "pending_payment" : "active",
    };

    if (club.membershipFee === 0 || !club.membershipFee) {
      // Free Club Logic
      try {
        const res = await axiosSecure.post("/club-members", joinData);
        if (res.data.insertedId) {
          refetchMembership(); // Refresh membership status
          Swal.fire({
            icon: "success",
            title: "Joined Successfully!",
            text: `You are now a member of ${club.clubName}`,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } catch (error) {
        Swal.fire("Error", "Could not join the club. Try again.", "error");
      }
    } else {
      // Paid Club Logic (Redirect to Payment)
      Swal.fire(
        "Payment Required",
        `Redirecting to pay $${club.membershipFee}...`,
        "info",
      );
      // navigate('/payment', { state: { club } }); // Future step
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );

  return (
    <div className="min-h-screen bg-base-200 p-2 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-base-100 shadow-xl rounded-2xl overflow-hidden border border-base-300">
          <div className="relative">
            <img
              src={club.bannerImage}
              className="w-full h-56 md:h-72 object-cover"
              alt="Banner"
            />
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 btn btn-circle btn-sm bg-black/30 hover:bg-black/50 border-none text-white backdrop-blur-md shadow-lg"
            >
              <FaArrowLeft />
            </button>
          </div>

          <div className="p-5 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral">
                  {club.clubName}
                </h1>
                <div className="flex gap-2 mt-2">
                  <span className="badge badge-secondary badge-sm font-medium">
                    {club.category}
                  </span>
                  <span className="badge badge-outline badge-sm">
                    {club.location}
                  </span>
                </div>
              </div>

              {/* Desktop Join Button */}
              <div className="hidden md:block">
                <button
                  onClick={handleJoinClub}
                  disabled={isAlreadyMember}
                  className={`btn ${isAlreadyMember ? "btn-disabled" : "btn-primary"} px-8`}
                >
                  {isAlreadyMember
                    ? "Already a Member"
                    : club.membershipFee > 0
                      ? "Pay & Join"
                      : "Join Free"}
                </button>
              </div>
            </div>

            <div className="divider my-4"></div>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base italic">
              {club.description || "No description provided for this club."}
            </p>

            <div className="mt-8 p-4 bg-base-200 rounded-2xl flex justify-between items-center">
              <div>
                <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">
                  Membership Fee
                </p>
                <p className="text-2xl font-black text-primary">
                  {club.membershipFee > 0 ? `$${club.membershipFee}` : "Free"}
                </p>
              </div>

              {/* Mobile Join Button */}
              <button
                onClick={handleJoinClub}
                className="btn btn-primary md:hidden"
              >
                Join
              </button>

              <div className="hidden md:block text-right">
                <p className="text-[10px] opacity-60 uppercase font-black tracking-widest">
                  Contact
                </p>
                <p className="text-sm font-medium">{club.managerEmail}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;
