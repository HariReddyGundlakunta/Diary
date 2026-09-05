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

    console.log("✅ AUTHENTICATED USER:", decoded);

    next();

  } catch (error) {

    console.error(
      "❌ ORDER AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired login token",
    });
  }
};


// ==================================================
// GET USER ID FROM JWT TOKEN
// ==================================================

const getUserId = (req) => {

  if (!req.user) {
    return null;
  }

  return (
    req.user.id ||
    req.user.userId ||
    req.user.user_id ||
    null
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
        "🛒 CHECKOUT REQUEST RECEIVED"
      );

      const userId = getUserId(req);

      console.log(
        "USER ID:",
        userId
      );


      // ==============================================
      // CHECK USER
      // ==============================================

      if (!userId) {

        return res.status(400).json({
          success: false,
          message:
            "User ID not found in login token",
        });

      }


      // ==============================================
      // GET DATABASE CONNECTION
      // ==============================================

      connection =
        await db.getConnection();


      await connection.beginTransaction();


      // ==============================================
      // GET CART ITEMS
      // ==============================================

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

            products.stock

          FROM cart_items

          INNER JOIN products

          ON cart_items.product_id =
             products.id

          WHERE cart_items.user_id = ?
          `,

          [userId]

        );


      console.log(
        "CART ITEMS:",
        cartItems
      );


      // ==============================================
      // CHECK EMPTY CART
      // ==============================================

      if (
        !cartItems ||
        cartItems.length === 0
      ) {

        await connection.rollback();

        return res.status(400).json({
          success: false,
          message:
            "Your cart is empty",
        });

      }


      // ==============================================
      // CALCULATE TOTAL
      // ==============================================

      let total = 0;


      for (const item of cartItems) {

        total +=

          Number(item.price || 0) *

          Number(item.quantity || 0);

      }


      console.log(
        "ORDER TOTAL:",
        total
      );


      // ==============================================
      // CREATE ORDER
      // ==============================================

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


      // ==============================================
      // INSERT ORDER ITEMS
      // ==============================================

      for (const item of cartItems) {

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


        // ============================================
        // UPDATE STOCK
        // ============================================

        await connection.query(

          `
          UPDATE products

          SET stock =
            GREATEST(
              stock - ?,
              0
            )

          WHERE id = ?
          `,

          [
            Number(item.quantity),

            item.product_id,
          ]

        );

      }


      // ==============================================
      // CLEAR CART
      // ==============================================

      await connection.query(

        `
        DELETE FROM cart_items

        WHERE user_id = ?
        `,

        [userId]

      );


      // ==============================================
      // COMMIT
      // ==============================================

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
        "❌ CHECKOUT ERROR"
      );

      console.error(error);

      console.error(
        "================================="
      );


      if (connection) {

        try {

          await connection.rollback();

        } catch (rollbackError) {

          console.error(
            "ROLLBACK ERROR:",
            rollbackError.message
          );

        }

      }


      return res.status(500).json({

        success: false,

        message:
          "Failed to place order",

        error:
          error.message,

      });


    } finally {

      if (connection) {

        connection.release();

      }

    }

  }
);


// ==================================================
// GET MY ORDERS
// IMPORTANT: THIS MUST COME BEFORE "/:orderId"
// ==================================================

router.get(
  "/my-orders",
  authenticateUser,
  async (req, res) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "📦 FETCHING MY ORDERS"
      );


      const userId =
        getUserId(req);


      console.log(
        "USER ID:",
        userId
      );


      // ==============================================
      // CHECK USER ID
      // ==============================================

      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID not found in login token",

        });

      }


      // ==============================================
      // FETCH ORDERS
      // ==============================================

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

          ORDER BY created_at DESC, id DESC
          `,

          [userId]

        );


      console.log(
        "ORDERS FOUND:",
        orders.length
      );


      return res.status(200).json({

        success: true,

        orders:
          Array.isArray(orders)
            ? orders
            : [],

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ GET MY ORDERS ERROR"
      );

      console.error(
        error.message
      );

      console.error(error);

      console.error(
        "================================="
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch orders",

        error:
          error.message,

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

      const userId =
        getUserId(req);


      const orderId =
        Number(req.params.orderId);


      // ==============================================
      // VALIDATE
      // ==============================================

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


      // ==============================================
      // GET ORDER
      // ==============================================

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


      // ==============================================
      // GET ORDER ITEMS
      // ==============================================

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

        order:
          orders[0],

        items,

      });


    } catch (error) {

      console.error(
        "❌ GET SINGLE ORDER ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch order",

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