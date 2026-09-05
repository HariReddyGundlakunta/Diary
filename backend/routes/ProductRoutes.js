const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../db");


// ==================================================
// AUTHENTICATE USER
// ==================================================

const authenticateUser = async (req, res, next) => {

  try {

    const authorizationHeader =
      req.headers.authorization;


    // ----------------------------------------------
    // CHECK AUTHORIZATION HEADER
    // ----------------------------------------------

    if (!authorizationHeader) {

      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });

    }


    // Expected:
    //
    // Authorization: Bearer TOKEN

    const token =
      authorizationHeader.startsWith("Bearer ")
        ? authorizationHeader.split(" ")[1]
        : null;


    if (!token) {

      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });

    }


    // ----------------------------------------------
    // VERIFY TOKEN
    // ----------------------------------------------

    const decoded =
      jwt.verify(
        token,
        process.env.JWT_SECRET
      );


    // ----------------------------------------------
    // GET USER ID FROM TOKEN
    // ----------------------------------------------

    const userId =
      decoded.id ||
      decoded.userId ||
      decoded.user_id;


    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "Invalid user token",
      });

    }


    // ----------------------------------------------
    // GET USER FROM DATABASE
    // ----------------------------------------------

    const [users] =
      await db.query(
        `
        SELECT
          id,
          name,
          email,
          role
        FROM users
        WHERE id = ?
        `,
        [userId]
      );


    if (users.length === 0) {

      return res.status(401).json({
        success: false,
        message: "User not found",
      });

    }


    // ----------------------------------------------
    // SAVE USER IN REQUEST
    // ----------------------------------------------

    req.user =
      users[0];


    next();

  } catch (error) {

    console.error(
      "AUTHENTICATION ERROR:",
      error.message
    );


    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {

      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });

    }


    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });

  }

};


// ==================================================
// REQUIRE ADMIN
// ==================================================

const requireAdmin = (
  req,
  res,
  next
) => {

  if (!req.user) {

    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });

  }


  if (
    req.user.role !== "admin"
  ) {

    return res.status(403).json({
      success: false,
      message:
        "Only administrators can perform this operation",
    });

  }


  next();

};


// ==================================================
// FORMAT PRODUCT IMAGE
// ==================================================

const formatProduct = (
  product,
  req
) => {

  let imageUrl =
    product.image || "";


  // ----------------------------------------------
  // NO IMAGE
  // ----------------------------------------------

  if (!imageUrl) {

    return {
      ...product,
      image: "",
    };

  }


  // ----------------------------------------------
  // EXTERNAL IMAGE
  // ----------------------------------------------

  if (
    imageUrl.startsWith("http://") ||
    imageUrl.startsWith("https://")
  ) {

    return {
      ...product,
      image: imageUrl,
    };

  }


  // ----------------------------------------------
  // LOCAL UPLOAD IMAGE
  // ----------------------------------------------

  // Remove /uploads/ if it already exists

  imageUrl =
    imageUrl.replace(
      /^\/uploads\//,
      ""
    );


  const baseUrl =
    `${req.protocol}://${req.get("host")}`;


  return {

    ...product,

    image:
      `${baseUrl}/uploads/${imageUrl}`,

  };

};


// ==================================================
// GET ALL PRODUCTS
// PUBLIC
// ==================================================

router.get(
  "/",

  async (req, res) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "GET /api/products"
      );


      const [products] =
        await db.query(`
          SELECT
            id,
            name,
            price,
            unit,
            description,
            emoji,
            image,
            stock,
            created_at
          FROM products
          ORDER BY id DESC
        `);


      const formattedProducts =
        products.map(
          (product) =>
            formatProduct(
              product,
              req
            )
        );


      console.log(
        "✅ Products found:",
        formattedProducts.length
      );


      return res.status(200).json(
        formattedProducts
      );

    } catch (error) {

      console.error(
        "❌ GET PRODUCTS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch products",

        error:
          error.message,

      });

    }

  }
);


// ==================================================
// GET SINGLE PRODUCT
// PUBLIC
// ==================================================

router.get(
  "/:id",

  async (req, res) => {

    try {

      const { id } =
        req.params;


      const [products] =
        await db.query(
          `
          SELECT
            id,
            name,
            price,
            unit,
            description,
            emoji,
            image,
            stock,
            created_at
          FROM products
          WHERE id = ?
          `,
          [id]
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
        formatProduct(
          products[0],
          req
        );


      return res.status(200).json(
        product
      );

    } catch (error) {

      console.error(
        "❌ GET SINGLE PRODUCT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch product",

        error:
          error.message,

      });

    }

  }
);


