const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dairy_farm",
  port: Number(process.env.DB_PORT) || 3306,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  let connection;

  try {
    connection = await db.getConnection();

    console.log("=================================");
    console.log("✅ MYSQL DATABASE CONNECTED");
    console.log(
      "Database:",
      process.env.DB_NAME || "dairy_farm"
    );
    console.log("=================================");

  } catch (error) {
    console.error("=================================");
    console.error("❌ MYSQL CONNECTION FAILED");
    console.error(error.message);
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