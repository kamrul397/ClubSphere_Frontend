import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import useRole from "../hooks/useRole";
import Forbidden from "../components/Forbidden";

const AdminRoutes = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();

  if (loading || roleLoading) {
    return <Loading />;
  }

  // Note: I also noticed a logic check here.
  // If user is admin, you probably want to show children,
  // and if NOT admin, show the "You aren't admin" message.
  if (user && role === "admin") {
    return children; // <--- FIX: Return children directly, not { children }
  }

  return <Forbidden></Forbidden>;
};

export default AdminRoutes;
