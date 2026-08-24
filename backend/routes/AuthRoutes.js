const express = require("express");

const router = express.Router();

router.post("/register", (req, res) => {
  console.log("Register data:", req.body);

  res.status(201).json({
    message: "Registration successful",
  });
});

router.post("/login", (req, res) => {
  console.log("Login data:", req.body);

  res.status(200).json({
    message: "Login successful",
    token: "sample-token",
  });
});

module.exports = router;