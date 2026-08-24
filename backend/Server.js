const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const app = express();

// ==================================================
// CONFIGURATION
// ==================================================

const PORT = process.env.PORT || 5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

// ==================================================
// MIDDLEWARE
// ==================================================

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());







app.use(
  express.urlencoded({
    extended: true,
  })
);

// ==================================================
// TEMPORARY USERS
// ==================================================

const users = [];

// ==================================================
// DAIRY PRODUCTS
// ==================================================

const products = [
  {
    id: 1,
    name: "Fresh Cow Milk",
    category: "Milk",
    description:
      "Pure and fresh cow milk directly from our farm.",
    price: 60,
    quantity: 50,
    unit: "1 Liter",
    imageUrl: "",
  },

  {
    id: 2,
    name: "Fresh Buffalo Milk",
    category: "Milk",
    description:
      "Rich and creamy buffalo milk.",
    price: 75,
    quantity: 40,
    unit: "1 Liter",
    imageUrl: "",
  },

  {
    id: 3,
    name: "Fresh Curd",
    category: "Curd",
    description:
      "Thick and creamy farm-fresh curd.",
    price: 50,
    quantity: 35,
    unit: "500 Grams",
    imageUrl: "",
  },

  {
    id: 4,
    name: "Farm Fresh Butter",
    category: "Butter",
    description:
      "Smooth and delicious farm butter.",
    price: 120,
    quantity: 25,
    unit: "250 Grams",
    imageUrl: "",
  },

  {
    id: 5,
    name: "Fresh Paneer",
    category: "Paneer",
    description:
      "Soft and fresh paneer made from quality milk.",
    price: 120,
    quantity: 30,
    unit: "250 Grams",
    imageUrl: "",
  },

  {
    id: 6,
    name: "Pure Desi Ghee",
    category: "Ghee",
    description:
      "Traditional farm-made pure desi ghee.",
    price: 350,
    quantity: 20,
    unit: "500 Grams",
    imageUrl: "",
  },

  {
    id: 7,
    name: "Fresh Buttermilk",
    category: "Buttermilk",
    description:
      "Refreshing natural farm buttermilk.",
    price: 30,
    quantity: 60,
    unit: "500 ML",
    imageUrl: "",
  },

  {
    id: 8,
    name: "Sweet Lassi",
    category: "Lassi",
    description:
      "Creamy and refreshing traditional sweet lassi.",
    price: 45,
    quantity: 40,
    unit: "500 ML",
    imageUrl: "",
  },

  {
    id: 9,
    name: "Mango Lassi",
    category: "Lassi",
    description:
      "Refreshing mango lassi made with fresh dairy.",
    price: 60,
    quantity: 30,
    unit: "500 ML",
    imageUrl: "",
  },

  {
    id: 10,
    name: "Chocolate Milk",
    category: "Flavored Milk",
    description:
      "Delicious chocolate flavored milk.",
    price: 50,
    quantity: 45,
    unit: "250 ML",
    imageUrl: "",
  },

  {
    id: 11,
    name: "Vanilla Milk",
    category: "Flavored Milk",
    description:
      "Smooth vanilla flavored milk.",
    price: 50,
    quantity: 40,
    unit: "250 ML",
    imageUrl: "",
  },

  {
    id: 12,
    name: "Mozzarella Cheese",
    category: "Cheese",
    description:
      "Soft and creamy mozzarella cheese.",
    price: 180,
    quantity: 20,
    unit: "250 Grams",
    imageUrl: "",
  },

  {
    id: 13,
    name: "Cheddar Cheese",
    category: "Cheese",
    description:
      "Rich and flavorful cheddar cheese.",
    price: 220,
    quantity: 20,
    unit: "250 Grams",
    imageUrl: "",
  },

  {
    id: 14,
    name: "Greek Yogurt",
    category: "Yogurt",
    description:
      "Thick, creamy and protein-rich Greek yogurt.",
    price: 90,
    quantity: 25,
    unit: "400 Grams",
    imageUrl: "",
  },

  {
    id: 15,
    name: "Fresh Cream",
    category: "Cream",
    description:
      "Smooth dairy cream for cooking and desserts.",
    price: 80,
    quantity: 30,
    unit: "200 ML",
    imageUrl: "",
  },

  {
    id: 16,
    name: "Vanilla Ice Cream",
    category: "Ice Cream",
    description:
      "Creamy vanilla dairy ice cream.",
    price: 150,
    quantity: 25,
    unit: "500 ML",
    imageUrl: "",
  },

  {
    id: 17,
    name: "Chocolate Ice Cream",
    category: "Ice Cream",
    description:
      "Rich and creamy chocolate ice cream.",
    price: 170,
    quantity: 25,
    unit: "500 ML",
    imageUrl: "",
  },

  {
    id: 18,
    name: "Fresh Kulfi",
    category: "Dessert",
    description:
      "Traditional creamy dairy kulfi.",
    price: 60,
    quantity: 35,
    unit: "100 ML",
    imageUrl: "",
  },

  {
    id: 19,
    name: "Fresh Milkshake",
    category: "Beverage",
    description:
      "Thick and delicious dairy milkshake.",
    price: 80,
    quantity: 35,
    unit: "300 ML",
    imageUrl: "",
  },

  {
    id: 20,
    name: "Farm Yogurt",
    category: "Yogurt",
    description:
      "Fresh creamy farm yogurt.",
    price: 70,
    quantity: 30,
    unit: "400 Grams",
    imageUrl: "",
  },
];

