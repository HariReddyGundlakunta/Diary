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
// CREATE ORDER
// POST /api/orders
// ==========================================

router.post(
  "/",
  authenticateToken,
  async (req, res) => {

    let connection;

    try {

      console.log("=================================");
      console.log("CREATING ORDER");
      console.log("=================================");


      const userId =
        req.user.id ||
        req.user.userId ||
        req.user.user_id;


      if (!userId) {

        return res.status(400).json({
          success: false,
          message: "User ID not found in token",
        });

      }


      const {
        payment,
        address,
      } = req.body;


      // ==========================================
      // VALIDATE ADDRESS
      // ==========================================

      if (
        !address ||
        !address.name ||
        !address.phone ||
        !address.address ||
        !address.city ||
        !address.pincode
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Please provide complete delivery details",
        });

      }


      // ==========================================
      // GET CART ITEMS
      // ==========================================

      const [cartItems] =
        await db.query(
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

          ON products.id =
          cart_items.product_id

          WHERE cart_items.user_id = ?
          `,
          [userId]
        );


      if (cartItems.length === 0) {

        return res.status(400).json({
          success: false,
          message:
            "Your cart is empty",
        });

      }


      // ==========================================
      // CHECK STOCK AND CALCULATE TOTAL
      // ==========================================

      let total = 0;


      for (const item of cartItems) {

        const quantity =
          Number(item.quantity);


        const price =
          Number(item.price);


        const stock =
          Number(item.stock);


        if (quantity > stock) {

          return res.status(400).json({
            success: false,
            message:
              `${item.name} does not have enough stock`,
          });

        }


        total +=
          price * quantity;

      }


      // ==========================================
      // START TRANSACTION
      // ==========================================

      connection =
        await db.getConnection();


      await connection.beginTransaction();


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
            status,
            order_date
          )

          VALUES (?, ?, ?, NOW())
          `,
          [
            userId,
            total,
            "Confirmed",
          ]
        );


      const orderId =
        orderResult.insertId;


      // ==========================================
      // CREATE ORDER ITEMS
      // ==========================================

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


        // ========================================
        // UPDATE PRODUCT STOCK
        // ========================================

        await connection.query(
          `
          UPDATE products

          SET stock =
          stock - ?

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
      // COMMIT TRANSACTION
      // ==========================================

      await connection.commit();


      console.log(
        "✅ ORDER CREATED:",
        orderId
      );


      return res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        orderId:

          orderId,

        total:

          Number(
            total.toFixed(2)
          ),

        payment:

          payment,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "CREATE ORDER ERROR:"
      );

      console.error(error);

      console.error(
        "================================="
      );


      if (connection) {

        await connection.rollback();

      }


      return res.status(500).json({

        success: false,

        message:
          "Failed to create order",

        error:
          process.env.NODE_ENV ===
          "development"
            ? error.message
            : undefined,

      });


    } finally {

      if (connection) {

        connection.release();

      }

    }

  }
);
// ==========================================
// ADMIN - DASHBOARD STATISTICS
// GET /api/orders/admin/stats
// ==========================================

router.get(
  "/admin/stats",
  authenticateToken,
  async (req, res) => {

    try {

      console.log("📊 ADMIN STATS REQUEST");

      const [productResult] = await db.query(`
        SELECT COUNT(*) AS totalProducts
        FROM products
      `);

      const [orderResult] = await db.query(`
        SELECT COUNT(*) AS totalOrders
        FROM orders
      `);

      const [revenueResult] = await db.query(`
        SELECT COALESCE(SUM(total), 0) AS totalRevenue
        FROM orders
      `);

      const [customerResult] = await db.query(`
        SELECT COUNT(*) AS totalCustomers
        FROM users
        WHERE role != 'admin'
      `);

      return res.status(200).json({

        success: true,

        stats: {

          totalProducts:
            productResult[0].totalProducts,

          totalOrders:
            orderResult[0].totalOrders,

          totalRevenue:
            revenueResult[0].totalRevenue,

          totalCustomers:
            customerResult[0].totalCustomers,

        },

      });

    } catch (error) {

      console.error(
        "ADMIN STATS ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch admin statistics",

      });

    }

  }
);
// ==========================================
// ADMIN - GET ALL ORDERS
// GET /api/orders/admin/all
// ==========================================

router.get(
  "/admin/all",
  authenticateToken,
  async (req, res) => {

    try {

      console.log("📦 ADMIN FETCHING ALL ORDERS");

      const [orders] = await db.query(`
        SELECT
          id,
          user_id,
          total,
          status,
          order_date AS created_at
        FROM orders
        ORDER BY order_date DESC
      `);

      return res.status(200).json({

        success: true,

        orders: orders,

      });

    } catch (error) {

      console.error(
        "ADMIN ORDERS ERROR:",
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