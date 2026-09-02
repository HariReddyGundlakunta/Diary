import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import AdminDashboard from "./Pages/AdminDashboard";



// ======================================================
// ADMIN ROUTE
// ======================================================

function AdminRoute({ children }) {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    !user ||
    user.role?.toLowerCase() !== "admin"
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}


// ======================================================
// APP
// ======================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ==========================================
            HOME
        ========================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ==========================================
            REGISTER
        ========================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ==========================================
            LOGIN
        ========================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* ==========================================
            USER DASHBOARD
        ========================================== 
        */}



        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* ==========================================
            UNKNOWN ROUTE
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;