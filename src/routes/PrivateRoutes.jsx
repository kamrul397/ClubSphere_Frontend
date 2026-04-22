import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../components/Loading";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoutes = ({ children }) => {
  const location = useLocation();

  const { user, loading } = useAuth();
  if (loading) {
    return <Loading></Loading>;
  }
  if (!user) {
    return <Navigate to="/login" state={location.pathname} />;
  }

  return children;
};

export default PrivateRoutes;
