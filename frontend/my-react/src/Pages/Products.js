import React from "react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Fresh Cow Milk",
    price: 60,
    unit: "1 Liter",
    emoji: "🥛",
  },
  {
    id: 2,
    name: "Buffalo Milk",
    price: 70,
    unit: "1 Liter",
    emoji: "🥛",
  },
  {
    id: 3,
    name: "Fresh Curd",
    price: 50,
    unit: "500g",
    emoji: "🥣",
  },
  {
    id: 4,
    name: "Paneer",
    price: 120,
    unit: "250g",
    emoji: "🧀",
  },
  {
    id: 5,
    name: "Butter",
    price: 90,
    unit: "200g",
    emoji: "🧈",
  },
  {
    id: 6,
    name: "Ghee",
    price: 250,
    unit: "500ml",
    emoji: "🫙",
  },
];

function Products({ addToCart }) {
  return (
    <div style={styles.container}>

      <h1>🥛 Milk & Dairy Products</h1>

      <div style={styles.grid}>

        {products.map((product) => (
          <div
            key={product.id}
            style={styles.card}
          >

            <div style={styles.emoji}>
              {product.emoji}
            </div>

            <h2>{product.name}</h2>

            <p>{product.unit}</p>

            <h3>₹{product.price}</h3>

            <Link
              to={`/product/${product.id}`}
              style={styles.details}
            >
              View Details
            </Link>

            <button
              onClick={() => addToCart(product)}
              style={styles.button}
            >
              Add to Cart
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    textAlign: "center",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },

  card: {
    padding: "25px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.1)",
  },

  emoji: {
    fontSize: "70px",
  },

  details: {
    display: "inline-block",
    padding: "10px 15px",
    margin: "5px",
    backgroundColor: "#eeeeee",
    color: "#333",
    textDecoration: "none",
    borderRadius: "7px",
  },

  button: {
    padding: "10px 15px",
    margin: "5px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },
};

export default Products;