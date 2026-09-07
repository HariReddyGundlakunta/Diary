const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");


// ==================================================
// AUTHENTICATION MIDDLEWARE
// ==================================================

const authenticateUser = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });

    }


    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.substring(7).trim()
        : authHeader.trim();


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });

    }


    if (!process.env.JWT_SECRET) {

      console.error(
        "JWT_SECRET is missing"
      );

      return res.status(500).json({
        success: false,
        message: "Server JWT configuration error",
      });

    }


    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    console.log(
      "DECODED TOKEN:",
      decoded
    );


    req.user = decoded;


    next();


  } catch (error) {

    console.error(
      "AUTHENTICATION ERROR:",
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


  const userId =
    req.user.id ||
    req.user.userId ||
    req.user.user_id ||
    req.user.user?.id ||
    null;


  return userId;

};


// ==================================================
// GET MY ORDERS
// ==================================================

router.get(
  "/my-orders",
  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req);


      console.log(
        "GET MY ORDERS USER ID:",
        userId
      );


      if (!userId) {

        return res.status(400).json({
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

        orders: orders || [],

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

        error:
          error.message,

      });

    }

  }

);


// ==================================================
// CHECKOUT
// ==================================================

router.post(
  "/checkout",
  authenticateUser,

  async (req, res) => {

    let connection = null;

    try {

      // ==============================================
      // GET USER ID
      // ==============================================

      const userId =
        getUserId(req);


      console.log(
        "================================="
      );

      console.log(
        "CHECKOUT REQUEST"
      );

      console.log(
        "USER ID:",
        userId
      );

      console.log(
        "TOKEN USER:",
        req.user
      );

      console.log(
        "================================="
      );


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


      // ==============================================
      // START TRANSACTION
      // ==============================================

      await connection.beginTransaction();


      // ==============================================
      // GET CART ITEMS
      // ==============================================

      const [cartItems] =
        await connection.query(

          `
          SELECT

            cart_items.id AS cart_id,

            cart_items.user_id,

            cart_items.product_id,

            cart_items.quantity,

            products.name,

            products.price,

            products.emoji,

            products.stock

          FROM cart_items

          INNER JOIN products

          ON products.id =
             cart_items.product_id

          WHERE cart_items.user_id = ?

          ORDER BY cart_items.id ASC
          `,

          [userId]

        );


      console.log(
        "CART ITEMS FOUND:",
        cartItems.length
      );


      // ==============================================
      // CHECK CART
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
      // VALIDATE PRODUCTS AND STOCK
      // ==============================================

      for (
        const item of cartItems
      ) {

        const quantity =
          Number(item.quantity);


        const stock =
          Number(item.stock);


        if (
          !item.product_id ||
          quantity <= 0
        ) {

          await connection.rollback();


          return res.status(400).json({

            success: false,

            message:
              `Invalid quantity for ${item.name}`,

          });

        }


        if (
          stock < quantity
        ) {

          await connection.rollback();


          return res.status(400).json({

            success: false,

            message:
              `${item.name} does not have enough stock. Available: ${stock}`,

          });

        }

      }


      // ==============================================
      // CALCULATE TOTAL
      // ==============================================

      let total = 0;


      for (
        const item of cartItems
      ) {

        const price =
          Number(item.price || 0);


        const quantity =
          Number(item.quantity || 0);


        total +=
          price * quantity;

      }


      total =
        Number(total.toFixed(2));


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
        "ORDER CREATED:",
        orderId
      );


      // ==============================================
      // CREATE ORDER ITEMS
      // ==============================================

      for (
        const item of cartItems
      ) {

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

            Number(item.price),

            Number(item.quantity),

            item.emoji || "🥛",

          ]

        );


        // ============================================
        // UPDATE PRODUCT STOCK
        // ============================================

        await connection.query(

          `
          UPDATE products

          SET stock =
            stock - ?

          WHERE id = ?
          AND stock >= ?
          `,

          [

            Number(item.quantity),

            item.product_id,

            Number(item.quantity),

          ]

        );

      }


      // ==============================================
      // CLEAR USER CART
      // ==============================================

      await connection.query(

        `
        DELETE FROM cart_items
        WHERE user_id = ?
        `,

        [userId]

      );


      // ==============================================
      // COMMIT TRANSACTION
      // ==============================================

      await connection.commit();


      console.log(
        "ORDER COMPLETED SUCCESSFULLY"
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
        "CHECKOUT ERROR"
      );

      console.error(
        error.message
      );

      console.error(
        error
      );

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
// GET SINGLE ORDER
// IMPORTANT: KEEP THIS LAST
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


      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID not found in login token",

        });

      }


      if (
        !orderId ||
        !Number.isInteger(orderId)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order ID",

        });

      }


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


      if (
        orders.length === 0
      ) {

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

        order:
          orders[0],

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