import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ================================================
// PAGES
// ================================================
import Checkout from "./Pages/Checkout";
import Register from "./Pages/Register";
import Login from "./Pages/Login";

import UserDashboardPage from "./Pages/UserDashboardPage";

import AdminDashboard from "./Pages/AdminDashboard";

import Products from "./Pages/Products";

import Cart from "./Pages/Cart";

import Orders from "./Pages/Orders";
import OrderConfirmation from "./Pages/OrderConfirmation";

// ================================================
// ADMIN PAGES
// ================================================

import AdminOrders from "./Pages/AdminOrders";

// ================================================
// PROTECTED ROUTE
// ================================================

import ProtectedRoute from "./ProtectedRoute";


// ================================================
// APP
// ================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>
        {/* ================================================ */}
{/* ORDER CONFIRMATION */}
{/* ================================================ */}

<Route
  path="/order-confirmation"
  element={
    <ProtectedRoute>

      <OrderConfirmation />

    </ProtectedRoute>
  }
/>
        {/* ================================================ */}
{/* CHECKOUT */}
{/* ================================================ */}

<Route
  path="/checkout"
  element={

    <ProtectedRoute>

      <Checkout />

    </ProtectedRoute>

  }
/>

        {/* ================================================ */}
        {/* HOME */}
        {/* ================================================ */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* ================================================ */}
        {/* REGISTER */}
        {/* ================================================ */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* ================================================ */}
        {/* LOGIN */}
        {/* ================================================ */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* ================================================ */}
        {/* USER DASHBOARD */}
        {/* ================================================ */}

        <Route
          path="/user-dashboard"
          element={

            <ProtectedRoute>

              <UserDashboardPage />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* PRODUCTS - ALL LOGGED IN USERS CAN VIEW */}
        {/* ================================================ */}

        <Route
          path="/products"
          element={

            <ProtectedRoute>

              <Products />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* ADMIN MANAGE PRODUCTS */}
        {/* ONLY ADMIN CAN ACCESS */}
        {/* ================================================ */}

        <Route
          path="/manage-products"
          element={

            <ProtectedRoute adminOnly={true}>

              <Products />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* ADMIN PRODUCTS ALIAS */}
        {/* ================================================ */}

        <Route
          path="/admin-products"
          element={

            <ProtectedRoute adminOnly={true}>

              <Products />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* CART */}
        {/* ================================================ */}

        <Route
          path="/cart"
          element={

            <ProtectedRoute>

              <Cart />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* USER MY ORDERS */}
        {/* ================================================ */}

        <Route
          path="/orders"
          element={

            <ProtectedRoute>

              <Orders />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* ADMIN DASHBOARD */}
        {/* ================================================ */}

        <Route
          path="/admin-dashboard"
          element={

            <ProtectedRoute adminOnly={true}>

              <AdminDashboard />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* ADMIN ORDERS */}
        {/* ONLY ADMIN CAN ACCESS */}
        {/* ================================================ */}

        <Route
          path="/admin-orders"
          element={

            <ProtectedRoute adminOnly={true}>

              <AdminOrders />

            </ProtectedRoute>

          }
        />


        {/* ================================================ */}
        {/* UNKNOWN ROUTES */}
        {/* ================================================ */}

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