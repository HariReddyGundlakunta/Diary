const express = require("express");
const cors = require("cors");

require("dotenv").config();

const db = require("./db");

// ==================================================
// ROUTES
// ==================================================

const authRoutes =
  require("./routes/AuthRoutes");

const productRoutes =
  require("./routes/productRoutes");

const cartRoutes =
  require("./routes/cartRoutes");

const orderRoutes =
  require("./routes/orderRoutes");

// ==================================================
// APP
// ==================================================

const app = express();

const PORT =
  process.env.PORT || 5000;

// ==================================================
// CORS
// ==================================================

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://farm-self-six.vercel.app",
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ==================================================
// BODY PARSER
// ==================================================

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "HARI FARMS API is running",
  });

});

// ==================================================
// TEST DATABASE
// ==================================================

app.get(
  "/api/test-db",
  async (req, res) => {

    try {

      const [result] =
        await db.query(
          "SELECT 1 AS test"
        );

      res.json({
        success: true,
        message:
          "Database connected successfully",
        result,
      });

    } catch (error) {

      console.error(
        "DATABASE ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error:
          error.message,
      });

    }

  }
);

// ==================================================
// API ROUTES
// ==================================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/cart",
  cartRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

// ==================================================
// 404
// ==================================================

app.use(
  (req, res) => {

    console.log(
      "API ROUTE NOT FOUND:",
      req.method,
      req.originalUrl
    );

    res.status(404).json({

      success: false,

      message:
        "API route not found",

      path:
        req.originalUrl,

    });

  }
);

// ==================================================
// START SERVER
// ==================================================

app.listen(
  PORT,
  () => {

    console.log(
      "================================="
    );

    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      `🌐 http://localhost:${PORT}`
    );

    console.log(
      "================================="
    );

  }
);