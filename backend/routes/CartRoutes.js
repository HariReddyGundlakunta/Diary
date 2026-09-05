const express = require("express");

const router = express.Router();

const db = require("../db");

const jwt = require("jsonwebtoken");


// ==================================================
// AUTHENTICATION MIDDLEWARE
// ==================================================

const authenticateToken = (req, res, next) => {

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


    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    req.user = decoded;


    next();

  } catch (error) {

    console.error(
      "❌ AUTHENTICATION ERROR:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

};


// ==================================================
// GET USER ID SAFELY
// ==================================================

const getUserId = (req) => {

  return (
    req.user?.id ||
    req.user?.userId ||
    req.user?.user_id ||
    null
  );

};


// ==================================================
// ADD PRODUCT TO CART
// POST /api/cart/add
// ==================================================

router.post(
  "/add",
  authenticateToken,

  async (req, res) => {

    try {

      console.log("=================================");
      console.log("🛒 ADD TO CART REQUEST");
      console.log("USER:", req.user);
      console.log("BODY:", req.body);
      console.log("=================================");


      const userId =
        getUserId(req);


      // Accept different frontend formats

      const productId =
        req.body.product_id ||
        req.body.productId ||
        req.body.id;


      const quantity =
        Number(req.body.quantity || 1);


      // ================================================
      // VALIDATE USER
      // ================================================

      if (!userId) {

        return res.status(400).json({
          success: false,
          message:
            "User ID was not found in authentication token",
        });

      }


      // ================================================
      // VALIDATE PRODUCT
      // ================================================

      if (
        !productId ||
        Number(productId) <= 0
      ) {

        return res.status(400).json({
          success: false,
          message: "Valid product ID is required",
        });

      }


      // ================================================
      // VALIDATE QUANTITY
      // ================================================

      if (
        !Number.isFinite(quantity) ||
        quantity <= 0
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Quantity must be greater than zero",
        });

      }


      // ================================================
      // CHECK PRODUCT EXISTS
      // ================================================

      const [products] =
        await db.query(

          `
          SELECT id, name, price
          FROM products
          WHERE id = ?
          `,

          [
            Number(productId),
          ]

        );


      if (products.length === 0) {

        return res.status(404).json({
          success: false,
          message: "Product not found",
        });

      }


      // ================================================
      // CHECK EXISTING CART ITEM
      // ================================================

      const [existingItems] =
        await db.query(

          `
          SELECT id, quantity
          FROM cart
          WHERE user_id = ?
          AND product_id = ?
          `,

          [
            Number(userId),
            Number(productId),
          ]

        );


      // ================================================
      // UPDATE EXISTING ITEM
      // ================================================

      if (existingItems.length > 0) {

        const existingItem =
          existingItems[0];


        const newQuantity =
          Number(existingItem.quantity) +
          quantity;


        await db.query(

          `
          UPDATE cart
          SET quantity = ?
          WHERE id = ?
          AND user_id = ?
          `,

          [
            newQuantity,
            existingItem.id,
            Number(userId),
          ]

        );


        return res.status(200).json({

          success: true,

          message:
            "Cart quantity updated successfully",

        });

      }


      // ================================================
      // ADD NEW ITEM
      // ================================================

      const [result] =
        await db.query(

          `
          INSERT INTO cart
          (
            user_id,
            product_id,
            quantity
          )
          VALUES (?, ?, ?)
          `,

          [
            Number(userId),
            Number(productId),
            quantity,
          ]

        );


      return res.status(201).json({

        success: true,

        message:
          "Product added to cart successfully",

        cartId:
          result.insertId,

      });


    } catch (error) {

      console.error("=================================");
      console.error("❌ ADD TO CART ERROR");
      console.error("MESSAGE:", error.message);
      console.error("CODE:", error.code);
      console.error("SQL MESSAGE:", error.sqlMessage);
      console.error("=================================");


      return res.status(500).json({

        success: false,

        message:
          error.sqlMessage ||
          error.message ||
          "Failed to add product to cart",

      });

    }

  }

);


// ==================================================
// GET USER CART
// GET /api/cart
// ==================================================

