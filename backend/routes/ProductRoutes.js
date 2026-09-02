const express = require("express");

const router = express.Router();

const db = require("../db");

// ==================================================
// GET ALL PRODUCTS
// ==================================================

router.get("/", async (req, res) => {

  try {

    console.log(
      "================================="
    );

    console.log(
      "GET /api/products"
    );

    console.log(
      "Getting products from database..."
    );

    console.log(
      "================================="
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
          stock
        FROM products
        ORDER BY id DESC
      `);

    console.log(
      "Products found:",
      products.length
    );

    res.status(200).json(
      products
    );

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "GET PRODUCTS ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch products",
      error:
        error.message,
    });

  }

});

// ==================================================
// GET SINGLE PRODUCT
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
            stock
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

      res.status(200).json(
        products[0]
      );

    } catch (error) {

      console.error(
        "GET SINGLE PRODUCT ERROR:",
        error
      );

      res.status(500).json({
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
// ==================================================

router.post(
  "/",
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

      // ------------------------------------------
      // VALIDATION
      // ------------------------------------------

      if (
        !name ||
        price === undefined ||
        price === ""
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Product name and price are required",
        });

      }

      // ------------------------------------------
      // CONVERT VALUES
      // ------------------------------------------

      const productPrice =
        Number(price);

      const productStock =
        stock === undefined ||
        stock === ""
          ? 0
          : Number(stock);

      if (
        Number.isNaN(productPrice)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Price must be a valid number",
        });

      }

      if (
        Number.isNaN(productStock)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Stock must be a valid number",
        });

      }

      // ------------------------------------------
      // INSERT PRODUCT
      // ------------------------------------------

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
        "Product added:",
        result.insertId
      );

      // ------------------------------------------
      // RESPONSE
      // ------------------------------------------

      res.status(201).json({

        success: true,

        message:
          "Product added successfully",

        productId:
          result.insertId,

      });

    } catch (error) {

      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      res.status(500).json({

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
// EXPORT
// ==================================================

module.exports = router;