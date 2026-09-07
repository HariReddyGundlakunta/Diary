const express = require("express");

const router = express.Router();

const db = require("../db");


// ======================================================
// CHECKOUT / PLACE ORDER
// ======================================================

router.post("/checkout", async (req, res) => {

  let connection;

  try {

    console.log("====================================");
    console.log("🛒 CHECKOUT REQUEST RECEIVED");
    console.log("BODY:", req.body);
    console.log("====================================");


    const {
      userId,
      customerName,
      phone,
      address,
      paymentMethod,
    } = req.body;


    // ==================================================
    // VALIDATE USER
    // ==================================================

    if (!userId) {

      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });

    }


    // ==================================================
    // GET DATABASE CONNECTION
    // ==================================================

    connection = await db.getConnection();


    // ==================================================
    // GET CART ITEMS
    // ==================================================

    const [cartItems] = await connection.query(

      `
      SELECT
        cart.id AS cart_id,
        cart.product_id,
        cart.quantity,
        products.name,
        products.price

      FROM cart

      INNER JOIN products
        ON cart.product_id = products.id

      WHERE cart.user_id = ?
      `,

      [userId]

    );


    // ==================================================
    // CHECK CART
    // ==================================================

    if (!cartItems || cartItems.length === 0) {

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });

    }


    // ==================================================
    // CALCULATE TOTAL
    // ==================================================

    let totalAmount = 0;

    cartItems.forEach((item) => {

      totalAmount +=
        Number(item.price) *
        Number(item.quantity);

    });


    // ==================================================
    // CREATE ORDER
    // ==================================================

    const [orderResult] = await connection.query(

      `
      INSERT INTO orders
      (
        user_id,
        customer_name,
        phone,
        address,
        payment_method,
        total_amount,
        status
      )

      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,

      [
        userId,
        customerName || null,
        phone || null,
        address || null,
        paymentMethod || "Cash on Delivery",
        totalAmount,
        "Pending",
      ]

    );


    const orderId = orderResult.insertId;


    // ==================================================
    // INSERT ORDER ITEMS
    // ==================================================

    for (const item of cartItems) {

      await connection.query(

        `
        INSERT INTO order_items
        (
          order_id,
          product_id,
          product_name,
          price,
          quantity
        )

        VALUES (?, ?, ?, ?, ?)
        `,

        [
          orderId,
          item.product_id,
          item.name,
          item.price,
          item.quantity,
        ]

      );

    }


    // ==================================================
    // CLEAR CART
    // ==================================================

    await connection.query(

      `
      DELETE FROM cart
      WHERE user_id = ?
      `,

      [userId]

    );


    console.log("====================================");
    console.log("✅ ORDER CREATED SUCCESSFULLY");
    console.log("Order ID:", orderId);
    console.log("Total:", totalAmount);
    console.log("====================================");


    return res.status(201).json({

      success: true,

      message: "Order placed successfully",

      orderId,

      totalAmount,

    });


  } catch (error) {

    console.error("====================================");
    console.error("❌ CHECKOUT ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL Message:", error.sqlMessage);
    console.error("SQL State:", error.sqlState);
    console.error("Stack:", error.stack);
    console.error("====================================");


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

});


// ======================================================
// GET USER ORDERS
// ======================================================

router.get("/user/:userId", async (req, res) => {

  try {

    const { userId } = req.params;


    const [orders] = await db.query(

      `
      SELECT *
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
      "❌ FETCH USER ORDERS ERROR:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message: "Failed to fetch orders",

    });

  }

});


// ======================================================
// GET ALL ORDERS FOR ADMIN
// ======================================================

router.get("/admin/all", async (req, res) => {

  try {

    const [orders] = await db.query(

      `
      SELECT *
      FROM orders
      ORDER BY id DESC
      `

    );


    return res.status(200).json({

      success: true,

      orders,

    });


  } catch (error) {

    console.error(
      "❌ ADMIN ORDERS ERROR:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message: "Failed to fetch admin orders",

    });

  }

});


// ======================================================
// ADMIN DASHBOARD STATISTICS
// ======================================================

router.get("/admin/stats", async (req, res) => {

  try {

    // ==============================================
    // TOTAL PRODUCTS
    // ==============================================

    const [productResult] = await db.query(

      `
      SELECT COUNT(*) AS totalProducts
      FROM products
      `

    );


    // ==============================================
    // TOTAL CUSTOMERS
    // ==============================================

    const [customerResult] = await db.query(

      `
      SELECT COUNT(*) AS totalCustomers
      FROM users
      WHERE role != 'admin'
      `

    );


    // ==============================================
    // TOTAL ORDERS
    // ==============================================

    const [orderResult] = await db.query(

      `
      SELECT COUNT(*) AS totalOrders
      FROM orders
      `

    );


    // ==============================================
    // TOTAL REVENUE
    // ==============================================

    const [revenueResult] = await db.query(

      `
      SELECT
        COALESCE(SUM(total_amount), 0)
        AS totalRevenue
      FROM orders
      WHERE status != 'Cancelled'
      `

    );


    return res.status(200).json({

      success: true,

      stats: {

        totalProducts:
          productResult[0].totalProducts,

        totalCustomers:
          customerResult[0].totalCustomers,

        totalOrders:
          orderResult[0].totalOrders,

        totalRevenue:
          revenueResult[0].totalRevenue,

      },

    });


  } catch (error) {

    console.error("====================================");
    console.error("❌ ADMIN STATS ERROR");
    console.error(error.message);
    console.error("====================================");


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

});


// ======================================================
// UPDATE ORDER STATUS
// ======================================================

router.put(
  "/admin/:orderId/status",
  async (req, res) => {

    try {

      const { orderId } = req.params;

      const { status } = req.body;


      if (!status) {

        return res.status(400).json({

          success: false,

          message:
            "Order status is required",

        });

      }


      const allowedStatuses = [

        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",

      ];


      if (!allowedStatuses.includes(status)) {

        return res.status(400).json({

          success: false,

          message: "Invalid order status",

        });

      }


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


      return res.status(200).json({

        success: true,

        message:
          "Order status updated successfully",

      });


    } catch (error) {

      console.error(
        "❌ UPDATE ORDER STATUS ERROR:",
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


// ======================================================
// EXPORT ROUTER
// ======================================================

module.exports = router;