// ==================================================
// ADD PRODUCT
// ADMIN ONLY
// ==================================================

router.post(
  "/",

  authenticateUser,

  requireAdmin,

  async (req, res) => {

    try {

      const {

        name,

        price,

        unit,

        description,

        emoji,

        image,

        stock,

      } = req.body;


      // ----------------------------------------------
      // VALIDATION
      // ----------------------------------------------

      if (
        !name ||
        !name.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Product name is required",

        });

      }


      if (
        price === undefined ||
        price === ""
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Product price is required",

        });

      }


      const productPrice =
        Number(price);


      const productStock =
        stock === undefined ||
        stock === ""
          ? 0
          : Number(stock);


      if (
        Number.isNaN(productPrice) ||
        productPrice < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Price must be a valid positive number",

        });

      }


      if (
        Number.isNaN(productStock) ||
        productStock < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Stock must be a valid positive number",

        });

      }


      // ----------------------------------------------
      // INSERT PRODUCT
      // ----------------------------------------------

      const [result] =
        await db.query(
          `
          INSERT INTO products
          (
            name,
            price,
            unit,
            description,
            emoji,
            image,
            stock
          )
          VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [

            name.trim(),

            productPrice,

            unit || "",

            description || "",

            emoji || "🥛",

            image || "",

            productStock,

          ]
        );


      console.log(
        "✅ PRODUCT ADDED BY ADMIN:",
        req.user.email
      );


      return res.status(201).json({

        success: true,

        message:
          "Product added successfully",

        productId:
          result.insertId,

      });

    } catch (error) {

      console.error(
        "❌ ADD PRODUCT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to add product",

        error:
          error.message,

      });

    }

  }
);


// ==================================================
// UPDATE PRODUCT
// ADMIN ONLY
// ==================================================

router.put(
  "/:id",

  authenticateUser,

  requireAdmin,

  async (req, res) => {

    try {

      const { id } =
        req.params;


      const {

        name,

        price,

        unit,

        description,

        emoji,

        image,

        stock,

      } = req.body;


      // ----------------------------------------------
      // CHECK PRODUCT
      // ----------------------------------------------

      const [existingProducts] =
        await db.query(
          `
          SELECT id
          FROM products
          WHERE id = ?
          `,
          [id]
        );


      if (
        existingProducts.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }


      // ----------------------------------------------
      // VALIDATION
      // ----------------------------------------------

      if (
        !name ||
        !name.trim()
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Product name is required",

        });

      }


      const productPrice =
        Number(price);


      const productStock =
        Number(stock);


      if (
        Number.isNaN(productPrice) ||
        productPrice < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Price must be a valid positive number",

        });

      }


      if (
        Number.isNaN(productStock) ||
        productStock < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Stock must be a valid positive number",

        });

      }


      // ----------------------------------------------
      // UPDATE PRODUCT
      // ----------------------------------------------

      await db.query(
        `
        UPDATE products
        SET

          name = ?,

          price = ?,

          unit = ?,

          description = ?,

          emoji = ?,

          image = ?,

          stock = ?

        WHERE id = ?
        `,
        [

          name.trim(),

          productPrice,

          unit || "",

          description || "",

          emoji || "🥛",

          image || "",

          productStock,

          id,

        ]
      );


      console.log(
        "✏️ PRODUCT UPDATED BY ADMIN:",
        req.user.email
      );


      return res.status(200).json({

        success: true,

        message:
          "Product updated successfully",

      });

    } catch (error) {

      console.error(
        "❌ UPDATE PRODUCT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update product",

        error:
          error.message,

      });

    }

  }
);


// ==================================================
// DELETE PRODUCT
// ADMIN ONLY
// ==================================================

router.delete(
  "/:id",

  authenticateUser,

  requireAdmin,

  async (req, res) => {

    try {

      const { id } =
        req.params;


      const [result] =
        await db.query(
          `
          DELETE FROM products
          WHERE id = ?
          `,
          [id]
        );


      if (
        result.affectedRows === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found",

        });

      }


      console.log(
        "🗑️ PRODUCT DELETED BY ADMIN:",
        req.user.email
      );


      return res.status(200).json({

        success: true,

        message:
          "Product deleted successfully",

      });

    } catch (error) {

      console.error(
        "❌ DELETE PRODUCT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete product",

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