import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <div style={styles.number}>
          404
        </div>

        <div style={styles.icon}>
          🥛
        </div>

        <h1>Page Not Found</h1>

        <p>
          Sorry! The page you're looking for
          doesn't exist.
        </p>

        <Link
          to="/"
          style={styles.button}
        >
          🏠 Go to Home
        </Link>

        <Link
          to="/products"
          style={styles.products}
        >
          🥛 View Products
        </Link>

      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "calc(100vh - 65px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(135deg,#e8f5e9,#ffffff)",
    padding: "20px",
  },

  card: {
    textAlign: "center",
    backgroundColor: "white",
    padding: "50px",
    borderRadius: "20px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.12)",
    maxWidth: "500px",
  },

  number: {
    fontSize: "90px",
    fontWeight: "bold",
    color: "#2e7d32",
  },

  icon: {
    fontSize: "70px",
  },

  button: {
    display: "inline-block",
    margin: "15px 5px",
    padding: "12px 22px",
    backgroundColor: "#2e7d32",
    color: "white",
    textDecoration: "none",
    borderRadius: "7px",
  },

  products: {
    display: "inline-block",
    margin: "15px 5px",
    padding: "12px 22px",
    backgroundColor: "#eeeeee",
    color: "#333",
    textDecoration: "none",
    borderRadius: "7px",
  },
};

export default NotFound;