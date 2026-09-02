const express = require("express");
const db = require("../db");

const router = express.Router();


// ==========================================
// GET ALL PRODUCTS
// ==========================================

router.get("/", async (req, res) => {
  try {

    console.log("=================================");
    console.log("GETTING PRODUCTS FROM MYSQL");

    const [products] = await db.query(`
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

    console.log(
      "✅ Products found:",
      products.length
    );

    res.status(200).json({
      success: true,
      products,
    });

  } catch (error) {

    console.error("❌ GET PRODUCTS ERROR:");
    console.error(error.message);
    console.error("SQL:", error.sql);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// GET SINGLE PRODUCT
// ==========================================

router.get("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const [products] = await db.query(
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

    if (products.length === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product: products[0],
    });

  } catch (error) {

    console.error(
      "❌ GET PRODUCT ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// ADD PRODUCT
// ==========================================

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

    if (!name || price === undefined) {

      return res.status(400).json({
        success: false,
        message:
          "Product name and price are required",
      });
    }

    const [result] = await db.query(
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
        Number(price),
        unit || "",
        description || "",
        emoji || "🥛",
        image || "",
        Number(stock) || 0,
      ]
    );

    console.log(
      "✅ PRODUCT ADDED:",
      result.insertId
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      productId: result.insertId,
    });

  } catch (error) {

    console.error(
      "❌ ADD PRODUCT ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// UPDATE PRODUCT
// ==========================================

router.put("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const {
      name,
      price,
      unit,
      description,
      emoji,
      image,
      stock,
    } = req.body;

    const [result] = await db.query(
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
        name,
        Number(price),
        unit || "",
        description || "",
        emoji || "🥛",
        image || "",
        Number(stock) || 0,
        id,
      ]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message:
        "Product updated successfully",
    });

  } catch (error) {

    console.error(
      "❌ UPDATE PRODUCT ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


// ==========================================
// DELETE PRODUCT
// ==========================================

router.delete("/:id", async (req, res) => {
  try {

    const id = Number(req.params.id);

    const [result] = await db.query(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [id]
    );

    if (result.affectedRows === 0) {

      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message:
        "Product deleted successfully",
    });

  } catch (error) {

    console.error(
      "❌ DELETE PRODUCT ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


module.exports = router;