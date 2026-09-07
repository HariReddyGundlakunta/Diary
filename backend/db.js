const mysql = require("mysql2/promise");

require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT || 4000),

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: 10,

  queueLimit: 0,

  ssl: {
    rejectUnauthorized: true,
  },
});


async function testConnection() {

  try {

    console.log("=================================");
    console.log("🔄 Testing database connection...");
    console.log("=================================");

    const connection =
      await db.getConnection();

    await connection.query(
      "SELECT 1 AS connected"
    );

    connection.release();

    console.log(
      "✅ DATABASE CONNECTED SUCCESSFULLY"
    );

    return true;

  } catch (error) {

    console.error(
      "❌ DATABASE CONNECTION ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    throw error;

  }

}


db.testConnection =
  testConnection;


module.exports = db;