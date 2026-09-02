const express = require("express");
const db = require("../db");

const router = express.Router();


// ==================================================
// GET USER CART
// ==================================================

router.get("/:userId", async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    console.log("=================================");
    console.log("🛒 GET CART");
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const [items] = await db.query(
      `
      SELECT
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,

        p.name,
        p.price,
        p.unit,
        p.description,
        p.emoji,
        p.image,
        p.stock

      FROM cart_items c

      INNER JOIN products p
        ON c.product_id = p.id

      WHERE c.user_id = ?

      ORDER BY c.id DESC
      `,
      [userId]
    );

    console.log("Cart items found:", items.length);
    console.log("Cart:", items);
    console.log("=================================");

    res.status(200).json({
      success: true,
      items,
    });

  } catch (error) {
    console.error("=================================");
    console.error("❌ GET CART ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// ADD PRODUCT TO CART
// ==================================================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      productId,
      quantity,
    } = req.body;

    const user = Number(userId);
    const product = Number(productId);
    const qty = Number(quantity) || 1;

    console.log("=================================");
    console.log("🛒 ADD TO CART");
    console.log("User:", user);
    console.log("Product:", product);
    console.log("Quantity:", qty);

    if (!user || !product) {
      return res.status(400).json({
        success: false,
        message: "User ID and Product ID are required",
      });
    }


    // ------------------------------------------
    // CHECK USER
    // ------------------------------------------

    const [users] = await db.query(
      `
      SELECT id
      FROM users
      WHERE id = ?
      `,
      [user]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    // ------------------------------------------
    // CHECK PRODUCT
    // ------------------------------------------

    const [products] = await db.query(
      `
      SELECT
        id,
        name,
        price,
        stock
      FROM products
      WHERE id = ?
      `,
      [product]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    // ------------------------------------------
    // CHECK EXISTING CART ITEM
    // ------------------------------------------

    const [existing] = await db.query(
      `
      SELECT
        id,
        quantity
      FROM cart_items
      WHERE user_id = ?
      AND product_id = ?
      `,
      [user, product]
    );


    if (existing.length > 0) {

      const newQuantity =
        Number(existing[0].quantity) + qty;

      await db.query(
        `
        UPDATE cart_items
        SET quantity = ?
        WHERE id = ?
        `,
        [
          newQuantity,
          existing[0].id,
        ]
      );

      console.log(
        "✅ Existing cart item updated"
      );

    } else {

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
          user,
          product,
          qty,
        ]
      );

      console.log(
        "✅ New cart item inserted"
      );
    }


    // ------------------------------------------
    // VERIFY
    // ------------------------------------------

    const [cartItem] = await db.query(
      `
      SELECT
        c.id,
        c.user_id,
        c.product_id,
        c.quantity,
        p.name,
        p.price,
        p.unit,
        p.description,
        p.emoji,
        p.image,
        p.stock
      FROM cart_items c
      INNER JOIN products p
        ON c.product_id = p.id
      WHERE c.user_id = ?
      AND c.product_id = ?
      `,
      [
        user,
        product,
      ]
    );

    console.log(
      "✅ DATABASE CART ITEM:",
      cartItem[0]
    );

    console.log("=================================");

    res.status(201).json({
      success: true,
      message: "Product added to cart",
      item: cartItem[0],
    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ ADD TO CART ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("=================================");

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// UPDATE CART QUANTITY
// ==================================================

router.put("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);
    const quantity = Number(req.body.quantity);

    if (!id || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart item or quantity",
      });
    }

    const [result] = await db.query(
      `
      UPDATE cart_items
      SET quantity = ?
      WHERE id = ?
      `,
      [
        quantity,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    console.log(
      "✅ CART UPDATED:",
      id,
      quantity
    );

    res.json({
      success: true,
      message: "Cart updated",
    });

  } catch (error) {

    console.error(
      "❌ UPDATE CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==================================================
// DELETE CART ITEM
// ==================================================

router.delete("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const [result] = await db.query(
      `
      DELETE FROM cart_items
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    console.log(
      "✅ CART ITEM DELETED:",
      id
    );

    res.json({
      success: true,
      message: "Cart item removed",
    });

  } catch (error) {

    console.error(
      "❌ DELETE CART ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;