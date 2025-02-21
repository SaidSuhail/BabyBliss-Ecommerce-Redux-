import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("role");
  const isBlocked = localStorage.getItem("isBlocked");

  if (isLoggedIn) {
    if (isBlocked === "true") {
      alert("Your account has been blocked.");
      return <Navigate to="/login" replace />;
    } else if (userRole === "admin") {
      return <Component {...rest} />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  // If not logged in, redirect to login
  return <Navigate to="/login" replace />;
};

export default ProtectedRoute;
