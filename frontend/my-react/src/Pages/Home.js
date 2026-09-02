import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Components/Navbar";

function Home() {
  return (
    <div>
<Navbar />
      {/* HERO SECTION */}
      <section style={styles.hero}>

        <div style={styles.heroContent}>

          <h1 style={styles.heroTitle}>
            Fresh Milk & Dairy Products
          </h1>

          <p style={styles.heroText}>
            Fresh, healthy and quality dairy products
            delivered directly to your doorstep.
          </p>

          <Link
            to="/products"
            style={styles.shopButton}
          >
            Shop Now
          </Link>

        </div>

        <div style={styles.heroEmoji}>
          🥛
        </div>

      </section>

      {/* FEATURES */}
      <section style={styles.section}>

        <h2 style={styles.heading}>
          Why Choose Farms?
        </h2>

        <div style={styles.cards}>

          <div style={styles.card}>
            <div style={styles.icon}>
              🥛
            </div>

            <h3>Fresh Products</h3>

            <p>
              Fresh and quality dairy products
              for your family.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.icon}>
              🚚
            </div>

            <h3>Fast Delivery</h3>

            <p>
              Get fresh dairy products delivered
              to your doorstep.
            </p>
          </div>

          <div style={styles.card}>
            <div style={styles.icon}>
              🌱
            </div>

            <h3>Natural Quality</h3>

            <p>
              Carefully selected products with
              excellent quality.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

const styles = {

  hero: {
    minHeight: "450px",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    padding: "50px",
    boxSizing: "border-box",
    background:
      "linear-gradient(135deg, #e8f5e9, #ffffff)",
  },

  heroContent: {
    maxWidth: "600px",
  },

  heroTitle: {
    fontSize: "48px",
    color: "#2e7d32",
    marginBottom: "20px",
  },

  heroText: {
    fontSize: "20px",
    color: "#555",
    lineHeight: "1.6",
  },

  heroEmoji: {
    fontSize: "180px",
  },

  shopButton: {
    display: "inline-block",
    marginTop: "20px",
    padding: "14px 30px",
    backgroundColor: "#2e7d32",
    color: "white",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  section: {
    padding: "50px 30px",
    textAlign: "center",
  },

  heading: {
    color: "#2e7d32",
    marginBottom: "35px",
  },

  cards: {
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
  },

  card: {
    width: "250px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.1)",
  },

  icon: {
    fontSize: "55px",
  },
};

export default Home;