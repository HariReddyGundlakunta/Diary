const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");

// ==================================================
// JWT SECRET
// ==================================================

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "hari_farms_secret_key_2026";

// ==================================================
// REGISTER
// ==================================================

router.post(
  "/register",
  async (req, res) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "POST /api/auth/register"
      );

      console.log(
        "================================="
      );

      const {
        name,
        email,
        password,
        confirmPassword,
      } = req.body;

      // ------------------------------------------
      // VALIDATION
      // ------------------------------------------

      if (
        !name ||
        !email ||
        !password
      ) {

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
          message:
            "Passwords do not match",
        });

      }

      // ------------------------------------------
      // CLEAN VALUES
      // ------------------------------------------

      const cleanName =
        name.trim();

      const cleanEmail =
        email.trim().toLowerCase();

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

      if (
        existingUsers.length > 0
      ) {

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
          password,
          10
        );

      // ------------------------------------------
      // CHECK ROLE COLUMN
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
        userColumns.map(
          (row) =>
            row.COLUMN_NAME.toLowerCase()
        );

      // ------------------------------------------
      // INSERT USER
      // ------------------------------------------

      let result;

      if (
        columnNames.includes("role")
      ) {

        [
          result
        ] = await db.query(
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
            "user",
          ]
        );

      } else {

        [
          result
        ] = await db.query(
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
        "User registered:",
        result.insertId
      );

      // ------------------------------------------
      // RESPONSE
      // ------------------------------------------

      res.status(201).json({

        success: true,

        message:
          "Registration successful",

        user: {
          id:
            result.insertId,

          name:
            cleanName,

          email:
            cleanEmail,

          role:
            "user",
        },

      });

    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Registration failed",

        error:
          error.message,

      });

    }

  }
);

// ==================================================
// LOGIN
// ==================================================

router.post(
  "/login",
  async (req, res) => {

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

      const {
        email,
        password,
      } = req.body;

      // ------------------------------------------
      // VALIDATION
      // ------------------------------------------

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });

      }

      // ------------------------------------------
      // CLEAN EMAIL
      // ------------------------------------------

      const cleanEmail =
        email.trim().toLowerCase();

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

      if (
        users.length === 0
      ) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });

      }

      const user =
        users[0];

      // ------------------------------------------
      // CHECK PASSWORD
      // ------------------------------------------

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {

        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });

      }

      // ------------------------------------------
      // USER ROLE
      // ------------------------------------------

      const role =
        String(
          user.role || "user"
        ).toLowerCase();

      // ------------------------------------------
      // CREATE TOKEN
      // ------------------------------------------

      const token =
        jwt.sign(
          {
            id:
              user.id,

            email:
              user.email,

            role:
              role,
          },

          JWT_SECRET,

          {
            expiresIn:
              "7d",
          }
        );

      // ------------------------------------------
      // USER RESPONSE
      // ------------------------------------------

      const userResponse = {

        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          role,

      };

      console.log(
        "Login successful:",
        userResponse
      );

      // ------------------------------------------
      // RESPONSE
      // ------------------------------------------

      res.status(200).json({

        success: true,

        message:
          "Login successful",

        token:

          token,

        user:
          userResponse,

      });

    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Login failed",

        error:
          error.message,

      });

    }

  }
);

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

      // ==================================================
      // TOTAL PRODUCTS
      // ==================================================

      const [
        productRows
      ] = await db.query(
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

      // ==================================================
      // TOTAL ORDERS
      // ==================================================

      const [
        orderRows
      ] = await db.query(
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

      // ==================================================
      // TOTAL CUSTOMERS
      // ==================================================

      let totalCustomers = 0;

      // Get users table columns
      const [
        userColumns
      ] = await db.query(
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
            row.COLUMN_NAME.toLowerCase()
        );

      // ------------------------------------------
      // IF ROLE COLUMN EXISTS
      // ------------------------------------------

      if (
        usersColumnNames.includes(
          "role"
        )
      ) {

        const [
          customerRows
        ] = await db.query(
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

        // ----------------------------------------
        // NO ROLE COLUMN
        // ----------------------------------------

        const [
          customerRows
        ] = await db.query(
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

      // ==================================================
      // REVENUE
      // ==================================================

      // Find which column contains order total
      const [
        orderColumns
      ] = await db.query(
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
            row.COLUMN_NAME.toLowerCase()
        );

      let revenue = 0;

      // Possible total column names
      const possibleRevenueColumns = [
        "total",
        "total_amount",
        "totalamount",
        "amount",
        "order_total",
      ];

      let revenueColumn = null;

      for (
        const column
        of possibleRevenueColumns
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

      // ------------------------------------------
      // CALCULATE REVENUE
      // ------------------------------------------

      if (
        revenueColumn
      ) {

        const [
          revenueRows
        ] = await db.query(
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

      // ==================================================
      // FINAL STATS
      // ==================================================

      const stats = {

        totalProducts:
          totalProducts,

        totalOrders:
          totalOrders,

        totalCustomers:
          totalCustomers,

        revenue:
          revenue,

      };

      console.log(
        "================================="
      );

      console.log(
        "ADMIN DASHBOARD STATS:"
      );

      console.log(
        stats
      );

      console.log(
        "================================="
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      res.status(200).json({

        success: true,

        stats:

          stats,

      });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "ADMIN STATS ERROR:"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to load admin statistics",

        error:
          error.message,

      });

    }

  }
);

// ==================================================
// EXPORT
// ==================================================

module.exports = router;