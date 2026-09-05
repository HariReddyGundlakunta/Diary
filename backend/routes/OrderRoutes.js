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
        ? authHeader.split(" ")[1]
        : authHeader;


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
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
      "AUTH ERROR:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

};


// ==================================================
// GET MY ORDERS
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
        "📦 FETCHING USER ORDERS"
      );

      console.log(
        "Logged in user:",
        req.user
      );

      console.log(
        "================================="
      );


      const userId =
        req.user.id ||
        req.user.userId;


      if (!userId) {

        return res.status(400).json({
          success: false,
          message:
            "User ID not found in authentication token",
        });

      }


      // ==========================================
      // FETCH ORDERS
      // ==========================================

      const [orders] =
        await db.query(

          `
          SELECT
            o.id,
            o.user_id,
            o.status,
            o.total,
            o.order_date AS created_at
          FROM orders o
          WHERE o.user_id = ?
          ORDER BY o.order_date DESC
          `,

          [userId]

        );


      console.log(
        "Orders found:",
        orders.length
      );


      // ==========================================
      // FETCH ITEMS FOR EACH ORDER
      // ==========================================

      for (
        let i = 0;
        i < orders.length;
        i++
      ) {

        try {

          const [items] =
            await db.query(

              `
              SELECT
                oi.id,
                oi.product_id,
                oi.quantity,
                oi.price,

                p.name,
                p.image

              FROM order_items oi

              LEFT JOIN products p
              ON oi.product_id = p.id

              WHERE oi.order_id = ?
              `,

              [orders[i].id]

            );


          orders[i].items =
            items || [];


        } catch (itemError) {

          console.error(
            "ORDER ITEMS ERROR:",
            itemError.message
          );


          // Still return the order
          orders[i].items = [];

        }

      }


      return res.status(200).json({

        success: true,

        orders: orders,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ FETCH MY ORDERS ERROR"
      );

      console.error(
        "Message:",
        error.message
      );

      console.error(
        "Stack:",
        error.stack
      );

      console.error(
        "================================="
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch orders",

        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.message,

      });

    }

  }
);


// ==================================================
// ADMIN STATISTICS
// IMPORTANT: THIS ROUTE MUST COME BEFORE /:id
// ==================================================

router.get(
  "/admin/stats",
  authenticateUser,
  async (req, res) => {

    try {

      const role =
        String(
          req.user.role || ""
        )
          .trim()
          .toLowerCase();


      if (role !== "admin") {

        return res.status(403).json({
          success: false,
          message:
            "Admin access required",
        });

      }


      // ==========================================
      // TOTAL PRODUCTS
      // ==========================================

      const [[productResult]] =
        await db.query(

          `
          SELECT
            COUNT(*) AS totalProducts
          FROM products
          `

        );


      // ==========================================
      // TOTAL ORDERS
      // ==========================================

      const [[orderResult]] =
        await db.query(

          `
          SELECT
            COUNT(*) AS totalOrders
          FROM orders
          `

        );


      // ==========================================
      // TOTAL CUSTOMERS
      // ==========================================

      const [[customerResult]] =
        await db.query(

          `
          SELECT
            COUNT(*) AS totalCustomers
          FROM users
          WHERE LOWER(role) != 'admin'
          `

        );


      // ==========================================
      // TOTAL REVENUE
      // ==========================================

      const [[revenueResult]] =
        await db.query(

          `
          SELECT
            COALESCE(
              SUM(total),
              0
            ) AS totalRevenue
          FROM orders
          WHERE LOWER(status) != 'cancelled'
          `

        );


      // ==========================================
      // RECENT ORDERS
      // ==========================================

      const [recentOrders] =
        await db.query(

          `
          SELECT
            o.id,
            o.user_id,
            o.status,
            o.total,
            o.order_date,

            u.name AS customer_name

          FROM orders o

          LEFT JOIN users u
          ON o.user_id = u.id

          ORDER BY o.order_date DESC

          LIMIT 5
          `

        );


      return res.status(200).json({

        success: true,

        stats: {

          totalProducts:
            Number(
              productResult.totalProducts || 0
            ),

          totalOrders:
            Number(
              orderResult.totalOrders || 0
            ),

          totalCustomers:
            Number(
              customerResult.totalCustomers || 0
            ),

          totalRevenue:
            Number(
              revenueResult.totalRevenue || 0
            ),

        },

        recentOrders,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ ADMIN STATS ERROR"
      );

      console.error(
        error.message
      );

      console.error(
        error.stack
      );

      console.error(
        "================================="
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch admin statistics",

        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.message,

      });

    }

  }
);


