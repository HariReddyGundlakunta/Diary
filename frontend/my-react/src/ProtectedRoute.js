import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const token =
    localStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user");

  if (!token || !storedUser) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const role = String(
    user?.role || "user"
  )
    .trim()
    .toLowerCase();

  // Admin dashboard is ONLY for admins
  if (
    adminOnly &&
    role !== "admin"
  ) {
    return (
      <Navigate
        to="/user-dashboard"
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;