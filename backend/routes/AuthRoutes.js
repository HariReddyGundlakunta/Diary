const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();


// ======================================================
// REGISTER
// ======================================================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    console.log("=================================");
    console.log("REGISTER REQUEST");
    console.log("Email:", email);

    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check confirm password
    if (
      confirmPassword !== undefined &&
      password !== confirmPassword
    ) {
      return res.status(400).json({
        message: "Passwords do not match",
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    // Check if email already exists
    const [existingUsers] = await db.execute(
      `SELECT id
       FROM users
       WHERE LOWER(TRIM(email)) = ?
       LIMIT 1`,
      [cleanEmail]
    );

    if (existingUsers.length > 0) {
      console.log("❌ EMAIL ALREADY EXISTS");

      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    console.log("Password hashed successfully");

    // Default role
    const role = "user";

    // Insert user
    const [result] = await db.execute(
      `INSERT INTO users
       (name, email, password, role)
       VALUES (?, ?, ?, ?)`,
      [
        cleanName,
        cleanEmail,
        hashedPassword,
        role,
      ]
    );

    console.log(
      "✅ USER REGISTERED:",
      result.insertId
    );

    console.log("=================================");

    return res.status(201).json({
      message: "Registration successful",
      user: {
        id: result.insertId,
        name: cleanName,
        email: cleanEmail,
        role,
      },
    });

  } catch (error) {
    console.error("❌ REGISTER ERROR:");
    console.error(error);

    return res.status(500).json({
      message: "Server error during registration",
      error: error.message,
    });
  }
});


// ======================================================
// LOGIN
// ======================================================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log(
      "Password provided:",
      !!password
    );

    // Check input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const cleanEmail = email
      .trim()
      .toLowerCase();

    console.log(
      "Searching user:",
      cleanEmail
    );

    // Find user
    const [users] = await db.execute(
      `SELECT
        id,
        name,
        email,
        password,
        role
       FROM users
       WHERE LOWER(TRIM(email)) = ?
       LIMIT 1`,
      [cleanEmail]
    );

    console.log(
      "USER FOUND:",
      users.length
    );

    // User doesn't exist
    if (users.length === 0) {
      console.log("❌ USER NOT FOUND");

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    console.log(
      "User ID:",
      user.id
    );

    console.log(
      "User email:",
      user.email
    );

    console.log(
      "User role:",
      user.role
    );

    // Check password exists
    if (!user.password) {
      console.log(
        "❌ PASSWORD IS EMPTY"
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "PASSWORD MATCH:",
      passwordMatch
    );

    // Wrong password
    if (!passwordMatch) {
      console.log(
        "❌ PASSWORD DOES NOT MATCH"
      );

      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check JWT secret
    if (!process.env.JWT_SECRET) {
      console.error(
        "❌ JWT_SECRET is missing"
      );

      return res.status(500).json({
        message:
          "JWT_SECRET is not configured",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log(
      "✅ LOGIN SUCCESS:",
      user.email
    );

    console.log("=================================");

    return res.status(200).json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(
      "❌ LOGIN DATABASE ERROR:"
    );

    console.error(error);

    return res.status(500).json({
      message:
        "Server error during login",
      error: error.message,
    });
  }
});


module.exports = router;