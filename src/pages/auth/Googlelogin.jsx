import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";

import useAuth from "../../hooks/useAuth";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Googlelogin = () => {
  const { googleSignIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const axiosPublic = useAxiosPublic();

  const [googleLoading, setGoogleLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || location.state || "/";

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      const result = await googleSignIn();
      const user = result.user;

      const userInfo = {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL || "",
        lastLogin: new Date(),
      };

      try {
        await axiosPublic.post("/users", userInfo);
      } catch (dbError) {
        console.error("User save failed:", dbError?.response?.data || dbError);
      }

      Swal.fire({
        icon: "success",
        title: "Welcome!",
        text: "You have signed in successfully.",
        timer: 1300,
        showConfirmButton: false,
      });

      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error("Google auth failed:", error);

      Swal.fire({
        icon: "error",
        title: "Google Sign In Failed",
        text:
          error?.message || "Could not continue with Google. Please try again.",
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={googleLoading}
      className="btn w-full border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
    >
      {googleLoading ? (
        <>
          <span className="loading loading-spinner loading-sm"></span>
          Connecting...
        </>
      ) : (
        <>
          <FcGoogle size={22} />
          Continue with Google
        </>
      )}
    </button>
  );
};

export default Googlelogin;
