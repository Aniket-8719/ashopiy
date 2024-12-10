import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the required role (e.g., admin)
  if (isAdmin && user.role !== isAdmin) {
    return <Navigate to="/" replace />;
  }

  // If authenticated and authorized, render the children (protected component)
  return children;
};

export default ProtectedRoute;
