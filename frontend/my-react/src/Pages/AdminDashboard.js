import React from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";


function AdminDashboard() {

  const navigate = useNavigate();


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");

  };


  return (

    <div style={styles.page}>

      {/* NAVBAR */}

      <nav style={styles.navbar}>

        <Link
          to="/home"
          style={styles.logo}
        >
          🥛 HARI FARMS
        </Link>


        <div style={styles.navLinks}>

          <Link
            to="/home"
            style={styles.navLink}
          >
            Home
          </Link>

          <Link
            to="/products"
            style={styles.navLink}
          >
            Products
          </Link>

          <button
            onClick={handleLogout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </nav>


      <main style={styles.main}>

        {/* WELCOME */}

        <section style={styles.welcome}>

          <div>

            <p style={styles.adminLabel}>
              HARI FARMS • ADMIN
            </p>

            <h1 style={styles.welcomeTitle}>
              Welcome to Admin Dashboard 👋
            </h1>

            <p style={styles.description}>
              Manage your dairy farm products
              and store operations from one place.
            </p>

          </div>


          <div style={styles.cow}>
            🐄
          </div>

        </section>


        {/* STAT CARDS */}

        <div style={styles.stats}>

          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              🥛
            </div>

            <p>
              Total Products
            </p>

            <h2>
              0
            </h2>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              📦
            </div>

            <p>
              Total Orders
            </p>

            <h2>
              0
            </h2>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              👥
            </div>

            <p>
              Customers
            </p>

            <h2>
              0
            </h2>

          </div>


          <div style={styles.statCard}>

            <div style={styles.statIcon}>
              💰
            </div>

            <p>
              Revenue
            </p>

            <h2>
              ₹0
            </h2>

          </div>

        </div>


        {/* OPERATIONS */}

        <h2 style={styles.sectionTitle}>
          Farm Management
        </h2>


        <div style={styles.operations}>

          <Link
            to="/admin/products/add"
            style={styles.operation}
          >

            <div style={styles.operationIcon}>
              ➕
            </div>

            <h3>
              Add Product
            </h3>

            <p>
              Add a new dairy product
              to HARI FARMS.
            </p>

            <span>
              Add Product →
            </span>

          </Link>


          <Link
            to="/products"
            style={styles.operation}
          >

            <div style={styles.operationIcon}>
              🥛
            </div>

            <h3>
              Manage Products
            </h3>

            <p>
              View all products from
              the database.
            </p>

            <span>
              View Products →
            </span>

          </Link>


          <div style={styles.operation}>

            <div style={styles.operationIcon}>
              📦
            </div>

            <h3>
              Orders
            </h3>

            <p>
              Customer order management.
            </p>

            <span>
              Coming Soon
            </span>

          </div>

        </div>


        {/* ACTIVITY */}

        <section style={styles.activity}>

          <h2>
            Recent Activity
          </h2>

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              📋
            </div>

            <h3>
              No Recent Activity
            </h3>

            <p>
              Recent farm operations will
              appear here.
            </p>

          </div>

        </section>

      </main>


      <footer style={styles.footer}>

        🥛 <strong>
          HARI FARMS
        </strong>

        <p>
          Fresh From Farm • Pure For Family
        </p>

        <small>
          © 2026 HARI FARMS
        </small>

      </footer>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5faf5",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },

  navbar: {
    height: "68px",
    background: "#2e7d32",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    boxShadow:
      "0 3px 15px rgba(0,0,0,0.12)",
  },

  logo: {
    color: "#fff",
    textDecoration: "none",
    fontSize: "23px",
    fontWeight: "800",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
  },

  logout: {
    border: "none",
    background: "#e53935",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "20px",
    fontWeight: "700",
    cursor: "pointer",
  },

  main: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "40px 25px 70px",
  },

  welcome: {
    background:
      "linear-gradient(135deg,#1b5e20,#43a047)",
    color: "#fff",
    padding: "40px",
    borderRadius: "25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow:
      "0 15px 35px rgba(46,125,50,0.20)",
  },

  adminLabel: {
    fontSize: "12px",
    letterSpacing: "2px",
    fontWeight: "700",
  },

  welcomeTitle: {
    fontSize: "34px",
    margin: "10px 0",
  },

  description: {
    opacity: 0.9,
  },

  cow: {
    fontSize: "90px",
  },

  stats: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: "20px",
    marginTop: "30px",
  },

  statCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
  },

  statIcon: {
    fontSize: "32px",
  },

  sectionTitle: {
    color: "#205b26",
    marginTop: "40px",
  },

  operations: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3,1fr)",
    gap: "20px",
  },

  operation: {
    background: "#fff",
    padding: "28px",
    borderRadius: "20px",
    textDecoration: "none",
    color: "#26352a",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
  },

  operationIcon: {
    fontSize: "35px",
  },

  activity: {
    background: "#fff",
    padding: "30px",
    borderRadius: "20px",
    marginTop: "30px",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
  },

  empty: {
    textAlign: "center",
    color: "#78857b",
    padding: "30px",
  },

  emptyIcon: {
    fontSize: "45px",
  },

  footer: {
    background: "#173d1b",
    color: "#fff",
    textAlign: "center",
    padding: "35px",
  },

};

export default AdminDashboard;