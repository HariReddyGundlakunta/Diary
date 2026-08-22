import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>

      <Link to="/" style={styles.logo}>
        🥛 HARIfARMS
      </Link>

      <div style={styles.links}>

        <Link to="/" style={styles.link}>
          Home
        </Link>

        <Link to="/products" style={styles.link}>
          Products
        </Link>

        <Link to="/orders" style={styles.link}>
          My Orders
        </Link>

        <Link to="/cart" style={styles.link}>
          🛒 Cart ({cartCount})
        </Link>

        {token ? (
          <button
            onClick={handleLogout}
            style={styles.logout}
          >
            Logout
          </button>
        ) : (
          <Link to="/login" style={styles.login}>
            Login
          </Link>
        )}

      </div>

    </nav>
  );
}

const styles = {
  navbar: {
    height: "65px",
    backgroundColor: "#2e7d32",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    boxSizing: "border-box",
  },

  logo: {
    color: "white",
    fontSize: "26px",
    fontWeight: "bold",
    textDecoration: "none",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },

  link: {
    color: "white",
    textDecoration: "none",
  },

  login: {
    backgroundColor: "white",
    color: "#2e7d32",
    padding: "8px 18px",
    borderRadius: "20px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  logout: {
    backgroundColor: "#c62828",
    color: "white",
    border: "none",
    padding: "8px 18px",
    borderRadius: "20px",
    cursor: "pointer",
  },
};

export default Navbar;