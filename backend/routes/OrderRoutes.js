const express = require("express");
const router = express.Router();
const db = require("../db");

// ======================================================
// GET TABLE COLUMNS
// ======================================================

async function getColumns(tableName) {
  const [rows] = await db.query(
    `
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = ?
    ORDER BY ORDINAL_POSITION
    `,
    [tableName]
  );

  return rows.map((row) => row.COLUMN_NAME);
}

// ======================================================
// FIND COLUMN
// ======================================================

function findColumn(columns, names) {
  return names.find((name) =>
    columns.some(
      (column) =>
        column.toLowerCase() === name.toLowerCase()
    )
  );
}

// ======================================================
// PLACE ORDER
// POST /api/orders
// ======================================================

router.post("/", async (req, res) => {
  let connection;

  try {
    console.log("=================================");
    console.log("PLACE ORDER REQUEST");
    console.log("BODY:", req.body);
    console.log("=================================");

    const { userId, payment, address } = req.body;

    // ====================================================
    // CHECK USER
    // ====================================================

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    // ====================================================
    // GET DATABASE COLUMNS
    // ====================================================

    const ordersColumns =
      await getColumns("orders");

    const orderItemsColumns =
      await getColumns("order_items");

    const cartColumns =
      await getColumns("cart_items");

    const productColumns =
      await getColumns("products");

    console.log("ORDERS:", ordersColumns);
    console.log(
      "ORDER ITEMS:",
      orderItemsColumns
    );
    console.log(
      "CART:",
      cartColumns
    );
    console.log(
      "PRODUCTS:",
      productColumns
    );

    // ====================================================
    // ORDERS COLUMNS
    // ====================================================

    const ordersUserColumn = findColumn(
      ordersColumns,
      [
        "user_id",
        "userid",
        "userId",
        "customer_id",
        "customerId",
      ]
    );

    const ordersTotalColumn = findColumn(
      ordersColumns,
      [
        "total",
        "total_amount",
        "totalAmount",
        "amount",
        "order_total",
      ]
    );

    const ordersPaymentColumn = findColumn(
      ordersColumns,
      [
        "payment",
        "payment_method",
        "paymentMethod",
        "payment_type",
        "paymentType",
      ]
    );

    const ordersStatusColumn = findColumn(
      ordersColumns,
      [
        "status",
        "order_status",
        "orderStatus",
      ]
    );

    const ordersDateColumn = findColumn(
      ordersColumns,
      [
        "order_date",
        "orderDate",
        "date",
      ]
    );

    // ====================================================
    // ORDER ITEMS COLUMNS
    // ====================================================

    const orderItemOrderIdColumn =
      findColumn(
        orderItemsColumns,
        [
          "order_id",
          "orderId",
        ]
      );

    const orderItemProductIdColumn =
      findColumn(
        orderItemsColumns,
        [
          "product_id",
          "productId",
        ]
      );

    // THIS IS THE IMPORTANT FIX
    const orderItemProductNameColumn =
      findColumn(
        orderItemsColumns,
        [
          "product_name",
          "productName",
          "name",
        ]
      );

    const orderItemQuantityColumn =
      findColumn(
        orderItemsColumns,
        [
          "quantity",
          "qty",
        ]
      );

    const orderItemPriceColumn =
      findColumn(
        orderItemsColumns,
        [
          "price",
          "unit_price",
          "unitPrice",
        ]
      );

    const orderItemTotalColumn =
      findColumn(
        orderItemsColumns,
        [
          "total",
          "total_price",
          "totalPrice",
          "subtotal",
        ]
      );

    // ====================================================
    // CART COLUMNS
    // ====================================================

    const cartIdColumn =
      findColumn(
        cartColumns,
        [
          "id",
          "cart_id",
        ]
      );

    const cartUserColumn =
      findColumn(
        cartColumns,
        [
          "user_id",
          "userid",
          "userId",
        ]
      );

    const cartProductColumn =
      findColumn(
        cartColumns,
        [
          "product_id",
          "productId",
        ]
      );

    const cartQuantityColumn =
      findColumn(
        cartColumns,
        [
          "quantity",
          "qty",
        ]
      );

    // ====================================================
    // PRODUCT COLUMNS
    // ====================================================

    const productIdColumn =
      findColumn(
        productColumns,
        [
          "id",
          "product_id",
        ]
      );

    const productNameColumn =
      findColumn(
        productColumns,
        [
          "name",
          "product_name",
          "productName",
        ]
      );

    const productPriceColumn =
      findColumn(
        productColumns,
        [
          "price",
        ]
      );

    const productStockColumn =
      findColumn(
        productColumns,
        [
          "stock",
          "quantity",
        ]
      );

    // ====================================================
    // VALIDATE COLUMNS
    // ====================================================

    if (!ordersUserColumn) {
      throw new Error(
        "user_id column not found in orders table"
      );
    }

    if (!ordersTotalColumn) {
      throw new Error(
        "total column not found in orders table"
      );
    }

    if (!cartUserColumn) {
      throw new Error(
        "user_id column not found in cart_items table"
      );
    }

    if (!cartProductColumn) {
      throw new Error(
        "product_id column not found in cart_items table"
      );
    }

    if (!cartQuantityColumn) {
      throw new Error(
        "quantity column not found in cart_items table"
      );
    }

    if (!productIdColumn) {
      throw new Error(
        "id column not found in products table"
      );
    }

    if (!productNameColumn) {
      throw new Error(
        "name column not found in products table"
      );
    }

    if (!productPriceColumn) {
      throw new Error(
        "price column not found in products table"
      );
    }

    if (!orderItemProductNameColumn) {
      throw new Error(
        "product_name column not found in order_items table"
      );
    }

    // ====================================================
    // GET CART
    // ====================================================

    const cartQuery = `
      SELECT
        c.\`${cartIdColumn || "id"}\` AS cart_id,
        c.\`${cartUserColumn}\` AS user_id,
        c.\`${cartProductColumn}\` AS product_id,
        c.\`${cartQuantityColumn}\` AS quantity,

        p.\`${productIdColumn}\` AS product_id_real,
        p.\`${productNameColumn}\` AS product_name,
        p.\`${productPriceColumn}\` AS product_price
        ${
          productStockColumn
            ? `, p.\`${productStockColumn}\` AS product_stock`
            : ""
        }

      FROM cart_items c

      INNER JOIN products p
        ON c.\`${cartProductColumn}\`
         = p.\`${productIdColumn}\`

      WHERE c.\`${cartUserColumn}\` = ?

      ORDER BY c.\`${cartIdColumn || "id"}\` ASC
    `;

    console.log("CART QUERY:");
    console.log(cartQuery);

    const [cartItems] =
      await db.query(
        cartQuery,
        [userId]
      );

    console.log(
      "CART ITEMS:",
      cartItems
    );

    // ====================================================
    // EMPTY CART
    // ====================================================

    if (
      !cartItems ||
      cartItems.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    // ====================================================
    // CALCULATE TOTAL
    // ====================================================

    let total = 0;

    for (const item of cartItems) {
      const price =
        Number(item.product_price || 0);

      const quantity =
        Number(item.quantity || 0);

      total += price * quantity;
    }

    total = Number(
      total.toFixed(2)
    );

    console.log(
      "ORDER TOTAL:",
      total
    );

    // ====================================================
    // START TRANSACTION
    // ====================================================

    connection =
      await db.getConnection();

    await connection.beginTransaction();

    // ====================================================
    // CREATE ORDER
    // ====================================================

    const orderColumns = [];
    const orderValues = [];

    // USER
    orderColumns.push(
      ordersUserColumn
    );

    orderValues.push(userId);

    // TOTAL
    orderColumns.push(
      ordersTotalColumn
    );

    orderValues.push(total);

    // PAYMENT
    if (ordersPaymentColumn) {
      orderColumns.push(
        ordersPaymentColumn
      );

      orderValues.push(
        payment ||
          "Cash on Delivery"
      );
    }

    // STATUS
    if (ordersStatusColumn) {
      orderColumns.push(
        ordersStatusColumn
      );

      orderValues.push(
        "Confirmed"
      );
    }

    // DATE
    if (ordersDateColumn) {
      orderColumns.push(
        ordersDateColumn
      );

      orderValues.push(
        new Date()
      );
    }

    const orderPlaceholders =
      orderColumns
        .map(() => "?")
        .join(", ");

    const insertOrderQuery = `
      INSERT INTO orders
      (
        ${orderColumns
          .map(
            (column) =>
              `\`${column}\``
          )
          .join(", ")}
      )
      VALUES
      (
        ${orderPlaceholders}
      )
    `;

    console.log(
      "INSERT ORDER:"
    );

    console.log(
      insertOrderQuery
    );

    const [orderResult] =
      await connection.query(
        insertOrderQuery,
        orderValues
      );

    const orderId =
      orderResult.insertId;

    console.log(
      "ORDER ID:",
      orderId
    );

    // ====================================================
    // INSERT ORDER ITEMS
    // ====================================================

    for (const item of cartItems) {

      const price =
        Number(
          item.product_price || 0
        );

      const quantity =
        Number(
          item.quantity || 0
        );

      const itemTotal =
        Number(
          (
            price * quantity
          ).toFixed(2)
        );

      const itemColumns = [];
      const itemValues = [];

      // ORDER ID
      if (orderItemOrderIdColumn) {

        itemColumns.push(
          orderItemOrderIdColumn
        );

        itemValues.push(
          orderId
        );
      }

      // PRODUCT ID
      if (orderItemProductIdColumn) {

        itemColumns.push(
          orderItemProductIdColumn
        );

        itemValues.push(
          item.product_id
        );
      }

      // ================================================
      // PRODUCT NAME - FIX
      // ================================================

      itemColumns.push(
        orderItemProductNameColumn
      );

      itemValues.push(
        item.product_name
      );

      // QUANTITY
      if (orderItemQuantityColumn) {

        itemColumns.push(
          orderItemQuantityColumn
        );

        itemValues.push(
          quantity
        );
      }

      // PRICE
      if (orderItemPriceColumn) {

        itemColumns.push(
          orderItemPriceColumn
        );

        itemValues.push(
          price
        );
      }

      // TOTAL
      if (orderItemTotalColumn) {

        itemColumns.push(
          orderItemTotalColumn
        );

        itemValues.push(
          itemTotal
        );
      }

      const itemPlaceholders =
        itemColumns
          .map(() => "?")
          .join(", ");

      const insertItemQuery = `
        INSERT INTO order_items
        (
          ${itemColumns
            .map(
              (column) =>
                `\`${column}\``
            )
            .join(", ")}
        )
        VALUES
        (
          ${itemPlaceholders}
        )
      `;

      console.log(
        "---------------------------------"
      );

      console.log(
        "ADDING ORDER ITEM"
      );

      console.log(
        "Product:",
        item.product_name
      );

      console.log(
        "Quantity:",
        quantity
      );

      console.log(
        "Price:",
        price
      );

      console.log(
        "Total:",
        itemTotal
      );

      console.log(
        "---------------------------------"
      );

      await connection.query(
        insertItemQuery,
        itemValues
      );
    }

    // ====================================================
    // UPDATE STOCK
    // ====================================================

    if (productStockColumn) {

      for (const item of cartItems) {

        const quantity =
          Number(
            item.quantity || 0
          );

        const updateStockQuery = `
          UPDATE products
          SET
            \`${productStockColumn}\`
            =
            \`${productStockColumn}\` - ?
          WHERE
            \`${productIdColumn}\` = ?
        `;

        await connection.query(
          updateStockQuery,
          [
            quantity,
            item.product_id,
          ]
        );
      }
    }

    // ====================================================
    // CLEAR CART
    // ====================================================

    const deleteCartQuery = `
      DELETE FROM cart_items
      WHERE \`${cartUserColumn}\` = ?
    `;

    await connection.query(
      deleteCartQuery,
      [userId]
    );

    // ====================================================
    // COMMIT
    // ====================================================

    await connection.commit();

    console.log(
      "================================="
    );

    console.log(
      "ORDER PLACED SUCCESSFULLY"
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

    // ====================================================
    // RESPONSE
    // ====================================================

    return res.status(201).json({
      success: true,
      message:
        "Order placed successfully",
      orderId: orderId,
      total: total,
      payment:
        payment ||
        "Cash on Delivery",
      address:
        address || null,
    });

  } catch (error) {

    // ====================================================
    // ROLLBACK
    // ====================================================

    if (connection) {

      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error(
          "ROLLBACK ERROR:",
          rollbackError
        );
      }
    }

    console.error(
      "================================="
    );

    console.error(
      "PLACE ORDER ERROR"
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    console.error(
      "CODE:",
      error.code
    );

    console.error(
      "SQL MESSAGE:",
      error.sqlMessage
    );

    console.error(
      "SQL:",
      error.sql
    );

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to place order",
      error:
        error.message,
      code:
        error.code || null,
    });

  } finally {

    if (connection) {
      connection.release();
    }

  }
});

// ======================================================
// GET USER ORDERS
// GET /api/orders/:userId
// ======================================================

router.get(
  "/:userId",
  async (req, res) => {

    try {

      const { userId } =
        req.params;

      const ordersColumns =
        await getColumns(
          "orders"
        );

      const ordersUserColumn =
        findColumn(
          ordersColumns,
          [
            "user_id",
            "userid",
            "userId",
            "customer_id",
            "customerId",
          ]
        );

      if (!ordersUserColumn) {
        throw new Error(
          "User column not found in orders table"
        );
      }

      const [orders] =
        await db.query(
          `
          SELECT *
          FROM orders
          WHERE \`${ordersUserColumn}\` = ?
          ORDER BY id DESC
          `,
          [userId]
        );

      return res.json({
        success: true,
        orders,
      });

    } catch (error) {

      console.error(
        "GET ORDERS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to get orders",
        error:
          error.message,
      });
    }
  }
);
// ======================================================
// EXPORT
// ======================================================

module.exports = router;