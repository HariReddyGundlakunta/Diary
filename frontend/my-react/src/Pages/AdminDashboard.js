import React from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();

  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  const user =
    JSON.parse(localStorage.getItem("user")) || {};

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <div>
          <h1>🥛 Dairy Dashboard</h1>

          <p>
            Welcome, {user.name || "User"} 👋
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logout}
        >
          Logout
        </button>
      </div>

      <div style={styles.cards}>

        <div style={styles.card}>
          <div style={styles.icon}>🥛</div>
          <h2>{products.length}</h2>
          <p>Total Products</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>📦</div>
          <h2>{orders.length}</h2>
          <p>Total Orders</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>👤</div>
          <h2>{user.name || "User"}</h2>
          <p>Current User</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>💰</div>
          <h2>₹{totalRevenue}</h2>
          <p>Total Revenue</p>
        </div>

      </div>

      <div style={styles.actions}>

        <Link
          to="/admin/products/add"
          style={styles.addButton}
        >
          ➕ Add Product
        </Link>

        <Link
          to="/products"
          style={styles.viewButton}
        >
          🥛 View Products
        </Link>

        <Link
          to="/cart"
          style={styles.cartButton}
        >
          🛒 My Cart
        </Link>

        <Link
          to="/orders"
          style={styles.orderButton}
        >
          📦 Orders
        </Link>

      </div>

      <div style={styles.section}>
        <h2>Recent Orders</h2>

        {orders.length === 0 ? (
          <p>No orders available yet.</p>
        ) : (
          orders
            .slice()
            .reverse()
            .slice(0, 5)
            .map((order) => (
              <div
                key={order.id}
                style={styles.order}
              >
                <div>
                  <strong>
                    Order #{order.id}
                  </strong>

                  <p>{order.date}</p>
                </div>

                <div>
                  <strong>
                    ₹{order.total}
                  </strong>

                  <p style={styles.status}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))
        )}

      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f4faf5",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  logout: {
    padding: "12px 20px",
    background: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "45px",
  },

  actions: {
    display: "flex",
    flexWrap: "wrap",
    gap: "15px",
    marginTop: "30px",
  },

  addButton: {
    padding: "13px 20px",
    background: "#2e7d32",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
  },

  viewButton: {
    padding: "13px 20px",
    background: "#1976d2",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
  },

  cartButton: {
    padding: "13px 20px",
    background: "#f57c00",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
  },

  orderButton: {
    padding: "13px 20px",
    background: "#7b1fa2",
    color: "white",
    textDecoration: "none",
    borderRadius: "10px",
  },

  section: {
    marginTop: "40px",
    background: "white",
    padding: "25px",
    borderRadius: "18px",
  },

  order: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px",
    borderBottom: "1px solid #eee",
  },

  status: {
    color: "#2e7d32",
  },
};

export default AdminDashboard;