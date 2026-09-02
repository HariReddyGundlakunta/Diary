const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT || 4000),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // TiDB Cloud requires a secure connection
  ssl: {
    rejectUnauthorized: true,
  },
});

async function testConnection() {
  let connection;

  try {
    connection = await db.getConnection();

    // Test an actual query
    const [rows] = await connection.query(
      "SELECT 1 AS connected"
    );

    console.log("=================================");
    console.log("✅ TIDB CLOUD DATABASE CONNECTED");
    console.log("Database:", process.env.DB_NAME);
    console.log("Host:", process.env.DB_HOST);
    console.log("Test query:", rows[0].connected);
    console.log("=================================");

  } catch (error) {
    console.error("=================================");
    console.error("❌ TIDB DATABASE CONNECTION FAILED");
    console.error("Error:", error.message);
    console.error("=================================");

    throw error;

  } finally {
    if (connection) {
      connection.release();
    }
  }
}

db.testConnection = testConnection;

module.exports = db;