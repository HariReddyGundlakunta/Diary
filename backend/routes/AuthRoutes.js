const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../db");

// ==================================================
// JWT SECRET
// ==================================================

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn(
    "⚠️ WARNING: JWT_SECRET is not configured in environment variables."
  );
}

// ==================================================
// REGISTER
// ==================================================

router.post("/register", async (req, res) => {
  try {
    console.log("=================================");
    console.log("POST /api/auth/register");
    console.log("=================================");

    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body || {};

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    // ------------------------------------------
    // PASSWORD CONFIRMATION
    // ------------------------------------------

    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // ------------------------------------------
    // CLEAN VALUES
    // ------------------------------------------

    const cleanName = String(name).trim();

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    if (
      !cleanName ||
      !cleanEmail ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid registration details",
      });
    }

    // ------------------------------------------
    // CHECK EMAIL
    // ------------------------------------------

    const [existingUsers] =
      await db.query(
        `
        SELECT id
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
        `,
        [cleanEmail]
      );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message:
          "Email is already registered",
      });
    }

    // ------------------------------------------
    // HASH PASSWORD
    // ------------------------------------------

    const hashedPassword =
      await bcrypt.hash(
        String(password),
        10
      );

    // ------------------------------------------
    // CHECK USERS TABLE COLUMNS
    // ------------------------------------------

    const [userColumns] =
      await db.query(
        `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        `
      );

    const columnNames =
      userColumns.map((row) =>
        String(
          row.COLUMN_NAME
        ).toLowerCase()
      );

    // ------------------------------------------
    // DETERMINE NEW USER ROLE
    // ------------------------------------------

    /*
     * The special HARI FARMS admin email
     * receives the admin role.
     *
     * Every other newly registered account
     * receives the normal user role.
     */

    const newUserRole =
      cleanEmail === "admin@gmail.com"
        ? "admin"
        : "user";

    console.log(
      "New account role:",
      newUserRole
    );

    // ------------------------------------------
    // INSERT USER
    // ------------------------------------------

    let result;

    if (
      columnNames.includes("role")
    ) {
      [result] =
        await db.query(
          `
          INSERT INTO users
          (
            name,
            email,
            password,
            role
          )
          VALUES (?, ?, ?, ?)
          `,
          [
            cleanName,
            cleanEmail,
            hashedPassword,
            newUserRole,
          ]
        );
    } else {
      /*
       * If the role column doesn't exist,
       * normal registration can still work.
       *
       * However, the role column should exist
       * for proper admin/user separation.
       */

      console.warn(
        "⚠️ users table does not contain a role column."
      );

      [result] =
        await db.query(
          `
          INSERT INTO users
          (
            name,
            email,
            password
          )
          VALUES (?, ?, ?)
          `,
          [
            cleanName,
            cleanEmail,
            hashedPassword,
          ]
        );
    }

    console.log(
      "✅ User registered successfully:",
      result.insertId
    );

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    return res.status(201).json({
      success: true,
      message:
        "Registration successful",

      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
        role: newUserRole,
      },
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ REGISTER ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Registration failed",

      error:
        process.env.NODE_ENV ===
        "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// ==================================================
// LOGIN
// ==================================================

router.post("/login", async (req, res) => {
  try {
    console.log(
      "================================="
    );

    console.log(
      "POST /api/auth/login"
    );

    console.log(
      "================================="
    );

    // ------------------------------------------
    // CHECK REQUEST BODY
    // ------------------------------------------

    if (!req.body) {
      return res.status(400).json({
        success: false,
        message:
          "Request body is required",
      });
    }

    const {
      email,
      password,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // ------------------------------------------
    // CLEAN EMAIL
    // ------------------------------------------

    const cleanEmail = String(email)
      .trim()
      .toLowerCase();

    const cleanPassword =
      String(password);

    if (
      !cleanEmail ||
      !cleanPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    console.log(
      "Login email:",
      cleanEmail
    );

    // ------------------------------------------
    // CHECK USERS TABLE
    // ------------------------------------------

    const [userColumns] =
      await db.query(
        `
        SELECT COLUMN_NAME
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'users'
        `
      );

    if (
      !userColumns ||
      userColumns.length === 0
    ) {
      console.error(
        "❌ USERS TABLE NOT FOUND OR HAS NO COLUMNS"
      );

      return res.status(500).json({
        success: false,
        message:
          "Users table is not available",
      });
    }

    const columnNames =
      userColumns.map((row) =>
        String(
          row.COLUMN_NAME
        ).toLowerCase()
      );

    console.log(
      "Users table columns:",
      columnNames
    );

    // ------------------------------------------
    // CHECK REQUIRED COLUMNS
    // ------------------------------------------

    if (
      !columnNames.includes("email")
    ) {
      console.error(
        "❌ users table does not contain email column"
      );

      return res.status(500).json({
        success: false,
        message:
          "Database users table is missing email column",
      });
    }

    if (
      !columnNames.includes("password")
    ) {
      console.error(
        "❌ users table does not contain password column"
      );

      return res.status(500).json({
        success: false,
        message:
          "Database users table is missing password column",
      });
    }

    // ------------------------------------------
    // FIND USER
    // ------------------------------------------

    const [users] =
      await db.query(
        `
        SELECT *
        FROM users
        WHERE LOWER(email) = ?
        LIMIT 1
        `,
        [cleanEmail]
      );

    console.log(
      "Matching users:",
      users.length
    );

    // ------------------------------------------
    // USER NOT FOUND
    // ------------------------------------------

    if (
      !users ||
      users.length === 0
    ) {
      console.log(
        "❌ Login failed: user not found"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const user = users[0];

    // ------------------------------------------
    // CHECK PASSWORD HASH
    // ------------------------------------------

    if (!user.password) {
      console.error(
        "❌ User exists but password field is empty"
      );

      return res.status(500).json({
        success: false,
        message:
          "User account has an invalid password configuration",
      });
    }

    console.log(
      "Password hash found:",
      typeof user.password ===
        "string"
    );

    // ------------------------------------------
    // COMPARE PASSWORD
    // ------------------------------------------

    let passwordMatch = false;

    try {
      passwordMatch =
        await bcrypt.compare(
          cleanPassword,
          String(user.password)
        );

    } catch (passwordError) {
      console.error(
        "❌ BCRYPT PASSWORD ERROR:",
        passwordError
      );

      return res.status(500).json({
        success: false,
        message:
          "Password verification failed",

        error:
          process.env.NODE_ENV ===
          "production"
            ? "Internal server error"
            : passwordError.message,
      });
    }

    // ------------------------------------------
    // INVALID PASSWORD
    // ------------------------------------------

    if (!passwordMatch) {
      console.log(
        "❌ Login failed: incorrect password"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    // ------------------------------------------
    // USER ROLE
    // ------------------------------------------

    /*
     * IMPORTANT:
     *
     * admin@gmail.com is always treated
     * as the HARI FARMS administrator.
     *
     * This fixes the current situation where
     * the database is returning:
     *
     * role = "user"
     *
     * for admin@gmail.com.
     */

    let role = "user";

    if (
      cleanEmail ===
      "admin@gmail.com"
    ) {
      role = "admin";

      console.log(
        "🔐 HARI FARMS ADMIN ACCOUNT DETECTED"
      );

    } else if (
      columnNames.includes("role")
    ) {
      role = String(
        user.role || "user"
      )
        .trim()
        .toLowerCase();
    }

    console.log(
      "User role:",
      role
    );

    // ------------------------------------------
    // CHECK USER ID
    // ------------------------------------------

    if (
      user.id === undefined ||
      user.id === null
    ) {
      console.error(
        "❌ User record does not contain id"
      );

      return res.status(500).json({
        success: false,
        message:
          "User database record is missing id",
      });
    }

    // ------------------------------------------
    // JWT SECRET
    // ------------------------------------------

    if (!JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET is missing from Render environment variables"
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration is missing",
      });
    }

    // ------------------------------------------
    // CREATE TOKEN
    // ------------------------------------------

    let token;

    try {
      token = jwt.sign(
        {
          id: user.id,
          email: cleanEmail,
          role: role,
        },

        JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

    } catch (jwtError) {
      console.error(
        "❌ JWT ERROR:",
        jwtError
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to create authentication token",

        error:
          process.env.NODE_ENV ===
          "production"
            ? "Internal server error"
            : jwtError.message,
      });
    }

    // ------------------------------------------
    // USER RESPONSE
    // ------------------------------------------

    const userResponse = {
      id: user.id,
      name: user.name || "",
      email:
        user.email ||
        cleanEmail,
      role: role,
    };

    console.log(
      "================================="
    );

    console.log(
      "✅ LOGIN SUCCESSFUL"
    );

    console.log(
      "User:",
      userResponse
    );

    console.log(
      "================================="
    );

    // ------------------------------------------
    // RESPONSE
    // ------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      token: token,

      user: userResponse,
    });

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ LOGIN ERROR"
    );

    console.error(
      "Error name:",
      error.name
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "Full error:",
      error
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Login failed",

      error:
        process.env.NODE_ENV ===
        "production"
          ? "Internal server error"
          : error.message,
    });
  }
});

// ==================================================
// ADMIN DASHBOARD STATISTICS
// ==================================================

router.get(
  "/admin/stats",
  async (req, res) => {
    try {
      console.log(
        "================================="
      );

      console.log(
        "GET /api/auth/admin/stats"
      );

      console.log(
        "Loading admin statistics..."
      );

      console.log(
        "================================="
      );

      // ------------------------------------------
      // TOTAL PRODUCTS
      // ------------------------------------------

      const [productRows] =
        await db.query(
          `
          SELECT COUNT(*) AS totalProducts
          FROM products
          `
        );

      const totalProducts =
        Number(
          productRows[0]
            ?.totalProducts || 0
        );

      // ------------------------------------------
      // TOTAL ORDERS
      // ------------------------------------------

      const [orderRows] =
        await db.query(
          `
          SELECT COUNT(*) AS totalOrders
          FROM orders
          `
        );

      const totalOrders =
        Number(
          orderRows[0]
            ?.totalOrders || 0
        );

      // ------------------------------------------
      // TOTAL CUSTOMERS
      // ------------------------------------------

      let totalCustomers = 0;

      const [userColumns] =
        await db.query(
          `
          SELECT COLUMN_NAME
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'users'
          `
        );

      const usersColumnNames =
        userColumns.map(
          (row) =>
            String(
              row.COLUMN_NAME
            ).toLowerCase()
        );

      if (
        usersColumnNames.includes(
          "role"
        )
      ) {
        const [customerRows] =
          await db.query(
            `
            SELECT COUNT(*) AS totalCustomers
            FROM users
            WHERE LOWER(
              COALESCE(role, 'user')
            ) <> 'admin'
            `
          );

        totalCustomers =
          Number(
            customerRows[0]
              ?.totalCustomers || 0
          );

      } else {
        const [customerRows] =
          await db.query(
            `
            SELECT COUNT(*) AS totalCustomers
            FROM users
            `
          );

        totalCustomers =
          Number(
            customerRows[0]
              ?.totalCustomers || 0
          );
      }

      // ------------------------------------------
      // REVENUE
      // ------------------------------------------

      const [orderColumns] =
        await db.query(
          `
          SELECT COLUMN_NAME
          FROM INFORMATION_SCHEMA.COLUMNS
          WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = 'orders'
          `
        );

      const ordersColumnNames =
        orderColumns.map(
          (row) =>
            String(
              row.COLUMN_NAME
            ).toLowerCase()
        );

      const possibleRevenueColumns = [
        "total",
        "total_amount",
        "totalamount",
        "amount",
        "order_total",
      ];

      let revenueColumn = null;

      for (
        const column of possibleRevenueColumns
      ) {
        if (
          ordersColumnNames.includes(
            column
          )
        ) {
          revenueColumn =
            column;

          break;
        }
      }

      let revenue = 0;

      if (revenueColumn) {
        const [revenueRows] =
          await db.query(
            `
            SELECT
              COALESCE(
                SUM(
                  COALESCE(
                    \`${revenueColumn}\`,
                    0
                  )
                ),
                0
              ) AS revenue
            FROM orders
            `
          );

        revenue =
          Number(
            revenueRows[0]
              ?.revenue || 0
          );
      }

      // ------------------------------------------
      // FINAL STATS
      // ------------------------------------------

      const stats = {
        totalProducts,
        totalOrders,
        totalCustomers,
        revenue,
      };

      console.log(
        "ADMIN DASHBOARD STATS:",
        stats
      );

      // ------------------------------------------
      // RESPONSE
      // ------------------------------------------

      return res.status(200).json({
        success: true,
        stats,
      });

    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "❌ ADMIN STATS ERROR"
      );

      console.error(error);

      console.error(
        "================================="
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to load admin statistics",

        error:
          process.env.NODE_ENV ===
          "production"
            ? "Internal server error"
            : error.message,
      });
    }
  }
);

// ==================================================
// EXPORT
// ==================================================

module.exports = router;