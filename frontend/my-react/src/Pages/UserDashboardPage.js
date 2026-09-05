import React from "react";
import { useNavigate } from "react-router-dom";

function UserDashboard() {
  const navigate = useNavigate();

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const storedUser =
    localStorage.getItem("user");

  let user = {};

  try {
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  }

  const userName =
    user?.name || "Customer";

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ======================================
          NAVBAR
      ====================================== */}

      <nav style={styles.navbar}>

        <div
          style={styles.logo}
          onClick={() =>
            navigate("/user-dashboard")
          }
        >
          🥛 HARI FARMS
        </div>

        <div style={styles.navLinks}>

          <button
            type="button"
            style={styles.navButton}
            onClick={() =>
              navigate("/user-dashboard")
            }
          >
            Home
          </button>

          <button
            type="button"
            style={styles.navButton}
            onClick={() =>
              navigate("/products")
            }
          >
            Products
          </button>

          <button
            type="button"
            style={styles.navButton}
            onClick={() =>
              navigate("/cart")
            }
          >
            🛒 Cart
          </button>

          <button
            type="button"
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* ======================================
          HERO
      ====================================== */}

      <section style={styles.hero}>

        <div style={styles.heroContent}>

          <div style={styles.heroIcon}>
            🐄
          </div>

          <h1 style={styles.title}>
            Welcome, {userName}! 👋
          </h1>

          <h2 style={styles.subtitle}>
            Welcome to HARI FARMS
          </h2>

          <p style={styles.description}>
            Fresh dairy products delivered
            with quality, freshness and care.
          </p>

          <button
            type="button"
            style={styles.shopButton}
            onClick={() =>
              navigate("/products")
            }
          >
            🛍️ Shop Now
          </button>

        </div>

      </section>

      {/* ======================================
          DASHBOARD CARDS
      ====================================== */}

      <section style={styles.dashboard}>

        <h2 style={styles.sectionTitle}>
          Your Dashboard
        </h2>

        <div style={styles.cards}>

          {/* PRODUCTS */}

          <div style={styles.card}>

            <div style={styles.cardIcon}>
              🥛
            </div>

            <h3 style={styles.cardTitle}>
              Dairy Products
            </h3>

            <p style={styles.cardText}>
              Explore our fresh milk, curd,
              paneer and other dairy products.
            </p>

            <button
              type="button"
              style={styles.cardButton}
              onClick={() =>
                navigate("/products")
              }
            >
              View Products
            </button>

          </div>

          {/* CART */}

          <div style={styles.card}>

            <div style={styles.cardIcon}>
              🛒
            </div>

            <h3 style={styles.cardTitle}>
              My Cart
            </h3>

            <p style={styles.cardText}>
              View the products you have
              added to your shopping cart.
            </p>

            <button
              type="button"
              style={styles.cardButton}
              onClick={() =>
                navigate("/cart")
              }
            >
              Open Cart
            </button>

          </div>

          {/* ACCOUNT */}

          <div style={styles.card}>

            <div style={styles.cardIcon}>
              👤
            </div>

            <h3 style={styles.cardTitle}>
              My Account
            </h3>

            <p style={styles.cardText}>
              Logged in as:
              <br />

              <strong>
                {user?.email || "User"}
              </strong>
            </p>

            <button
              type="button"
              style={styles.cardButton}
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </section>

      {/* ======================================
          INFORMATION SECTION
      ====================================== */}

      <section style={styles.infoSection}>

        <div style={styles.infoBox}>

          <div style={styles.infoIcon}>
            🌱
          </div>

          <h3 style={styles.infoTitle}>
            Fresh & Natural
          </h3>

          <p style={styles.infoText}>
            We provide quality dairy products
            prepared with freshness and care.
          </p>

        </div>

        <div style={styles.infoBox}>

          <div style={styles.infoIcon}>
            🐄
          </div>

          <h3 style={styles.infoTitle}>
            Farm Fresh
          </h3>

          <p style={styles.infoText}>
            Our products are sourced with
            quality and freshness in mind.
          </p>

        </div>

        <div style={styles.infoBox}>

          <div style={styles.infoIcon}>
            ❤️
          </div>

          <h3 style={styles.infoTitle}>
            Customer First
          </h3>

          <p style={styles.infoText}>
            Your satisfaction and trust are
            important to HARI FARMS.
          </p>

        </div>

      </section>

      {/* ======================================
          FOOTER
      ====================================== */}

      <footer style={styles.footer}>

        <p style={styles.footerText}>
          © {new Date().getFullYear()} HARI FARMS.
          All Rights Reserved.
        </p>

      </footer>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f8f3",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  navbar: {
    minHeight: "70px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 7%",
    boxShadow:
      "0 2px 10px rgba(0, 0, 0, 0.08)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  logo: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2e7d32",
    cursor: "pointer",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  navButton: {
    border: "none",
    background: "transparent",
    padding: "10px 14px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    color: "#333333",
    borderRadius: "6px",
  },

  logoutButton: {
    border: "none",
    background: "#d32f2f",
    color: "#ffffff",
    padding: "10px 18px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },

  hero: {
    minHeight: "430px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px 20px",
    background:
      "linear-gradient(135deg, #e8f5e9, #ffffff)",
  },

  heroContent: {
    maxWidth: "750px",
  },

  heroIcon: {
    fontSize: "60px",
    marginBottom: "15px",
  },

  title: {
    fontSize: "42px",
    color: "#1b5e20",
    marginBottom: "12px",
  },

  subtitle: {
    fontSize: "27px",
    fontWeight: "700",
    color: "#333333",
    marginBottom: "10px",
  },

  description: {
    fontSize: "18px",
    color: "#666666",
    lineHeight: "1.6",
    marginBottom: "30px",
  },

  shopButton: {
    background: "#2e7d32",
    color: "#ffffff",
    border: "none",
    padding: "14px 32px",
    borderRadius: "8px",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
  },

  dashboard: {
    padding: "55px 7%",
  },

  sectionTitle: {
    textAlign: "center",
    fontSize: "30px",
    color: "#1b5e20",
    marginBottom: "35px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  card: {
    background: "#ffffff",
    padding: "30px 25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0, 0, 0, 0.08)",
  },

  cardIcon: {
    fontSize: "45px",
    marginBottom: "15px",
  },

  cardTitle: {
    fontSize: "22px",
    color: "#2e7d32",
    marginBottom: "12px",
  },

  cardText: {
    color: "#666666",
    fontSize: "15px",
    lineHeight: "1.6",
    minHeight: "72px",
  },

  cardButton: {
    marginTop: "15px",
    border: "none",
    background: "#388e3c",
    color: "#ffffff",
    padding: "11px 20px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },

  infoSection: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(230px, 1fr))",
    gap: "25px",
    padding: "20px 7% 60px",
    maxWidth: "1100px",
    margin: "0 auto",
  },

  infoBox: {
    background: "#ffffff",
    padding: "30px 20px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
      "0 4px 15px rgba(0, 0, 0, 0.06)",
  },

  infoIcon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  infoTitle: {
    color: "#2e7d32",
    fontSize: "20px",
    marginBottom: "10px",
  },

  infoText: {
    color: "#666666",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  footer: {
    background: "#1b5e20",
    color: "#ffffff",
    textAlign: "center",
    padding: "22px",
    marginTop: "20px",
  },

  footerText: {
    margin: 0,
  },

};

export default UserDashboard;