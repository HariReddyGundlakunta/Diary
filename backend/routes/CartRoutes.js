const express = require("express");

const router = express.Router();

const db = require("../db");

const jwt = require("jsonwebtoken");


// ==================================================
// AUTH MIDDLEWARE
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
      "❌ AUTH ERROR:",
      error.message
    );


    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });

  }

};


// ==================================================
// GET USER ID
// ==================================================

const getUserId = (user) => {

  return (
    user.id ||
    user.userId ||
    user.user_id
  );

};


// ==================================================
// ADD PRODUCT TO CART
// POST /api/cart/add
// ==================================================

router.post(
  "/add",
  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req.user);


      const {
        productId,
        quantity,
      } = req.body;


      console.log(
        "================================="
      );

      console.log(
        "🛒 ADD TO CART REQUEST"
      );

      console.log(
        "User ID:",
        userId
      );

      console.log(
        "Product ID:",
        productId
      );

      console.log(
        "Quantity:",
        quantity
      );

      console.log(
        "================================="
      );


      // ==============================================
      // VALIDATE USER
      // ==============================================

      if (!userId) {

        return res.status(401).json({
          success: false,
          message: "User ID not found in token",
        });

      }


      // ==============================================
      // VALIDATE PRODUCT
      // ==============================================

      if (!productId) {

        return res.status(400).json({
          success: false,
          message: "Product ID is required",
        });

      }


      const cartQuantity =
        Number(quantity) > 0
          ? Number(quantity)
          : 1;


      // ==============================================
      // CHECK PRODUCT EXISTS
      // ==============================================

      const [products] =
        await db.query(

          `
          SELECT *
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


      const product =
        products[0];


      // ==============================================
      // CHECK STOCK
      // ==============================================

      if (
        product.stock !== undefined &&
        Number(product.stock) < cartQuantity
      ) {

        return res.status(400).json({
          success: false,
          message: "Insufficient product stock",
        });

      }


      // ==============================================
      // CHECK IF PRODUCT ALREADY EXISTS IN CART
      // ==============================================

      const [existingCartItems] =
        await db.query(

          `
          SELECT *
          FROM cart
          WHERE user_id = ?
          AND product_id = ?
          `,

          [
            userId,
            productId,
          ]

        );


      // ==============================================
      // PRODUCT ALREADY IN CART
      // ==============================================

      if (
        existingCartItems.length > 0
      ) {

        const existingItem =
          existingCartItems[0];


        const newQuantity =
          Number(existingItem.quantity) +
          cartQuantity;


        // Check stock again

        if (
          product.stock !== undefined &&
          newQuantity > Number(product.stock)
        ) {

          return res.status(400).json({
            success: false,
            message:
              "Cannot add more than available stock",
          });

        }


        await db.query(

          `
          UPDATE cart
          SET quantity = ?
          WHERE id = ?
          `,

          [
            newQuantity,
            existingItem.id,
          ]

        );


        return res.status(200).json({

          success: true,

          message:
            "Product quantity updated in cart",

        });

      }


      // ==============================================
      // ADD NEW PRODUCT TO CART
      // ==============================================

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
          userId,
          productId,
          cartQuantity,
        ]

      );


      return res.status(201).json({

        success: true,

        message:
          "Product added to cart successfully",

      });


    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "❌ ADD TO CART ERROR"
      );

      console.error(
        error
      );

      console.error(
        "================================="
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to add product to cart",

        error:
          process.env.NODE_ENV === "production"
            ? undefined
            : error.message,

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
  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req.user);


      const [cartItems] =
        await db.query(

          `
          SELECT

            cart.id AS cart_id,

            cart.quantity,

            products.id AS product_id,

            products.name,

            products.price,

            products.image,

            products.description,

            products.stock,

            products.unit

          FROM cart

          INNER JOIN products

          ON cart.product_id = products.id

          WHERE cart.user_id = ?

          ORDER BY cart.id DESC
          `,

          [userId]

        );


      return res.status(200).json({

        success: true,

        cart:
          cartItems,

      });


    } catch (error) {

      console.error(
        "❌ FETCH CART ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch cart",

      });

    }

  }

);


// ==================================================
// UPDATE CART QUANTITY
// PUT /api/cart/update/:id
// ==================================================

router.put(
  "/update/:id",
  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req.user);


      const cartId =
        req.params.id;


      const {
        quantity,
      } = req.body;


      const newQuantity =
        Number(quantity);


      if (
        !newQuantity ||
        newQuantity < 1
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
            newQuantity,
            cartId,
            userId,
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
// DELETE /api/cart/remove/:id
// ==================================================

router.delete(
  "/remove/:id",
  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req.user);


      const cartId =
        req.params.id;


      const [result] =
        await db.query(

          `
          DELETE FROM cart
          WHERE id = ?
          AND user_id = ?
          `,

          [
            cartId,
            userId,
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
        "❌ REMOVE CART ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to remove cart item",

      });

    }

  }

);


// ==================================================
// CLEAR CART
// DELETE /api/cart/clear
// ==================================================

router.delete(
  "/clear",
  authenticateUser,

  async (req, res) => {

    try {

      const userId =
        getUserId(req.user);


      await db.query(

        `
        DELETE FROM cart
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
        "❌ CLEAR CART ERROR:",
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