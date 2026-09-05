import React from "react";

import {
  Navigate,
} from "react-router-dom";


function ProtectedRoute({

  children,

  adminOnly = false,

}) {


  const token =
    localStorage.getItem("token");


  const storedUser =
    localStorage.getItem("user");


  // ================================================
  // CHECK LOGIN TOKEN
  // ================================================

  if (!token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  // ================================================
  // GET USER DATA
  // ================================================

  let user = null;


  if (storedUser) {

    try {

      user =
        JSON.parse(storedUser);

    } catch (error) {

      console.error(
        "Invalid stored user data:",
        error
      );

      localStorage.removeItem("user");

    }

  }


  // ================================================
  // ADMIN ONLY ACCESS
  // ================================================

  if (adminOnly) {

    const role =
      String(
        user?.role || ""
      )
        .trim()
        .toLowerCase();


    if (role !== "admin") {

      return (
        <Navigate
          to="/user-dashboard"
          replace
        />
      );

    }

  }


  // ================================================
  // ALLOW ACCESS
  // ================================================

  return children;

}


export default ProtectedRoute;