// ==================================================
// ADMIN GET ALL ORDERS
// ==================================================

router.get(
  "/admin/all",
  authenticateUser,
  async (req, res) => {

    try {

      const role =
        String(
          req.user.role || ""
        )
          .trim()
          .toLowerCase();


      if (role !== "admin") {

        return res.status(403).json({
          success: false,
          message:
            "Admin access required",
        });

      }


      const [orders] =
        await db.query(

          `
          SELECT
            o.id,
            o.user_id,
            o.status,
            o.total,
            o.order_date,

            u.name AS customer_name,
            u.email AS customer_email

          FROM orders o

          LEFT JOIN users u
          ON o.user_id = u.id

          ORDER BY o.order_date DESC
          `

        );


      return res.status(200).json({

        success: true,

        orders,

      });


    } catch (error) {

      console.error(
        "ADMIN ORDERS ERROR:",
        error.message
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch admin orders",

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

    let connection;


    try {

      const userId =
        req.user.id ||
        req.user.userId;


      if (!userId) {

        return res.status(400).json({
          success: false,
          message:
            "User ID is required",
        });

      }


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
            c.id AS cart_id,
            c.product_id,
            c.quantity,

            p.name,
            p.price,
            p.stock

          FROM cart c

          INNER JOIN products p
          ON c.product_id = p.id

          WHERE c.user_id = ?
          `,

          [userId]

        );


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


      // ==========================================
      // CALCULATE TOTAL
      // ==========================================

      let total = 0;


      for (const item of cartItems) {

        const price =
          Number(item.price || 0);

        const quantity =
          Number(item.quantity || 0);


        total +=
          price * quantity;


        if (
          Number(item.stock) < quantity
        ) {

          await connection.rollback();


          return res.status(400).json({

            success: false,

            message:
              `Insufficient stock for ${item.name}`,

          });

        }

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
          VALUES
          (
            ?,
            ?,
            'Pending'
          )
          `,

          [
            userId,
            total,
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
            quantity,
            price
          )
          VALUES
          (
            ?,
            ?,
            ?,
            ?
          )
          `,

          [

            orderId,

            item.product_id,

            item.quantity,

            item.price,

          ]

        );


        // ========================================
        // UPDATE PRODUCT STOCK
        // ========================================

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
        DELETE FROM cart
        WHERE user_id = ?
        `,

        [userId]

      );


      await connection.commit();


      return res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        orderId,

        total,

      });


    } catch (error) {

      if (connection) {

        await connection.rollback();

      }


      console.error(
        "================================="
      );

      console.error(
        "❌ CHECKOUT ERROR"
      );

      console.error(
        error.message
      );

      console.error(
        error.stack
      );

      console.error(
        "================================="
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to place order",

        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.message,

      });


    } finally {

      if (connection) {

        connection.release();

      }

    }

  }
);


// ==================================================
// UPDATE ORDER STATUS - ADMIN
// ==================================================

router.put(
  "/:id/status",
  authenticateUser,
  async (req, res) => {

    try {

      const role =
        String(
          req.user.role || ""
        )
          .trim()
          .toLowerCase();


      if (role !== "admin") {

        return res.status(403).json({

          success: false,

          message:
            "Admin access required",

        });

      }


      const {
        status,
      } = req.body;


      const allowedStatuses = [

        "Pending",

        "Processing",

        "Shipped",

        "Delivered",

        "Cancelled",

      ];


      if (
        !allowedStatuses.includes(status)
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order status",

        });

      }


      const [result] =
        await db.query(

          `
          UPDATE orders
          SET status = ?
          WHERE id = ?
          `,

          [

            status,

            req.params.id,

          ]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found",

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Order status updated successfully",

      });


    } catch (error) {

      console.error(
        "UPDATE ORDER ERROR:",
        error.message
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update order status",

      });

    }

  }
);
module.exports = router;