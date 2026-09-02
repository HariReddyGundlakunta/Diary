const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const createTables = require("./createTables");

const app = express();

const PORT = process.env.PORT || 5000;


// ==========================================
// CORS
// ==========================================

const allowedOrigins = [
  "http://localhost:3000",
  "https://farm-self-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "CORS blocked:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);


// ==========================================
// JSON
// ==========================================

app.use(express.json());


// ==========================================
// HOME
// ==========================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "Dairy Management Backend is Running!",
  });

});


// ==========================================
// API TEST
// ==========================================

app.get("/api/test", (req, res) => {

  res.json({
    success: true,
    message: "API is working!",
  });

});


// ==========================================
// AUTH
// ==========================================

const authRoutes =
  require("./routes/authRoutes");

app.use(
  "/api/auth",
  authRoutes
);


// ==========================================
// PRODUCTS
// ==========================================

const productRoutes =
  require("./routes/productRoutes");

app.use(
  "/api/products",
  productRoutes
);


// ==========================================
// CART
// ==========================================

const cartRoutes =
  require("./routes/cartRoutes");

app.use(
  "/api/cart",
  cartRoutes
);


// ==========================================
// ORDERS
// ==========================================

const orderRoutes =
  require("./routes/orderRoutes");

app.use(
  "/api/orders",
  orderRoutes
);


// ==========================================
// 404
// ==========================================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found",
  });

});


// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
  (err, req, res, next) => {

    console.error(
      "❌ SERVER ERROR:",
      err.message
    );

    res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });
  }
);


// ==========================================
// START SERVER
// ==========================================

async function startServer() {

  try {

    await db.testConnection();

    await createTables();

    app.listen(PORT, () => {

      console.log("=================================");
      console.log(
        `🚀 Server running on port ${PORT}`
      );
      console.log(
        `🌐 http://localhost:${PORT}`
      );
      console.log("=================================");

    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ SERVER START FAILED");
    console.error(error.message);
    console.error("=================================");

    process.exit(1);
  }
}

startServer();