import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { Navigate, useLocation } from "react-router";

const PrivateRoutes = ({ children }) => {
  const location = useLocation();

  const { user, loading } = useAuth();
  if (!user) {
    return <Navigate to="/login" state={location.pathname} />;
  }
  if (loading) {
    return <Loading></Loading>;
  }

  return children;
};

export default PrivateRoutes;
