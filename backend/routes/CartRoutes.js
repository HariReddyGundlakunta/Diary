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

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please login.",
      });
    }

    const token =
      authHeader.split(" ")[1];

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );

    const userId =
      decoded.userId ||
      decoded.id ||
      decoded.user_id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid user token",
      });
    }

    req.userId = Number(userId);

    next();

  } catch (error) {
    console.error(
      "AUTH ERROR:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token. Please login again.",
    });
  }
};


// ==================================================
// GET LOGGED-IN USER CART
// GET /api/cart
// ==================================================

router.get(
  "/",

  authenticateUser,

  async (req, res) => {
    try {
      const userId = req.userId;

      console.log(
        "================================="
      );

      console.log(
        "GET CART FOR USER:",
        userId
      );

      console.log(
        "================================="
      );


      const [cartItems] =
        await db.query(
          `
          SELECT
            cart_items.id AS cart_id,

            cart_items.user_id,

            cart_items.product_id,

            cart_items.quantity,

            products.name,

            products.price,

            products.unit,

            products.description,

            products.emoji,

            products.image,

            products.stock,

            (
              products.price *
              cart_items.quantity
            ) AS subtotal

          FROM cart_items

          INNER JOIN products

          ON products.id =
          cart_items.product_id

          WHERE cart_items.user_id = ?

          ORDER BY cart_items.id DESC
          `,

          [userId]
        );


      const total =
        cartItems.reduce(
          (sum, item) =>
            sum +
            (
              Number(item.price || 0) *
              Number(item.quantity || 0)
            ),

          0
        );


      return res.status(200).json({
        success: true,

        cartItems,

        // Alternative names for frontend compatibility

        items: cartItems,

        cart: cartItems,

        total:
          Number(total.toFixed(2)),
      });

    } catch (error) {

      console.error(
        "================================="
      );

      console.error(
        "GET CART ERROR:"
      );

      console.error(error);

      console.error(
        "================================="
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to fetch cart",

        error:
          error.message,
      });
    }
  }
);


// ==================================================
// ADD PRODUCT TO CART FUNCTION
// ==================================================

const addToCart = async (
  req,
  res
) => {
  try {

    const userId =
      req.userId;


    // ==================================================
    // SUPPORT BOTH:
    //
    // productId
    // product_id
    // ==================================================

    const productId =
      req.body.productId ||
      req.body.product_id;


    const quantity =
      req.body.quantity || 1;


    console.log(
      "================================="
    );

    console.log(
      "ADD TO CART"
    );

    console.log(
      "USER ID:",
      userId
    );

    console.log(
      "PRODUCT ID:",
      productId
    );

    console.log(
      "QUANTITY:",
      quantity
    );

    console.log(
      "================================="
    );


    // ==================================================
    // VALIDATE PRODUCT ID
    // ==================================================

    const numericProductId =
      Number(productId);


    if (
      !numericProductId ||
      !Number.isInteger(
        numericProductId
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Valid Product ID is required",
      });
    }


    // ==================================================
    // VALIDATE QUANTITY
    // ==================================================

    const productQuantity =
      Number(quantity);


    if (
      !Number.isInteger(
        productQuantity
      ) ||
      productQuantity <= 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Quantity must be greater than zero",
      });
    }


    // ==================================================
    // CHECK PRODUCT
    // ==================================================

    const [products] =
      await db.query(
        `
        SELECT
          id,
          name,
          stock,
          price
        FROM products
        WHERE id = ?
        `,

        [numericProductId]
      );


    if (
      products.length === 0
    ) {
      return res.status(404).json({
        success: false,

        message:
          "Product not found",
      });
    }


    const product =
      products[0];


    // ==================================================
    // CHECK STOCK
    // ==================================================

    const availableStock =
      Number(product.stock || 0);


    if (
      availableStock <= 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "This product is out of stock",
      });
    }


    if (
      productQuantity >
      availableStock
    ) {
      return res.status(400).json({
        success: false,

        message:
          `Only ${availableStock} items are available`,
      });
    }


    // ==================================================
    // CHECK EXISTING CART ITEM
    // ==================================================

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
          numericProductId,
        ]
      );


    // ==================================================
    // PRODUCT ALREADY IN CART
    // ==================================================

    if (
      existingItems.length > 0
    ) {

      const existingItem =
        existingItems[0];


      const newQuantity =
        Number(
          existingItem.quantity
        ) +
        productQuantity;


      // ==================================================
      // CHECK STOCK
      // ==================================================

      if (
        newQuantity >
        availableStock
      ) {
        return res.status(400).json({
          success: false,

          message:
            `Only ${availableStock} items are available in stock`,
        });
      }


      // ==================================================
      // UPDATE QUANTITY
      // ==================================================

      await db.query(
        `
        UPDATE cart_items

        SET quantity = ?

        WHERE id = ?
        AND user_id = ?
        `,

        [
          newQuantity,
          existingItem.id,
          userId,
        ]
      );


      console.log(
        "✅ CART QUANTITY UPDATED"
      );


      return res.status(200).json({
        success: true,

        message:
          "Product quantity updated in cart",
      });
    }


    // ==================================================
    // ADD NEW PRODUCT
    // ==================================================

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
        numericProductId,
        productQuantity,
      ]
    );


    console.log(
      "✅ PRODUCT ADDED TO CART"
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
      "ADD TO CART ERROR:"
    );

    console.error(error);

    console.error(
      "================================="
    );


    return res.status(500).json({
      success: false,

      message:
        "Failed to add product to cart",

      error:
        error.message,
    });
  }
};


