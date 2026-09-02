import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==================================================
// PAGES
// ==================================================

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderConfirmation from "./Pages/OrderConfirmation";

import AdminDashboard from "./Pages/AdminDashboard";
import AddProduct from "./Pages/AddProduct";

// ==================================================
// APP
// ==================================================

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ==========================================
            DEFAULT PAGE
        ========================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />

        {/* ==========================================
            AUTH
        ========================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* ==========================================
            USER HOME
        ========================================== */}

        <Route
          path="/home"
          element={
            <Home />
          }
        />

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        <Route
          path="/products"
          element={
            <Products />
          }
        />

        {/* ==========================================
            CART
        ========================================== */}

        <Route
          path="/cart"
          element={
            <Cart />
          }
        />

        {/* ==========================================
            CHECKOUT
        ========================================== */}

        <Route
          path="/checkout"
          element={
            <Checkout />
          }
        />

        {/* ==========================================
            ORDERS
        ========================================== */}

        <Route
          path="/orders"
          element={
            <Orders />
          }
        />

        {/* ==========================================
            ORDER CONFIRMATION
        ========================================== */}

        <Route
          path="/order-confirmation"
          element={
            <OrderConfirmation />
          }
        />

        {/* ==========================================
            ADMIN DASHBOARD
        ========================================== */}

        <Route
          path="/admin-dashboard"
          element={
            <AdminDashboard />
          }
        />

        {/* ==========================================
            ADMIN ADD PRODUCT
        ========================================== */}

        <Route
          path="/admin/products/add"
          element={
            <AddProduct />
          }
        />

        {/* ==========================================
            UNKNOWN ROUTES
        ========================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/register"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;