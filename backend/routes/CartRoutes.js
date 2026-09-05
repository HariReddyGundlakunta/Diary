const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();
const db = require("../db");

// ==================================================
// AUTHENTICATE USER
// ==================================================

const authenticateUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization token is required",
      });
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7)
      : authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    console.error("AUTH ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired login token",
    });
  }
};


// ==================================================
// GET USER ID FROM TOKEN
// ==================================================

const getUserId = (req) => {
  return (
    req.user?.id ||
    req.user?.userId ||
    req.user?.user_id
  );
};


// ==================================================
// GET CART
// ==================================================

router.get(
  "/",
  authenticateUser,
  async (req, res) => {
    try {

      const userId = getUserId(req);

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User ID not found in login token",
        });
      }

      const [cartItems] = await db.query(
        `
        SELECT
          cart_items.id AS cart_id,
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

      const total = cartItems.reduce(
        (sum, item) => {
          return (
            sum +
            Number(item.price || 0) *
            Number(item.quantity || 0)
          );
        },
        0
      );

      return res.status(200).json({
        success: true,
        cartItems,
        total,
      });

    } catch (error) {

      console.error(
        "GET CART ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch cart",
        error: error.message,
      });
    }
  }
);


// ==================================================
// ADD PRODUCT TO CART
// ==================================================

router.post(
  "/",
  authenticateUser,
  async (req, res) => {

    try {

      const userId = getUserId(req);

      const {
        productId,
        quantity = 1,
      } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "User not found",
        });
      }

      if (
        !productId ||
        Number(productId) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Valid product ID is required",
        });
      }

      const productQuantity =
        Number(quantity) > 0
          ? Number(quantity)
          : 1;


      // ==============================================
      // CHECK PRODUCT
      // ==============================================

      const [products] = await db.query(
        `
        SELECT
          id,
          name,
          stock
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


      // ==============================================
      // CHECK EXISTING CART ITEM
      // ==============================================

      const [existingItems] =
        await db.query(
          `
          SELECT
            id,
            quantity
          FROM cart_items
          WHERE user_id = ?
          AND product_id = ?
          `,
          [
            userId,
            productId,
          ]
        );


      if (existingItems.length > 0) {

        await db.query(
          `
          UPDATE cart_items

          SET quantity =
            quantity + ?

          WHERE user_id = ?
          AND product_id = ?
          `,
          [
            productQuantity,
            userId,
            productId,
          ]
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
            userId,
            productId,
            productQuantity,
          ]
        );
      }


      return res.status(200).json({
        success: true,
        message:
          "Product added to cart successfully",
      });

    } catch (error) {

      console.error(
        "ADD TO CART ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to add product to cart",
        error: error.message,
      });
    }
  }
);


// ==================================================
// UPDATE CART QUANTITY
// ==================================================

router.put(
  "/:productId",
  authenticateUser,
  async (req, res) => {

    try {

      const userId = getUserId(req);

      const productId =
        Number(req.params.productId);

      const quantity =
        Number(req.body.quantity);


      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }


      if (
        !quantity ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Quantity must be at least 1",
        });
      }


      const [result] = await db.query(
        `
        UPDATE cart_items

        SET quantity = ?

        WHERE user_id = ?
        AND product_id = ?
        `,
        [
          quantity,
          userId,
          productId,
        ]
      );


      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }


      return res.status(200).json({
        success: true,
        message:
          "Cart updated successfully",
      });

    } catch (error) {

      console.error(
        "UPDATE CART ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update cart",
      });
    }
  }
);


// ==================================================
// REMOVE CART ITEM
// ==================================================

router.delete(
  "/:productId",
  authenticateUser,
  async (req, res) => {

    try {

      const userId = getUserId(req);

      const productId =
        Number(req.params.productId);


      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID",
        });
      }


      const [result] = await db.query(
        `
        DELETE FROM cart_items

        WHERE user_id = ?
        AND product_id = ?
        `,
        [
          userId,
          productId,
        ]
      );


      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Cart item not found",
        });
      }


      return res.status(200).json({
        success: true,
        message:
          "Product removed from cart",
      });

    } catch (error) {

      console.error(
        "REMOVE CART ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to remove product",
        error: error.message,
      });
    }
  }
);


// ==================================================
// CLEAR CART
// ==================================================

router.delete(
  "/",
  authenticateUser,
  async (req, res) => {

    try {

      const userId = getUserId(req);

      await db.query(
        `
        DELETE FROM cart_items
        WHERE user_id = ?
        `,
        [userId]
      );


      return res.status(200).json({
        success: true,
        message:
          "Cart cleared successfully",
      });

    } catch (error) {

      console.error(
        "CLEAR CART ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to clear cart",
      });
    }
  }
);


// ==================================================
// EXPORT
// ==================================================

module.exports = router;