// ==================================================
// ADD TO CART
//
// SUPPORT BOTH ROUTES:
//
// POST /api/cart
// POST /api/cart/add
// ==================================================

router.post(
  "/",

  authenticateUser,

  addToCart
);


router.post(
  "/add",

  authenticateUser,

  addToCart
);


// ==================================================
// UPDATE CART QUANTITY
//
// PUT /api/cart/:cartId
// ==================================================

router.put(
  "/:cartId",

  authenticateUser,

  async (req, res) => {
    try {

      const userId =
        req.userId;


      const cartId =
        Number(
          req.params.cartId
        );


      const quantity =
        Number(
          req.body.quantity
        );


      // ==================================================
      // VALIDATION
      // ==================================================

      if (
        !Number.isInteger(cartId) ||
        cartId <= 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid cart item ID",
        });
      }


      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Quantity must be greater than zero",
        });
      }


      // ==================================================
      // GET CART ITEM
      // ==================================================

      const [cartItems] =
        await db.query(
          `
          SELECT
            cart_items.id,

            cart_items.product_id,

            products.stock

          FROM cart_items

          INNER JOIN products

          ON products.id =
          cart_items.product_id

          WHERE cart_items.id = ?

          AND cart_items.user_id = ?
          `,

          [
            cartId,
            userId,
          ]
        );


      if (
        cartItems.length === 0
      ) {
        return res.status(404).json({
          success: false,

          message:
            "Cart item not found",
        });
      }


      const cartItem =
        cartItems[0];


      // ==================================================
      // CHECK STOCK
      // ==================================================

      if (
        quantity >
        Number(cartItem.stock || 0)
      ) {
        return res.status(400).json({
          success: false,

          message:
            `Only ${cartItem.stock} items are available`,
        });
      }


      // ==================================================
      // UPDATE CART
      // ==================================================

      await db.query(
        `
        UPDATE cart_items

        SET quantity = ?

        WHERE id = ?

        AND user_id = ?
        `,

        [
          quantity,
          cartId,
          userId,
        ]
      );


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

        error:
          error.message,
      });
    }
  }
);


// ==================================================
// REMOVE CART ITEM
//
// DELETE /api/cart/:cartId
// ==================================================

router.delete(
  "/:cartId",

  authenticateUser,

  async (req, res) => {
    try {

      const userId =
        req.userId;


      const cartId =
        Number(
          req.params.cartId
        );


      const [result] =
        await db.query(
          `
          DELETE FROM cart_items

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
          "Failed to remove product from cart",

        error:
          error.message,
      });
    }
  }
);


// ==================================================
// CLEAR USER CART
//
// DELETE /api/cart
// ==================================================

router.delete(
  "/",

  authenticateUser,

  async (req, res) => {
    try {

      const userId =
        req.userId;


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

        error:
          error.message,
      });
    }
  }
);
// ==================================================
// EXPORT
// ==================================================

module.exports = router;