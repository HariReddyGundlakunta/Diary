const express = require("express");
const router = express.Router();
const db = require("../db");

// =====================================================
// ADD PRODUCT TO CART
// POST /api/cart
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity = 1,
    } = req.body;

    console.log("ADD TO CART REQUEST:", {
      userId,
      productId,
      quantity,
    });

    // Check required data
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "userId and productId are required",
      });
    }

    // Check product exists
    const [products] = await db.query(
      `
      SELECT id, name, price
      FROM products
      WHERE id = ?
      `,
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Check if product already exists in cart
    const [existing] = await db.query(
      `
      SELECT id, quantity
      FROM cart_items
      WHERE user_id = ?
      AND product_id = ?
      `,
      [userId, productId]
    );

    // Product already in cart
    if (existing.length > 0) {

      await db.query(
        `
        UPDATE cart_items
        SET quantity = quantity + ?
        WHERE id = ?
        `,
        [
          Number(quantity),
          existing[0].id,
        ]
      );

      return res.json({
        success: true,
        message: "Product quantity updated in cart",
      });
    }

    // Product not in cart
    await db.query(
      `
      INSERT INTO cart_items
      (
        user_id,
        product_id,
        quantity
      )
      VALUES (?, ?, ?)
      `,
      [
        userId,
        productId,
        Number(quantity),
      ]
    );

    res.json({
      success: true,
      message: "Product added to cart",
    });

  } catch (error) {

    console.error(
      "ADD TO CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
      error: error.message,
    });
  }
});


// =====================================================
// GET USER CART
// GET /api/cart/:userId
// =====================================================

router.get("/:userId", async (req, res) => {

  try {

    const { userId } = req.params;

    console.log(
      "GET CART FOR USER:",
      userId
    );

    const [items] = await db.query(
      `
      SELECT
        cart_items.id,
        cart_items.user_id,
        cart_items.product_id,
        cart_items.quantity,

        products.name,
        products.price,
        products.unit,
        products.description,
        products.emoji,
        products.image,
        products.stock

      FROM cart_items

      INNER JOIN products
        ON cart_items.product_id = products.id

      WHERE cart_items.user_id = ?

      ORDER BY cart_items.id DESC
      `,
      [userId]
    );

    res.json({
      success: true,
      items: items,
    });

  } catch (error) {

    console.error(
      "GET CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to load cart",
      error: error.message,
    });
  }
});


// =====================================================
// UPDATE QUANTITY
// PUT /api/cart/:cartId
// =====================================================

router.put("/:cartId", async (req, res) => {

  try {

    const { cartId } = req.params;

    const { quantity } = req.body;

    if (
      quantity === undefined ||
      Number(quantity) < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    await db.query(
      `
      UPDATE cart_items
      SET quantity = ?
      WHERE id = ?
      `,
      [
        Number(quantity),
        cartId,
      ]
    );

    res.json({
      success: true,
      message: "Cart updated",
    });

  } catch (error) {

    console.error(
      "UPDATE CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
      error: error.message,
    });
  }
});


// =====================================================
// DELETE CART ITEM
// DELETE /api/cart/:cartId
// =====================================================

router.delete("/:cartId", async (req, res) => {

  try {

    const { cartId } = req.params;

    await db.query(
      `
      DELETE FROM cart_items
      WHERE id = ?
      `,
      [cartId]
    );

    res.json({
      success: true,
      message: "Item removed from cart",
    });

  } catch (error) {

    console.error(
      "DELETE CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to remove item",
      error: error.message,
    });
  }
});


module.exports = router;