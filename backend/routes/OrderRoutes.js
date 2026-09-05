const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");


// ==================================================
// AUTHENTICATE USER
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
        ? authHeader.substring(7)
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
      message: "Invalid or expired login token",
    });

  }
};


// ==================================================
// GET USER ID
// ==================================================

const getUserId = (req) => {

  return (
    req.user?.id ||
    req.user?.userId ||
    req.user?.user_id
  );

};


// ==================================================
// CHECK ADMIN
// ==================================================

const requireAdmin = (
  req,
  res,
  next
) => {

  const role =
    String(
      req.user?.role ||
      ""
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


  next();

};


// ==================================================
// ADMIN DASHBOARD STATS
// IMPORTANT:
// THIS ROUTE MUST BE BEFORE /:id
// ==================================================

router.get(
  "/admin/stats",

  authenticateUser,

  requireAdmin,

  async (req, res) => {

    try {

      console.log(
        "📊 ADMIN STATS REQUEST RECEIVED"
      );


      // ==============================================
      // TOTAL PRODUCTS
      // ==============================================

      const [
        productResult
      ] = await db.query(
        `
        SELECT
          COUNT(*) AS totalProducts
        FROM products
        `
      );


      // ==============================================
      // TOTAL ORDERS
      // ==============================================

      const [
        orderResult
      ] = await db.query(
        `
        SELECT
          COUNT(*) AS totalOrders
        FROM orders
        `
      );


      // ==============================================
      // TOTAL CUSTOMERS
      // ==============================================

      const [
        customerResult
      ] = await db.query(
        `
        SELECT
          COUNT(*) AS totalCustomers
        FROM users
        WHERE LOWER(role) != 'admin'
        `
      );


      // ==============================================
      // TOTAL REVENUE
      // ==============================================

      const [
        revenueResult
      ] = await db.query(
        `
        SELECT
          COALESCE(
            SUM(total),
            0
          ) AS totalRevenue
        FROM orders
        `
      );


      // ==============================================
      // RECENT ORDERS
      // ==============================================

      const [
        recentOrders
      ] = await db.query(
        `
        SELECT
          orders.id,
          orders.user_id,
          orders.total,
          orders.status,
          orders.created_at,

          users.name AS customer_name,
          users.email AS customer_email

        FROM orders

        LEFT JOIN users
          ON orders.user_id = users.id

        ORDER BY
          orders.created_at DESC

        LIMIT 5
        `
      );


      const stats = {

        totalProducts:
          Number(
            productResult[0]
              ?.totalProducts || 0
          ),

        totalOrders:
          Number(
            orderResult[0]
              ?.totalOrders || 0
          ),

        totalCustomers:
          Number(
            customerResult[0]
              ?.totalCustomers || 0
          ),

        totalRevenue:
          Number(
            revenueResult[0]
              ?.totalRevenue || 0
          ),

      };


      console.log(
        "✅ ADMIN STATS:",
        stats
      );


      return res.status(200).json({

        success: true,

        stats,

        recentOrders,

      });

    } catch (error) {

      console.error(
        "❌ ADMIN STATS ERROR:",
        error.message
      );


      console.error(error);


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch admin statistics",

        error:
          error.message,

      });

    }

  }
);


// ==================================================
// GET ALL ORDERS FOR ADMIN
// ==================================================

router.get(
  "/admin/all",

  authenticateUser,

  requireAdmin,

  async (req, res) => {

    try {

      const [orders] =
        await db.query(
          `
          SELECT

            orders.id,
            orders.user_id,
            orders.total,
            orders.status,
            orders.created_at,

            users.name AS customer_name,
            users.email AS customer_email

          FROM orders

          LEFT JOIN users
            ON orders.user_id = users.id

          ORDER BY
            orders.created_at DESC
          `
        );


      return res.status(200).json({

        success: true,

        orders,

      });

    } catch (error) {

      console.error(
        "GET ADMIN ORDERS ERROR:",
        error.message
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
// GET MY ORDERS
// ==================================================

router.get(
  "/my-orders",

  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(401).json({

          success: false,

          message:
            "User ID not found in login token",

        });

      }


      console.log(
        "📦 FETCHING ORDERS FOR USER:",
        userId
      );


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

          ORDER BY
            created_at DESC
          `,
          [userId]
        );


      return res.status(200).json({

        success: true,

        orders,

      });

    } catch (error) {

      console.error(
        "❌ MY ORDERS ERROR:",
        error.message
      );


      console.error(error);


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

    let connection;

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(401).json({

          success: false,

          message:
            "User ID not found",

        });

      }


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

            cart_items.id,
            cart_items.product_id,
            cart_items.quantity,

            products.name,
            products.price,
            products.stock

          FROM cart_items

          INNER JOIN products

            ON cart_items.product_id =
               products.id

          WHERE
            cart_items.user_id = ?
          `,
          [userId]
        );


      if (
        cartItems.length === 0
      ) {

        await connection.rollback();

        connection.release();


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


      for (
        const item of cartItems
      ) {

        const price =
          Number(item.price || 0);

        const quantity =
          Number(item.quantity || 0);


        total +=
          price * quantity;


        // ============================================
        // CHECK STOCK
        // ============================================

        if (
          Number(item.stock) <
          quantity
        ) {

          await connection.rollback();

          connection.release();


          return res.status(400).json({

            success: false,

            message:
              `${item.name} does not have enough stock`,

          });

        }

      }


      // ==============================================
      // CREATE ORDER
      // ==============================================

      const [
        orderResult
      ] = await connection.query(
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
          ?
        )
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


        // ============================================
        // UPDATE PRODUCT STOCK
        // ============================================

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


      await connection.commit();

      connection.release();


      console.log(
        "✅ ORDER CREATED:",
        orderId
      );


      return res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        order: {

          id:
            orderId,

          total,

          status:
            "Pending",

        },

      });

    } catch (error) {

      console.error(
        "❌ CHECKOUT ERROR:",
        error
      );


      if (connection) {

        try {

          await connection.rollback();

          connection.release();

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

    }

  }
);


// ==================================================
// UPDATE ORDER STATUS
// ==================================================

router.put(
  "/admin/:orderId/status",

  authenticateUser,

  requireAdmin,

  async (req, res) => {

    try {

      const orderId =
        Number(
          req.params.orderId
        );


      const status =
        req.body.status;


      if (!orderId) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order ID",

        });

      }


      const allowedStatuses = [

        "Pending",

        "Processing",

        "Shipped",

        "Delivered",

        "Cancelled",

      ];


      if (
        !allowedStatuses.includes(
          status
        )
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
            orderId,
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
          "Failed to update order",

      });

    }

  }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;