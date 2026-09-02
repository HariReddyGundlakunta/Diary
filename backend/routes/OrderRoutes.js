const express = require("express");
const db = require("../db");

const router = express.Router();


// ==================================================
// CREATE ORDER
// ==================================================

router.post("/", async (req, res) => {
  let connection;

  try {
    const { userId, total, items } = req.body;

    console.log("=================================");
    console.log("📦 CREATE ORDER");
    console.log("User ID:", userId);
    console.log("Total:", total);
    console.log("Items:", items);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    connection = await db.getConnection();

    await connection.beginTransaction();

    // ------------------------------------------
    // CHECK USER
    // ------------------------------------------

    const [users] = await connection.query(
      "SELECT id FROM users WHERE id = ?",
      [Number(userId)]
    );

    if (users.length === 0) {
      await connection.rollback();

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ------------------------------------------
    // INSERT ORDER
    // ------------------------------------------

    const [orderResult] = await connection.query(
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
        Number(userId),
        Number(total) || 0,
        "Pending",
      ]
    );

    const orderId = orderResult.insertId;

    console.log("✅ Order created:", orderId);

    // ------------------------------------------
    // INSERT ORDER ITEMS
    // ------------------------------------------

    for (const item of items) {

      const productId =
        item.product_id ||
        item.productId ||
        item.id;

      if (!productId) {
        throw new Error(
          "Product ID missing from order item"
        );
      }

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
          Number(productId),
          item.name || "Product",
          Number(item.price) || 0,
          Number(item.quantity) || 1,
          item.emoji || "🥛",
        ]
      );
    }

    console.log("✅ Order items inserted");

    // ------------------------------------------
    // CLEAR CART
    // ------------------------------------------

    await connection.query(
      `
      DELETE FROM cart_items
      WHERE user_id = ?
      `,
      [Number(userId)]
    );

    console.log("✅ Cart cleared");

    // ------------------------------------------
    // COMMIT
    // ------------------------------------------

    await connection.commit();

    console.log("✅ ORDER COMPLETED");
    console.log("=================================");

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      orderId,
    });

  } catch (error) {

    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "Rollback error:",
          rollbackError.message
        );
      }
    }

    console.error("=================================");
    console.error("❌ CREATE ORDER ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
    });

  } finally {

    if (connection) {
      connection.release();
    }
  }
});


// ==================================================
// GET USER ORDERS
// ==================================================

router.get("/:userId", async (req, res) => {

  try {

    const userId = Number(req.params.userId);

    console.log("=================================");
    console.log("📦 GET ORDERS");
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // ------------------------------------------
    // CHECK ORDERS TABLE
    // ------------------------------------------

    const [orders] = await db.query(
      `
      SELECT
        id,
        user_id,
        total,
        status,
        order_date
      FROM orders
      WHERE user_id = ?
      ORDER BY order_date DESC
      `,
      [userId]
    );

    console.log(
      "✅ Orders found:",
      orders.length
    );

    // ------------------------------------------
    // GET ORDER ITEMS
    // ------------------------------------------

    for (const order of orders) {

      const [items] = await db.query(
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

      order.items = items;
    }

    console.log(
      "✅ Orders loaded successfully"
    );

    console.log(
      JSON.stringify(orders, null, 2)
    );

    console.log("=================================");

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ GET ORDERS ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message,
      code: error.code,
    });
  }
});


module.exports = router;