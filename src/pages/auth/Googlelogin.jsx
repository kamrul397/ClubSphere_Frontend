import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Googlelogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then(async (result) => {
        const user = result.user;
        const userInfo = {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        };

        // Ensure user exists in DB
        await axiosSecure.post("/users", userInfo);
        navigate(location.state || "/");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {/* Social Login */}
      <button
        className="btn btn-outline btn-neutral w-full flex items-center gap-3 hover:bg-gray-50"
        onClick={handleGoogleSignIn}
      >
        <FcGoogle className="text-2xl" />
        Continue with Google
      </button>
    </div>
  );
};

export default Googlelogin;
