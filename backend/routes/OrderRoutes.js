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
      ? authHeader.substring(7)
      : authHeader;

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
// GET USER ID FROM TOKEN
// ==================================================

const getUserId = (req) => {
  return (
    req.user?.id ||
    req.user?.userId ||
    req.user?.user_id
  );
};


// ==================================================
// CHECKOUT
// ==================================================

router.post(
  "/checkout",
  authenticateUser,
  async (req, res) => {

    let connection;

    try {

      console.log(
        "================================="
      );

      console.log(
        "POST /api/orders/checkout"
      );

      // ==========================================
      // GET USER ID FROM JWT TOKEN
      // ==========================================

      const userId = getUserId(req);

      console.log(
        "CHECKOUT USER:",
        req.user
      );

      console.log(
        "USER ID:",
        userId
      );


      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User ID not found in login token",
        });
      }


      // ==========================================
      // DATABASE CONNECTION
      // ==========================================

      connection =
        await db.getConnection();

      await connection.beginTransaction();


      // ==========================================
      // GET CART ITEMS
      // ==========================================

      const [cartItems] =
        await connection.query(
          `
          SELECT
            cart_items.id AS cart_id,
            cart_items.product_id,
            cart_items.quantity,

            products.name,
            products.price,
            products.emoji,
            products.image,
            products.stock

          FROM cart_items

          INNER JOIN products
            ON cart_items.product_id = products.id

          WHERE cart_items.user_id = ?
          `,
          [userId]
        );


      // ==========================================
      // CHECK EMPTY CART
      // ==========================================

      if (cartItems.length === 0) {

        await connection.rollback();

        return res.status(400).json({
          success: false,
          message:
            "Your cart is empty",
        });
      }


      // ==========================================
      // CALCULATE TOTAL
      // ==========================================

      let total = 0;

      for (const item of cartItems) {

        total +=
          Number(item.price || 0) *
          Number(item.quantity || 0);

      }


      // ==========================================
      // CREATE ORDER
      // ==========================================

      const [orderResult] =
        await connection.query(
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


      console.log(
        "✅ ORDER CREATED:",
        orderId
      );


      // ==========================================
      // CREATE ORDER ITEMS
      // ==========================================

      for (const item of cartItems) {

        // ----------------------------------------
        // CHECK STOCK
        // ----------------------------------------

        if (
          Number(item.stock) <
          Number(item.quantity)
        ) {

          throw new Error(
            `${item.name} does not have enough stock`
          );
        }


        // ----------------------------------------
        // INSERT ORDER ITEM
        // ----------------------------------------

        await connection.query(
          `
          INSERT INTO order_items
          (
            order_id,
            product_id,
            product_name,
            price,
            quantity,
            emoji
          )
          VALUES (?, ?, ?, ?, ?, ?)
          `,
          [
            orderId,
            item.product_id,
            item.name,
            item.price,
            item.quantity,
            item.emoji || "🥛",
          ]
        );


        // ----------------------------------------
        // UPDATE STOCK
        // ----------------------------------------

        await connection.query(
          `
          UPDATE products

          SET stock = stock - ?

          WHERE id = ?
          `,
          [
            item.quantity,
            item.product_id,
          ]
        );

      }


      // ==========================================
      // CLEAR CART
      // ==========================================

      await connection.query(
        `
        DELETE FROM cart_items

        WHERE user_id = ?
        `,
        [userId]
      );


      // ==========================================
      // COMMIT
      // ==========================================

      await connection.commit();


      console.log(
        "================================="
      );

      console.log(
        "✅ CHECKOUT SUCCESSFUL"
      );

      console.log(
        "ORDER ID:",
        orderId
      );

      console.log(
        "TOTAL:",
        total
      );

      console.log(
        "================================="
      );


      return res.status(201).json({
        success: true,
        message:
          "Order placed successfully",
        orderId,
        total,
      });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ CHECKOUT ERROR:",
        error.message
      );

      console.error(
        "================================="
      );


      if (connection) {
        await connection.rollback();
      }


      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to place order",
      });

    } finally {

      if (connection) {
        connection.release();
      }

    }

  }
);


// ==================================================
// GET LOGGED-IN USER ORDERS
// ==================================================

router.get(
  "/my-orders",
  authenticateUser,
  async (req, res) => {

    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "User ID not found in login token",
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

          WHERE user_id = ?

          ORDER BY id DESC
          `,
          [userId]
        );


      return res.status(200).json({
        success: true,
        orders,
      });

    } catch (error) {

      console.error(
        "GET MY ORDERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch orders",
      });

    }

  }
);


// ==================================================
// GET SINGLE ORDER
// ==================================================

router.get(
  "/:orderId",
  authenticateUser,
  async (req, res) => {

    try {

      const userId = getUserId(req);

      const orderId =
        Number(req.params.orderId);


      if (!orderId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order ID",
        });
      }


      // Get only the logged-in user's order

      const [orders] =
        await db.query(
          `
          SELECT *

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


      const [items] =
        await db.query(
          `
          SELECT *

          FROM order_items

          WHERE order_id = ?
          `,
          [orderId]
        );


      return res.status(200).json({
        success: true,
        order: orders[0],
        items,
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