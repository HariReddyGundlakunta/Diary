const db = require("./db");

async function createTables() {
  let connection;

  try {
    console.log("=================================");
    console.log("CREATING / CHECKING DATABASE");
    console.log("=================================");

    connection = await db.getConnection();

    // ==========================================
    // USERS
    // ==========================================

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(100) NOT NULL,

        email VARCHAR(150) NOT NULL UNIQUE,

        password VARCHAR(255) NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ users table ready");


    // ==========================================
    // PRODUCTS
    // ==========================================

    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,

        name VARCHAR(150) NOT NULL,

        price DECIMAL(10,2) NOT NULL,

        unit VARCHAR(100) DEFAULT '',

        description TEXT,

        emoji VARCHAR(20) DEFAULT '🥛',

        image TEXT,

        stock INT DEFAULT 0,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ products table ready");


    // ==========================================
    // CHECK PRODUCTS COLUMNS
    // ==========================================

    const [columns] = await connection.query(`
      SHOW COLUMNS FROM products
    `);

    let columnNames = columns.map(
      (column) => column.Field
    );


    // UNIT
    if (!columnNames.includes("unit")) {
      await connection.query(`
        ALTER TABLE products
        ADD COLUMN unit VARCHAR(100) DEFAULT ''
      `);

      console.log("✅ Added products.unit");
    }


    // DESCRIPTION
    if (!columnNames.includes("description")) {
      await connection.query(`
        ALTER TABLE products
        ADD COLUMN description TEXT
      `);

      console.log("✅ Added products.description");
    }


    // EMOJI
    if (!columnNames.includes("emoji")) {
      await connection.query(`
        ALTER TABLE products
        ADD COLUMN emoji VARCHAR(20) DEFAULT '🥛'
      `);

      console.log("✅ Added products.emoji");
    }


    // IMAGE
    if (!columnNames.includes("image")) {
      await connection.query(`
        ALTER TABLE products
        ADD COLUMN image TEXT
      `);

      console.log("✅ Added products.image");
    }


    // STOCK
    if (!columnNames.includes("stock")) {
      await connection.query(`
        ALTER TABLE products
        ADD COLUMN stock INT DEFAULT 0
      `);

      console.log("✅ Added products.stock");
    }


    // ==========================================
    // INSERT DEFAULT PRODUCTS
    // ==========================================

    const [existingProducts] = await connection.query(`
      SELECT id
      FROM products
      LIMIT 1
    `);

    if (existingProducts.length === 0) {

      console.log("=================================");
      console.log("ADDING DEFAULT DAIRY PRODUCTS");
      console.log("=================================");

      const defaultProducts = [
        [
          "Fresh Cow Milk",
          60,
          "1 Liter",
          "Fresh farm cow milk delivered directly to your doorstep.",
          "🥛",
          "",
          50
        ],

        [
          "Buffalo Milk",
          70,
          "1 Liter",
          "Rich and creamy fresh buffalo milk.",
          "🥛",
          "",
          40
        ],

        [
          "A2 Cow Milk",
          80,
          "1 Liter",
          "Fresh A2 cow milk from healthy dairy cows.",
          "🥛",
          "",
          30
        ],

        [
          "Fresh Curd",
          50,
          "500g",
          "Fresh creamy homemade-style curd.",
          "🥣",
          "",
          35
        ],

        [
          "Buttermilk",
          30,
          "500ml",
          "Refreshing traditional dairy buttermilk.",
          "🥛",
          "",
          45
        ],

        [
          "Paneer",
          120,
          "250g",
          "Soft and fresh paneer made from quality milk.",
          "🧀",
          "",
          25
        ],

        [
          "Fresh Cheese",
          150,
          "250g",
          "Fresh and delicious dairy cheese.",
          "🧀",
          "",
          20
        ],

        [
          "Butter",
          90,
          "200g",
          "Smooth and creamy fresh dairy butter.",
          "🧈",
          "",
          30
        ],

        [
          "Pure Cow Ghee",
          250,
          "500ml",
          "Pure aromatic cow ghee.",
          "🫙",
          "",
          20
        ],

        [
          "Buffalo Ghee",
          300,
          "500ml",
          "Traditional buffalo milk ghee.",
          "🫙",
          "",
          15
        ],

        [
          "Fresh Cream",
          100,
          "200ml",
          "Rich and fresh dairy cream.",
          "🥛",
          "",
          25
        ],

        [
          "Flavored Milk",
          45,
          "250ml",
          "Refreshing flavored dairy milk.",
          "🥤",
          "",
          40
        ],

        [
          "Mango Lassi",
          50,
          "300ml",
          "Sweet and refreshing mango lassi.",
          "🥤",
          "",
          30
        ],

        [
          "Sweet Lassi",
          45,
          "300ml",
          "Traditional sweet and creamy lassi.",
          "🥤",
          "",
          30
        ],

        [
          "Khoa",
          180,
          "250g",
          "Traditional milk-based khoa.",
          "🥛",
          "",
          15
        ],

        [
          "Kulfi",
          60,
          "100ml",
          "Traditional creamy dairy kulfi.",
          "🍦",
          "",
          25
        ],

        [
          "Rabri",
          100,
          "200g",
          "Traditional thickened milk dessert.",
          "🍮",
          "",
          20
        ],

        [
          "Milkshake",
          80,
          "300ml",
          "Fresh creamy dairy milkshake.",
          "🥤",
          "",
          25
        ]
      ];

      await connection.query(
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
        VALUES ?
        `,
        [defaultProducts]
      );

      console.log(
        `✅ ${defaultProducts.length} default products added`
      );

    } else {

      console.log(
        "✅ Products already exist - no duplicate products added"
      );
    }


    // ==========================================
    // CART ITEMS
    // ==========================================

    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart_items (
        id INT AUTO_INCREMENT PRIMARY KEY,

        user_id INT NOT NULL,

        product_id INT NOT NULL,

        quantity INT NOT NULL DEFAULT 1,

        UNIQUE KEY unique_user_product
        (user_id, product_id),

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE
      )
    `);

    console.log("✅ cart_items table ready");


    // ==========================================
    // ORDERS
    // ==========================================

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,

        user_id INT NOT NULL,

        total DECIMAL(10,2) NOT NULL,

        status VARCHAR(50)
        DEFAULT 'Pending',

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP,

        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
      )
    `);

    console.log("✅ orders table ready");


    // ==========================================
    // ORDER ITEMS
    // ==========================================

    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,

        order_id INT NOT NULL,

        product_id INT NOT NULL,

        product_name VARCHAR(150) NOT NULL,

        price DECIMAL(10,2) NOT NULL,

        quantity INT NOT NULL,

        emoji VARCHAR(20)
        DEFAULT '🥛',

        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE
      )
    `);

    console.log("✅ order_items table ready");


    // ==========================================
    // COMPLETE
    // ==========================================

    console.log("=================================");
    console.log("✅ ALL DATABASE TABLES READY");
    console.log("✅ DEFAULT PRODUCTS READY");
    console.log("=================================");

  } catch (error) {

    console.error("=================================");
    console.error("❌ TABLE CREATION ERROR");
    console.error(error.message);
    console.error("=================================");

    throw error;

  } finally {

    if (connection) {
      connection.release();
    }
  }
}

module.exports = createTables;