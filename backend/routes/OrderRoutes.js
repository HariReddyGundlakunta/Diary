const express = require("express");
const router = express.Router();

const db = require("../db");

// ==========================================
// AUTH MIDDLEWARE
// ==========================================

const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const jwt = require("jsonwebtoken");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


// ==========================================
// GET MY ORDERS
// ==========================================

router.get(
  "/my-orders",
  authenticateToken,
  async (req, res) => {

    try {

      console.log("=================================");
      console.log("FETCHING USER ORDERS");
      console.log("USER:", req.user);
      console.log("=================================");


      // Get user ID safely
      const userId =
        req.user.id ||
        req.user.userId ||
        req.user.user_id;


      if (!userId) {

        console.log("USER ID NOT FOUND:", req.user);

        return res.status(400).json({
          success: false,
          message: "User ID not found in token",
        });
      }


      // IMPORTANT:
      // Your database column is order_date
      // We alias it as created_at for the frontend

      const query = `
        SELECT
          id,
          user_id,
          total,
          status,
          order_date AS created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY order_date DESC
      `;


      const [orders] =
        await db.query(
          query,
          [userId]
        );


      console.log(
        "ORDERS FOUND:",
        orders.length
      );


      return res.status(200).json({

        success: true,

        orders: orders,

      });


    } catch (error) {

      console.error(
        "FETCH MY ORDERS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch orders",

        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,

      });

    }

  }
);


// ==========================================
// GET SINGLE ORDER
// ==========================================

router.get(
  "/:id",
  authenticateToken,
  async (req, res) => {

    try {

      const orderId =
        Number(req.params.id);


      const userId =
        req.user.id ||
        req.user.userId ||
        req.user.user_id;


      if (!orderId) {

        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });

      }


      const [orders] =
        await db.query(
          `
          SELECT
            id,
            user_id,
            total,
            status,
            order_date AS created_at
          FROM orders
          WHERE id = ?
          AND user_id = ?
          `,
          [orderId, userId]
        );


      if (orders.length === 0) {

        return res.status(404).json({

          success: false,

          message: "Order not found",

        });

      }


      const [items] =
        await db.query(
          `
          SELECT
            id,
            order_id,
            product_id,
            product_name,
            price,
            quantity,
            emoji
          FROM order_items
          WHERE order_id = ?
          `,
          [orderId]
        );


      return res.status(200).json({

        success: true,

        order: {
          ...orders[0],
          items: items,
        },

      });


    } catch (error) {

      console.error(
        "FETCH SINGLE ORDER ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch order",

      });

    }

  }
);


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;