router.get(
  "/",
  authenticateToken,

  async (req, res) => {

    try {

      console.log("=================================");
      console.log("🛒 FETCH CART REQUEST");


      const userId =
        getUserId(req);


      console.log(
        "USER ID:",
        userId
      );


      if (!userId) {

        return res.status(400).json({

          success: false,

          message:
            "User ID was not found in authentication token",

        });

      }


      // ================================================
      // FETCH CART WITH PRODUCT DETAILS
      // ================================================

      const [cartItems] =
        await db.query(

          `
          SELECT

            cart.id AS cart_id,

            cart.product_id,

            cart.quantity,

            products.name,

            products.price,

            products.image

          FROM cart

          LEFT JOIN products

            ON cart.product_id = products.id

          WHERE cart.user_id = ?

          ORDER BY cart.id DESC
          `,

          [
            Number(userId),
          ]

        );


      return res.status(200).json({

        success: true,

        cart:
          cartItems,

      });


    } catch (error) {

      console.error("=================================");
      console.error("❌ FETCH CART ERROR");
      console.error("MESSAGE:", error.message);
      console.error("CODE:", error.code);
      console.error("SQL MESSAGE:", error.sqlMessage);
      console.error("=================================");


      return res.status(500).json({

        success: false,

        message:
          error.sqlMessage ||
          error.message ||
          "Failed to fetch cart",

      });

    }

  }

);


// ==================================================
// UPDATE CART QUANTITY
// PUT /api/cart/:id
// ==================================================

router.put(
  "/:id",
  authenticateToken,

  async (req, res) => {

    try {

      const userId =
        getUserId(req);


      const cartId =
        Number(req.params.id);


      const quantity =
        Number(req.body.quantity);


      if (!userId) {

        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });

      }


      if (
        !cartId ||
        cartId <= 0
      ) {

        return res.status(400).json({
          success: false,
          message: "Invalid cart ID",
        });

      }


      if (
        !Number.isFinite(quantity) ||
        quantity < 1
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Quantity must be at least 1",
        });

      }


      const [result] =
        await db.query(

          `
          UPDATE cart

          SET quantity = ?

          WHERE id = ?

          AND user_id = ?
          `,

          [
            quantity,
            cartId,
            Number(userId),
          ]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Cart item not found",

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Cart updated successfully",

      });


    } catch (error) {

      console.error(
        "❌ UPDATE CART ERROR:",
        error.message
      );


      return res.status(500).json({

        success: false,

        message:
          error.sqlMessage ||
          error.message ||
          "Failed to update cart",

      });

    }

  }

);


// ==================================================
// REMOVE CART ITEM
// DELETE /api/cart/:id
// ==================================================

router.delete(
  "/:id",
  authenticateToken,

  async (req, res) => {

    try {

      const userId =
        getUserId(req);


      const cartId =
        Number(req.params.id);


      if (!userId) {

        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });

      }


      const [result] =
        await db.query(

          `
          DELETE FROM cart

          WHERE id = ?

          AND user_id = ?
          `,

          [
            cartId,
            Number(userId),
          ]

        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Cart item not found",

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Cart item removed successfully",

      });


    } catch (error) {

      console.error(
        "❌ DELETE CART ERROR:",
        error.message
      );


      return res.status(500).json({

        success: false,

        message:
          error.sqlMessage ||
          error.message ||
          "Failed to remove cart item",

      });

    }

  }

);


// ==================================================
// CLEAR USER CART
// DELETE /api/cart
// ==================================================

router.delete(
  "/",
  authenticateToken,

  async (req, res) => {

    try {

      const userId =
        getUserId(req);


      if (!userId) {

        return res.status(400).json({
          success: false,
          message: "User ID not found",
        });

      }


      await db.query(

        `
        DELETE FROM cart
        WHERE user_id = ?
        `,

        [
          Number(userId),
        ]

      );


      return res.status(200).json({

        success: true,

        message:
          "Cart cleared successfully",

      });


    } catch (error) {

      console.error(
        "❌ CLEAR CART ERROR:",
        error.message
      );


      return res.status(500).json({

        success: false,

        message:
          error.sqlMessage ||
          error.message ||
          "Failed to clear cart",

      });

    }

  }

);


// ==================================================
// EXPORT ROUTER
// ==================================================

module.exports = router;