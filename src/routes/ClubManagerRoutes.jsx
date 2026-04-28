import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import useRole from "../hooks/useRole";

import NotAManager from "../components/NotAManager";

const ClubManagerRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  // 1. Handle Loading States
  if (loading || roleLoading) {
    return <Loading />;
  }

  // 2. Handle NOT Logged In (Guest)
  if (!user) {
    return <Forbidden message="Please log in to access this page." />;
  }
  console.log("role in manager page", role);
  // 3. Handle Logged In BUT Wrong Role (Member / Admin / etc.)
  // We trim() just in case there are hidden spaces in the database string
  if (user && role !== "clubManager") {
    return <NotAManager></NotAManager>;
  }

  // 4. Handle Correct Role (Club Manager)
  return children;
};

export default ClubManagerRoutes;