// ==================================================
// HOME
// ==================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HARI FARMS Backend is running",
  });
});

// ==================================================
// REGISTER
// ==================================================

app.post(
  "/api/auth/register",
  async (req, res) => {
    try {
      console.log("Registration:", req.body);

      const {
        name,
        email,
        password,
        phone,
        address,
      } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Name, email and password are required",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "Password must contain at least 6 characters",
        });
      }

      const cleanEmail =
        email.trim().toLowerCase();

      const existingUser =
        users.find(
          (user) =>
            user.email === cleanEmail
        );

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message:
            "Email is already registered",
        });
      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      const newUser = {
        id: users.length + 1,

        name: name.trim(),

        email: cleanEmail,

        password: hashedPassword,

        phone: phone
          ? phone.trim()
          : "",

        address: address
          ? address.trim()
          : "",

        role: "ADMIN",

        createdAt: new Date(),
      };

      users.push(newUser);

      console.log(
        "User registered:",
        newUser.email
      );

      return res.status(201).json({
        success: true,

        message:
          "Registration successful",

        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          address: newUser.address,
          role: newUser.role,
        },
      });
    } catch (error) {
      console.error(
        "Registration Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  }
);

// ==================================================
// LOGIN
// ==================================================

app.post(
  "/api/auth/login",
  async (req, res) => {
    try {
      const {
        email,
        password,
      } = req.body;

      console.log(
        "Login request:",
        email
      );

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message:
            "Email and password are required",
        });
      }

      const cleanEmail =
        email.trim().toLowerCase();

      const user =
        users.find(
          (item) =>
            item.email === cleanEmail
        );

      if (!user) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!passwordMatch) {
        return res.status(401).json({
          success: false,
          message:
            "Invalid email or password",
        });
      }

      console.log(
        "Login successful:",
        user.email
      );

      return res.status(200).json({
        success: true,

        message:
          "Login successful",

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Internal server error",
      });
    }
  }
);

// ==================================================
// GET PRODUCTS
// ==================================================

app.get(
  "/api/products",
  (req, res) => {
    console.log(
      "GET /api/products"
    );

    console.log(
      "Number of products:",
      products.length
    );

    return res.status(200).json({
      success: true,
      count: products.length,
      products: products,
    });
  }
);

// ==================================================
// GET SINGLE PRODUCT
// ==================================================

app.get(
  "/api/products/:id",
  (req, res) => {
    const id =
      Number(req.params.id);

    const product =
      products.find(
        (item) =>
          item.id === id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      product: product,
    });
  }
);

// ==================================================
// GET USERS
// ==================================================

app.get(
  "/api/users",
  (req, res) => {
    const safeUsers =
      users.map(
        (user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
          createdAt:
            user.createdAt,
        })
      );

    return res.status(200).json({
      success: true,
      count: safeUsers.length,
      users: safeUsers,
    });
  }
);

// ==================================================
// 404
// ==================================================

app.use(
  (req, res) => {
    return res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// ==================================================
// START SERVER
// ==================================================

app.listen(
  PORT,
  () => {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "          HARI FARMS BACKEND"
    );
    console.log(
      "======================================"
    );

    console.log(
      `Server: http://localhost:${PORT}`
    );

    console.log(
      `Frontend: ${FRONTEND_URL}`
    );

    console.log("");

    console.log(
      `Register: POST http://localhost:${PORT}/api/auth/register`
    );

    console.log(
      `Login:    POST http://localhost:${PORT}/api/auth/login`
    );

    console.log(
      `Products: GET  http://localhost:${PORT}/api/products`
    );

    console.log(
      `Users:    GET  http://localhost:${PORT}/api/users`
    );

    console.log(
      "======================================"
    );

    console.log("");
  }
);