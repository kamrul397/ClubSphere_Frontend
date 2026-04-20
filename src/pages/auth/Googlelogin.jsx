import React from "react";
import { FcGoogle } from "react-icons/fc";
import useAuth from "../../hooks/useAuth";

const Googlelogin = () => {
  const { googleSignIn } = useAuth();

  const handleGoogleSignIn = () => {
    googleSignIn()
      .then((result) => {
        // Handle successful sign-in
        console.log("Google Sign-In successful:", result.user);
      })
      .catch((error) => {
        // Handle sign-in error
        console.error("Google Sign-In error:", error);
      });
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
