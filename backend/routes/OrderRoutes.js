const express = require("express");

const router = express.Router();

const db = require("../db");


// ==================================================
// CHECKOUT
// ==================================================

router.post(
  "/checkout",
  async (req, res) => {

    let connection;

    try {

      console.log(
        "================================="
      );

      console.log(
        "POST /api/orders/checkout"
      );

      console.log(
        "Checkout request received"
      );

      console.log(
        "================================="
      );


      // ==============================================
      // GET USER ID
      // ==============================================

      const { userId } = req.body;


      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID is required",

        });

      }


      // ==============================================
      // DATABASE CONNECTION
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

          ON cart_items.product_id = products.id

          WHERE cart_items.user_id = ?
          `,

          [userId]

        );


      // ==============================================
      // CHECK EMPTY CART
      // ==============================================

      if (
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


      for (
        const item of cartItems
      ) {

        total +=
          Number(item.price) *
          Number(item.quantity);

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
            total,
            "Pending",
          ]

        );


      const orderId =
        orderResult.insertId;


      console.log(
        "✅ Order created:",
        orderId
      );


      // ==============================================
      // INSERT ORDER ITEMS
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

            item.price,

            item.quantity,

            item.emoji ||
              "🥛",

          ]

        );


        // ============================================
        // UPDATE PRODUCT STOCK
        // ============================================

        await connection.query(

          `
          UPDATE products

          SET stock =
            CASE

              WHEN stock >= ?

              THEN stock - ?

              ELSE stock

            END

          WHERE id = ?
          `,

          [
            item.quantity,

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


      // ==============================================
      // COMMIT TRANSACTION
      // ==============================================

      await connection.commit();


      console.log(
        "================================="
      );

      console.log(
        "✅ CHECKOUT SUCCESSFUL"
      );

      console.log(
        "Order ID:",
        orderId
      );

      console.log(
        "Total:",
        total
      );

      console.log(
        "================================="
      );


      return res.status(201).json({

        success: true,

        message:
          "Order placed successfully",

        orderId:

          orderId,

        total:

          total,

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ CHECKOUT ERROR"
      );

      console.error(
        error
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
// GET LOGGED USER ORDERS
// ==================================================

router.get(
  "/user/:userId",
  async (req, res) => {

    try {

      const { userId } =
        req.params;


      const [orders] =
        await db.query(

          `
          SELECT

            id,

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
        "GET USER ORDERS ERROR:",
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
  async (req, res) => {

    try {

      const { orderId } =
        req.params;


      const [orders] =
        await db.query(

          `
          SELECT *

          FROM orders

          WHERE id = ?
          `,

          [orderId]

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

      });

    }

  }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;