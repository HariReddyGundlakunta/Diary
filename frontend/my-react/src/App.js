import React, { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// ===============================
// COMPONENTS
// ===============================
import Navbar from "./Components/Navbar";

// ===============================
// CUSTOMER PAGES
// ===============================
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import OrderConfirmation from "./Pages/OrderConfirmation";
import MyOrders from "./Pages/MyOrders";

// ===============================
// ADMIN PAGES
// ===============================
import AdminDashboard from "./Pages/AdminDashboard";
import AddProducts from "./Pages/AddProducts";

// ===============================
// 404 PAGE
// ===============================
import NotFound from "./Pages/NotFound";

function App() {
  // Cart state
  const [cart, setCart] = useState([]);

  // ===============================
  // ADD PRODUCT TO CART
  // ===============================
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      // Product already exists
      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // New product
      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  return (
    <BrowserRouter>

      {/* ===============================
          NAVBAR
      =============================== */}
      <Navbar cartCount={cart.length} />

      {/* ===============================
          ROUTES
      =============================== */}
      <Routes>

        {/* ===============================
            HOME
        =============================== */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* ===============================
            AUTHENTICATION
        =============================== */}
        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* ===============================
            PRODUCTS
        =============================== */}
        <Route
          path="/products"
          element={
            <Products
              addToCart={addToCart}
            />
          }
        />

        {/* ===============================
            PRODUCT DETAILS
        =============================== */}
        <Route
          path="/product/:id"
          element={
            <ProductDetails
              addToCart={addToCart}
            />
          }
        />

        {/* ===============================
            CART
        =============================== */}
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              setCart={setCart}
            />
          }
        />

        {/* ===============================
            CHECKOUT
        =============================== */}
        <Route
          path="/checkout"
          element={
            <Checkout
              cart={cart}
            />
          }
        />

        {/* ===============================
            ORDER CONFIRMATION
        =============================== */}
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

        {/* ===============================
            MY ORDERS
        =============================== */}
        <Route
          path="/orders"
          element={<MyOrders />}
        />

        {/* ===============================
            ADMIN DASHBOARD
        =============================== */}
        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        {/* ===============================
            ADD PRODUCTS
        =============================== */}
        <Route
          path="/admin/products/add"
          element={<AddProducts />}
        />

        {/* ===============================
            PAGE NOT FOUND
        =============================== */}
        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;