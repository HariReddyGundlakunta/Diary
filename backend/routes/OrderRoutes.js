const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");

// ==================================================
// AUTHENTICATE USER
// ==================================================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : authHeader.trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.error(
      "ORDER AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired login token",
    });
  }
};


// ==================================================
// GET USER ID
// ==================================================

const getUserId = (req) => {
  if (!req.user) {
    return null;
  }

  return (
    req.user.id ||
    req.user.userId ||
    req.user.user_id ||
    req.user.userID ||
    null
  );
};


// ==================================================
// GET MY ORDERS
// IMPORTANT:
// This route MUST come before "/:id"
// ==================================================

router.get(
  "/my-orders",
  authenticateUser,
  async (req, res) => {
    try {

      const userId = getUserId(req);

      console.log(
        "================================="
      );

      console.log(
        "GET MY ORDERS"
      );

      console.log(
        "TOKEN USER:",
        req.user
      );

      console.log(
        "USER ID:",
        userId
      );

      console.log(
        "================================="
      );


      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found in login token",
        });
      }


      // ==============================================
      // GET ORDERS
      // ==============================================

      const [orders] = await db.query(
        `
        SELECT
          id,
          user_id,
          total,
          status,
          created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId]
      );


      return res.status(200).json({
        success: true,
        orders: orders || [],
      });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "GET MY ORDERS ERROR"
      );

      console.error(
        error
      );

      console.error(
        "MESSAGE:",
        error.message
      );

      console.error(
        "================================="
      );


      return res.status(500).json({
        success: false,
        message: "Failed to fetch orders",
        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.message,
      });
    }
  }
);


// ==================================================
// CHECKOUT / CREATE ORDER
// ==================================================

router.post(
  "/checkout",
  authenticateUser,
  async (req, res) => {

    let connection;

    try {

      const userId = getUserId(req);

      console.log(
        "CHECKOUT USER:",
        req.user
      );

      console.log(
        "CHECKOUT USER ID:",
        userId
      );


      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found in login token",
        });
      }


      // ==============================================
      // GET CART ITEMS
      // ==============================================

      const [cartItems] = await db.query(
        `
        SELECT
          cart_items.id AS cart_id,
          cart_items.product_id,
          cart_items.quantity,

          products.name,
          products.price,
          products.stock

        FROM cart_items

        INNER JOIN products
          ON products.id = cart_items.product_id

        WHERE cart_items.user_id = ?
        `,
        [userId]
      );


      if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Your cart is empty",
        });
      }


      // ==============================================
      // CALCULATE TOTAL
      // ==============================================

      const total = cartItems.reduce(
        (sum, item) => {

          const price =
            Number(item.price) || 0;

          const quantity =
            Number(item.quantity) || 0;

          return sum + price * quantity;

        },
        0
      );


      // ==============================================
      // CREATE ORDER
      // ==============================================

      const [orderResult] = await db.query(
        `
        INSERT INTO orders
        (
          user_id,
          total,
          status
        )
        VALUES (?, ?, ?)
        `,
        [
          userId,
          total,
          "Pending",
        ]
      );


      const orderId =
        orderResult.insertId;


      // ==============================================
      // CLEAR CART
      // ==============================================

      await db.query(
        `
        DELETE FROM cart_items
        WHERE user_id = ?
        `,
        [userId]
      );


      return res.status(201).json({
        success: true,

        message:
          "Order placed successfully",

        order: {
          id: orderId,
          user_id: userId,
          total,
          status: "Pending",
        },
      });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "CHECKOUT ERROR:"
      );

      console.error(error);

      console.error(
        "================================="
      );


      return res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error.message,
      });
    }
  }
);


// ==================================================
// GET SINGLE ORDER
// ==================================================

router.get(
  "/:id",
  authenticateUser,
  async (req, res) => {

    try {

      const userId =
        getUserId(req);

      const orderId =
        Number(req.params.id);


      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User ID not found",
        });
      }


      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID",
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
            created_at
          FROM orders
          WHERE id = ?
          AND user_id = ?
          `,
          [
            orderId,
            userId,
          ]
        );


      if (orders.length === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Order not found",
        });
      }


      return res.status(200).json({
        success: true,
        order: orders[0],
      });

    } catch (error) {

      console.error(
        "GET ORDER ERROR:",
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


// ==================================================
// EXPORT
// ==================================================

module.exports = router;