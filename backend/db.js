const mysql = require("mysql2/promise");
require("dotenv").config();

// ==================================================
// CHECK ENVIRONMENT VARIABLES
// ==================================================

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

const missingEnv = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missingEnv.length > 0) {
  console.error("=================================");
  console.error("❌ MISSING DATABASE ENVIRONMENT VARIABLES");
  console.error("Missing:", missingEnv.join(", "));
  console.error("=================================");
}

// ==================================================
// DATABASE CONFIGURATION
// ==================================================

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // TiDB Cloud normally uses port 4000
  port: Number(process.env.DB_PORT || 4000),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // TiDB Cloud TLS
  ssl: {
    rejectUnauthorized: true,
  },
};

// ==================================================
// CREATE CONNECTION POOL
// ==================================================

const db = mysql.createPool(dbConfig);

// ==================================================
// TEST DATABASE CONNECTION
// ==================================================

async function testConnection() {
  let connection;

  try {
    console.log("=================================");
    console.log("🔄 TESTING TIDB CLOUD CONNECTION...");
    console.log("Host:", process.env.DB_HOST);
    console.log("Database:", process.env.DB_NAME);
    console.log(
      "User:",
      process.env.DB_USER
        ? "Configured"
        : "MISSING"
    );
    console.log(
      "Password:",
      process.env.DB_PASSWORD
        ? "Configured"
        : "MISSING"
    );
    console.log(
      "Port:",
      process.env.DB_PORT || 4000
    );
    console.log("=================================");

    connection = await db.getConnection();

    const [rows] = await connection.query(
      "SELECT 1 AS connected"
    );

    console.log("=================================");
    console.log("✅ TIDB CLOUD DATABASE CONNECTED");
    console.log(
      "Test query:",
      rows[0].connected
    );
    console.log("=================================");

    return true;
  } catch (error) {
    console.error("=================================");
    console.error(
      "❌ TIDB DATABASE CONNECTION FAILED"
    );
    console.error("Error code:", error.code);
    console.error(
      "Error message:",
      error.message
    );
    console.error(
      "Error errno:",
      error.errno
    );
    console.error(
      "Error sqlState:",
      error.sqlState
    );
    console.error("=================================");

    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// ==================================================
// ATTACH TEST FUNCTION
// ==================================================

db.testConnection = testConnection;

// ==================================================
// EXPORT
// ==================================================

module.exports = db;

