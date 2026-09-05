const express = require("express");

const router = express.Router();

const db = require("../db");


// ==================================================
// GET ALL PRODUCTS
// ==================================================

router.get("/", async (req, res) => {

  try {

    const [products] = await db.query(`
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

    return res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    console.error(
      "GET PRODUCTS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });

  }

});


// ==================================================
// GET SINGLE PRODUCT
// ==================================================

router.get("/:id", async (req, res) => {

  try {

    const productId =
      Number(req.params.id);


    if (!productId) {

      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });

    }


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
        [productId]
      );


    if (products.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    }


    return res.status(200).json({
      success: true,
      product: products[0],
    });

  } catch (error) {

    console.error(
      "GET SINGLE PRODUCT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });

  }

});


// ==================================================
// ADD PRODUCT
// ==================================================

router.post("/", async (req, res) => {

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
          "Price must be a valid number",
      });

    }


    if (
      Number.isNaN(productStock) ||
      productStock < 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Stock must be a valid number",
      });

    }


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


    return res.status(201).json({
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

    return res.status(500).json({
      success: false,
      message:
        "Failed to add product",
      error:
        error.message,
    });

  }

});


// ==================================================
// UPDATE PRODUCT
// ==================================================

router.put("/:id", async (req, res) => {

  try {

    const productId =
      Number(req.params.id);


    const {
      name,
      price,
      unit,
      description,
      emoji,
      image,
      stock,
    } = req.body;


    if (!productId) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID",
      });

    }


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
          "Price must be a valid number",
      });

    }


    if (
      Number.isNaN(productStock) ||
      productStock < 0
    ) {

      return res.status(400).json({
        success: false,
        message:
          "Stock must be a valid number",
      });

    }


    const [result] =
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
          productId,
        ]
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


    return res.status(200).json({
      success: true,
      message:
        "Product updated successfully",
    });

  } catch (error) {

    console.error(
      "UPDATE PRODUCT ERROR:",
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

});


// ==================================================
// DELETE PRODUCT
// ==================================================

router.delete("/:id", async (req, res) => {

  try {

    const productId =
      Number(req.params.id);


    if (!productId) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid product ID",
      });

    }


    const [result] =
      await db.query(
        `
        DELETE FROM products
        WHERE id = ?
        `,
        [productId]
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


    return res.status(200).json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE PRODUCT ERROR:",
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

});


// ==================================================
// EXPORT
// ==================================================

module.exports = router;