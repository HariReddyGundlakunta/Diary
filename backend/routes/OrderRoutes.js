const express = require("express");

const router = express.Router();

const db = require("../db");

const jwt = require("jsonwebtoken");


// ==================================================
// AUTHENTICATION MIDDLEWARE
// ==================================================

const authenticateToken = (req, res, next) => {

  try {

    const authHeader =
      req.headers.authorization;


    if (!authHeader) {

      return res.status(401).json({

        success: false,

        message:
          "Authorization token is required",

      });

    }


    const token =
      authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;


    if (!token) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid authorization token",

      });

    }


    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
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

      message:
        "Invalid or expired token",

    });

  }

};


// ==================================================
// CREATE ORDER
// ==================================================

router.post(
  "/",
  authenticateToken,

  async (req, res) => {

    let connection;


    try {

      const userId =
        req.user.id;


      const {
        items,
        total,
      } = req.body;


      // ==============================================
      // VALIDATION
      // ==============================================

      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Order must contain at least one product",

        });

      }


      // ==============================================
      // DATABASE CONNECTION
      // ==============================================

      connection =
        await db.getConnection();


      await connection.beginTransaction();


      // ==============================================
      // CALCULATE TOTAL
      // ==============================================

      let calculatedTotal = 0;


      const orderItems = [];


      for (const item of items) {

        const productId =
          item.product_id ||
          item.productId ||
          item.id;


        const quantity =
          Number(item.quantity) || 1;


        if (!productId) {

          throw new Error(
            "Product ID is missing"
          );

        }


        // ============================================
        // GET PRODUCT FROM DATABASE
        // ============================================

        const [products] =
          await connection.query(

            `
            SELECT
              id,
              name,
              price,
              emoji,
              stock
            FROM products
            WHERE id = ?
            `,

            [productId]

          );


        if (
          products.length === 0
        ) {

          throw new Error(
            `Product with ID ${productId} not found`
          );

        }


        const product =
          products[0];


        // ============================================
        // STOCK CHECK
        // ============================================

        if (
          Number(product.stock) < quantity
        ) {

          throw new Error(

            `${product.name} does not have enough stock`

          );

        }


        const price =
          Number(product.price);


        const itemTotal =
          price * quantity;


        calculatedTotal +=
          itemTotal;


        orderItems.push({

          productId:
            product.id,

          productName:
            product.name,

          price,

          quantity,

          emoji:
            product.emoji || "🥛",

        });

      }


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

            calculatedTotal,

            "Pending",

          ]

        );


      const orderId =
        orderResult.insertId;


      // ==============================================
      // INSERT ORDER ITEMS
      // ==============================================

      for (
        const item of orderItems
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

            item.productId,

            item.productName,

            item.price,

            item.quantity,

            item.emoji,

          ]

        );


        // ============================================
        // UPDATE STOCK
        // ============================================

        await connection.query(

          `
          UPDATE products
          SET stock = stock - ?
          WHERE id = ?
          `,

          [

            item.quantity,

            item.productId,

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


      await connection.commit();


      console.log(
        "================================="
      );

      console.log(
        "✅ ORDER CREATED"
      );

      console.log(
        "ORDER ID:",
        orderId
      );

      console.log(
        "USER ID:",
        userId
      );

      console.log(
        "================================="
      );


      return res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        orderId,

        total:
          calculatedTotal,

      });


    } catch (error) {

      if (connection) {

        await connection.rollback();

      }


      console.error(
        "================================="
      );

      console.error(
        "❌ CREATE ORDER ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );


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
// GET LOGGED-IN USER'S ORDERS
// ==================================================

router.get(
  "/my-orders",
  authenticateToken,

  async (req, res) => {

    try {

      const userId =
        req.user.id;


      // ==============================================
      // GET ORDERS
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
          ORDER BY created_at DESC
          `,

          [userId]

        );


      // ==============================================
      // GET ITEMS FOR EACH ORDER
      // ==============================================

      for (
        const order of orders
      ) {

        const [items] =
          await db.query(

            `
            SELECT
              id,
              product_id,
              product_name,
              price,
              quantity,
              emoji
            FROM order_items
            WHERE order_id = ?
            ORDER BY id ASC
            `,

            [order.id]

          );


        order.items =
          items;

      }


      return res.status(200).json({

        success: true,

        orders,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ GET MY ORDERS ERROR"
      );

      console.error(
        error
      );

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
// GET USER ORDERS BY USER ID
// ==================================================
// This route supports your CURRENT Orders.js frontend:
// GET /api/orders/:userId
//
// Security check ensures users can ONLY access
// their own orders.
// ==================================================

router.get(
  "/:userId",

  authenticateToken,

  async (req, res) => {

    try {

      const requestedUserId =
        Number(req.params.userId);


      const loggedInUserId =
        Number(req.user.id);


      // ==============================================
      // SECURITY CHECK
      // ==============================================

      if (
        requestedUserId !==
        loggedInUserId
      ) {

        return res.status(403).json({

          success: false,

          message:
            "You are not allowed to view these orders",

        });

      }


      // ==============================================
      // GET ORDERS
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
          ORDER BY created_at DESC
          `,

          [loggedInUserId]

        );


      // ==============================================
      // GET ITEMS
      // ==============================================

      for (
        const order of orders
      ) {

        const [items] =
          await db.query(

            `
            SELECT
              id,
              product_id,
              product_name,
              price,
              quantity,
              emoji
            FROM order_items
            WHERE order_id = ?
            ORDER BY id ASC
            `,

            [order.id]

          );


        order.items =
          items;

      }


      return res.status(200).json({

        success: true,

        orders,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ GET USER ORDERS ERROR"
      );

      console.error(
        error
      );

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
// EXPORT
// ==================================================

module.exports = router;