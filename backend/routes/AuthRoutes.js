const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const db = require("../db");

const router = express.Router();


// ==================================================
// REGISTER
// ==================================================

router.post("/register", async (req, res) => {
  try {

    const {
      name,
      email,
      password
    } = req.body;

    console.log("=================================");
    console.log("REGISTER REQUEST");
    console.log("Name:", name);
    console.log("Email:", email);

    // Validate
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // Check existing user
    const [existingUsers] = await db.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
      `,
      [email.trim()]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      `
      INSERT INTO users
      (
        name,
        email,
        password
      )
      VALUES (?, ?, ?)
      `,
      [
        name.trim(),
        email.trim(),
        hashedPassword
      ]
    );

    console.log(
      "✅ USER CREATED:",
      result.insertId
    );

    console.log("=================================");

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      userId: result.insertId
    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ REGISTER ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});


// ==================================================
// LOGIN
// ==================================================

router.post("/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    console.log("=================================");
    console.log("🔐 LOGIN REQUEST");
    console.log("Email:", email);

    // Validate
    if (!email || !password) {

      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });

    }


    // ==================================================
    // FIND USER
    // ==================================================

    const [users] = await db.query(
      `
      SELECT
        id,
        name,
        email,
        password
      FROM users
      WHERE email = ?
      `,
      [email.trim()]
    );

    console.log(
      "Users found:",
      users.length
    );


    // User doesn't exist
    if (users.length === 0) {

      console.log(
        "❌ USER NOT FOUND"
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }


    const user = users[0];

    console.log(
      "✅ USER FOUND:",
      user.email
    );


    // ==================================================
    // CHECK PASSWORD
    // ==================================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "Password match:",
      passwordMatch
    );


    if (!passwordMatch) {

      console.log(
        "❌ WRONG PASSWORD"
      );

      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });

    }


    // ==================================================
    // CREATE JWT
    // ==================================================

    if (!process.env.JWT_SECRET) {

      console.error(
        "❌ JWT_SECRET IS MISSING"
      );

      return res.status(500).json({
        success: false,
        message: "JWT_SECRET is not configured"
      });

    }


    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );


    console.log(
      "✅ LOGIN SUCCESSFUL"
    );

    console.log(
      "User ID:",
      user.id
    );

    console.log(
      "JWT CREATED"
    );

    console.log("=================================");


    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({

      success: true,

      message: "Login successful",

      token: token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }

    });

  } catch (error) {

    console.error("=================================");
    console.error("❌ LOGIN ERROR");
    console.error("Message:", error.message);
    console.error("Code:", error.code);
    console.error("SQL:", error.sql);
    console.error("Stack:", error.stack);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed"
    });

  }

});


module.exports = router;