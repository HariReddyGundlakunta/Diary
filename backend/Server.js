const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

require("dotenv").config();

const db = require("./db");

// ==================================================
// ROUTES
// ==================================================

const authRoutes = require("./routes/AuthRoutes");
const productRoutes = require("./routes/ProductRoutes");
const cartRoutes = require("./routes/CartRoutes");
const orderRoutes = require("./routes/OrderRoutes");

// ==================================================
// APP
// ==================================================

const app = express();

const PORT = process.env.PORT || 5000;

// ==================================================
// CREATE UPLOADS DIRECTORY
// ==================================================

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, {
    recursive: true,
  });

  console.log("✅ Uploads folder created");
}

// ==================================================
// CORS
// ==================================================

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://farm-self-six.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman, Render health checks,
      // and server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("⚠️ CORS blocked:", origin);

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

// ==================================================
// BODY PARSER
// ==================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ==================================================
// STATIC PRODUCT IMAGES
// ==================================================

// Example:
//
// backend/uploads/milk.jpg
//
// Available at:
//
// http://localhost:5000/uploads/milk.jpg

app.use(
  "/uploads",
  express.static(uploadsPath)
);

// ==================================================
// REQUEST LOGGER
// ==================================================

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} | ${req.method} ${req.originalUrl}`
  );

  next();
});

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "🥛 HARI FARMS API is running successfully",
  });
});

// ==================================================
// HEALTH CHECK
// ==================================================

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    return res.status(200).json({
      success: true,
      message: "Server and database are healthy",
    });

  } catch (error) {
    console.error(
      "❌ HEALTH CHECK ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Database is not available",
      error:
        process.env.NODE_ENV === "production"
          ? "Database connection failed"
          : error.message,
    });
  }
});

// ==================================================
// TEST DATABASE
// ==================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT 1 AS test"
    );

    return res.status(200).json({
      success: true,
      message: "Database connected successfully",
      result,
    });

  } catch (error) {
    console.error(
      "❌ DATABASE ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error:
        process.env.NODE_ENV === "production"
          ? "Database connection failed"
          : error.message,
    });
  }
});

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
// 404 HANDLER
// ==================================================

app.use((req, res) => {
  console.log(
    "❌ ROUTE NOT FOUND:",
    req.method,
    req.originalUrl
  );

  return res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ==================================================
// GLOBAL ERROR HANDLER
// ==================================================

app.use((error, req, res, next) => {
  console.error(
    "================================="
  );

  console.error(
    "❌ GLOBAL SERVER ERROR"
  );

  console.error(
    "Message:",
    error.message
  );

  console.error(
    "Stack:",
    error.stack
  );

  console.error(
    "================================="
  );

  // CORS ERROR

  if (
    error.message === "Not allowed by CORS"
  ) {
    return res.status(403).json({
      success: false,
      message: "CORS policy blocked this request",
    });
  }

  return res.status(
    error.status || 500
  ).json({
    success: false,
    message:
      error.message ||
      "Internal server error",
  });
});

// ==================================================
// START SERVER
// ==================================================

const startServer = async () => {
  try {
    // Test database before starting

    await db.query("SELECT 1");

    console.log(
      "✅ Database connection successful"
    );

    // Start server

    app.listen(PORT, () => {
      console.log(
        "================================="
      );

      console.log(
        "🚀 HARI FARMS SERVER STARTED"
      );

      console.log(
        `🌐 Server running on port ${PORT}`
      );

      console.log(
        `📦 Products: /api/products`
      );

      console.log(
        `🛒 Cart: /api/cart`
      );

      console.log(
        `📋 Orders: /api/orders`
      );

      console.log(
        `🖼️ Images: /uploads`
      );

      console.log(
        `🔐 Authentication: /api/auth`
      );

      console.log(
        "================================="
      );
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ DATABASE STARTUP ERROR"
    );

    console.error(
      error.message
    );

    console.error(
      "================================="
    );

    process.exit(1);
  }
};

// ==================================================
// START
// ==================================================

startServer();