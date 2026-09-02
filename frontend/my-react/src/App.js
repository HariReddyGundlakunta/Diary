import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminDashboard from "./Pages/AdminDashboard";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import AddProduct from "./Pages/AddProducts";
import Cart from "./Pages/Cart";
import Orders from "./Pages/MyOrders";

// ==========================================
// PROTECTED ROUTE
// ==========================================

import ProtectedRoute from "./ProtectedRoute";


// ==========================================
// APP
// ==========================================

function App() {

  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================
            ROOT
            ALWAYS GO TO LOGIN
            ===================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/login"
              replace
            />
          }
        />


        {/* =====================================
            LOGIN
            ===================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />


        {/* =====================================
            REGISTER
            ===================================== */}

        <Route
          path="/register"
          element={
            <Register />
          }
        />


        {/* =====================================
            DASHBOARD
            PROTECTED
            ===================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            PRODUCTS
            PROTECTED
            ===================================== */}

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            PRODUCT DETAILS
            PROTECTED

            Example:
            /products/1
            /products/2
            /products/10
            ===================================== */}

        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductDetails />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            ADD PRODUCT
            PROTECTED
            ===================================== */}

        <Route
          path="/admin/products/add"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            CART
            PROTECTED
            ===================================== */}

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            ORDERS
            PROTECTED
            ===================================== */}

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />


        {/* =====================================
            UNKNOWN URL
            ALWAYS GO TO LOGIN
            ===================================== */}

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