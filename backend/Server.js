const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/AuthRoutes");

const app = express();


// ======================================================
// CORS
// ======================================================

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://farm-self-six.vercel.app",
    ],
    credentials: true,
  })
);


// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());


// ======================================================
// HOME / HEALTH CHECK
// ======================================================

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Dairy Farm API is running",
  });
});


// ======================================================
// DATABASE TEST
// ======================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT 1 AS connected"
    );

    res.status(200).json({
      success: true,
      message: "Database connected successfully",
      database: process.env.DB_NAME,
      result: rows[0].connected,
    });

  } catch (error) {
    console.error(
      "DATABASE TEST ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});


// ======================================================
// AUTH ROUTES
// ======================================================

app.use(
  "/api/auth",
  authRoutes
);


// ======================================================
// 404 HANDLER
// ======================================================

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found",
    path: req.originalUrl,
  });
});


// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
  console.error(
    "SERVER ERROR:",
    err
  );

  res.status(500).json({
    message: "Internal server error",
  });
});


// ======================================================
// START SERVER
// ======================================================

const PORT =
  process.env.PORT || 5000;


async function startServer() {
  try {

    console.log(
      "================================="
    );

    console.log(
      "🔄 Testing database connection..."
    );

    await db.testConnection();

    console.log(
      "✅ Database test completed"
    );

    console.log(
      "================================="
    );


    app.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

      console.log(
        `🌐 http://localhost:${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "❌ SERVER NOT STARTED"
    );

    console.error(
      "Database connection failed."
    );

    console.error(
      error.message
    );

    console.error(
      "================================="
    );

    process.exit(1);
  }
}


startServer();