import React from "react";
import { useParams, Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Fresh Cow Milk",
    price: 60,
    unit: "1 Liter",
    emoji: "🥛",
    description:
      "Fresh and nutritious cow milk delivered directly to your doorstep.",
  },

  {
    id: 2,
    name: "Buffalo Milk",
    price: 70,
    unit: "1 Liter",
    emoji: "🥛",
    description:
      "Rich, creamy and nutritious buffalo milk.",
  },

  {
    id: 3,
    name: "Fresh Curd",
    price: 50,
    unit: "500g",
    emoji: "🥣",
    description:
      "Fresh and delicious dairy curd.",
  },

  {
    id: 4,
    name: "Paneer",
    price: 120,
    unit: "250g",
    emoji: "🧀",
    description:
      "Soft and fresh paneer prepared from quality milk.",
  },

  {
    id: 5,
    name: "Butter",
    price: 90,
    unit: "200g",
    emoji: "🧈",
    description:
      "Smooth and creamy dairy butter.",
  },

  {
    id: 6,
    name: "Ghee",
    price: 250,
    unit: "500ml",
    emoji: "🫙",
    description:
      "Pure and aromatic dairy ghee.",
  },
];

function ProductDetails({ addToCart }) {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  if (!product) {
    return (
      <h2 style={{ textAlign: "center" }}>
        Product not found
      </h2>
    );
  }

  return (
    <div style={styles.container}>

      <div style={styles.product}>

        <div style={styles.image}>
          {product.emoji}
        </div>

        <div>
          <h1>{product.name}</h1>

          <h2>₹{product.price}</h2>

          <p>{product.unit}</p>

          <p>{product.description}</p>

          <button
            onClick={() => addToCart(product)}
            style={styles.button}
          >
            Add to Cart
          </button>

          <Link
            to="/products"
            style={styles.link}
          >
            ← Back to Products
          </Link>
        </div>

      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "60px",
  },

  product: {
    maxWidth: "900px",
    margin: "auto",
    display: "flex",
    gap: "60px",
    alignItems: "center",
    padding: "40px",
    background: "white",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    borderRadius: "15px",
  },

  image: {
    fontSize: "180px",
  },

  button: {
    padding: "13px 25px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
  },

  link: {
    marginLeft: "20px",
    textDecoration: "none",
    color: "#2e7d32",
  },
};

export default ProductDetails;