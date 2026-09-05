import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import UserDashboardPage from "./Pages/UserDashboardPage";
import AdminDashboard from "./Pages/AdminDashboard";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import Orders from "./Pages/Orders";

import ProtectedRoute from "./ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />


        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />


        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* USER DASHBOARD */}

        <Route
          path="/user-dashboard"
          element={
            <ProtectedRoute>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />


        {/* PRODUCTS */}

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />


        {/* CART */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />


        {/* MY ORDERS */}

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />


        {/* ADMIN DASHBOARD */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* UNKNOWN ROUTES */}

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