import React from "react";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const products =
    JSON.parse(localStorage.getItem("products")) || [];

  const orders =
    JSON.parse(localStorage.getItem("orders")) || [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <p style={styles.subtitle}>
        Welcome to the Farms Admin Panel
      </p>

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
          <div style={styles.icon}>👥</div>
          <h2>Users</h2>
          <p>Registered Customers</p>
        </div>

        <div style={styles.card}>
          <div style={styles.icon}>💰</div>
          <h2>₹ Revenue</h2>
          <p>Total Sales</p>
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
          to="/orders"
          style={styles.orderButton}
        >
          📦 View Orders
        </Link>

      </div>

      <div style={styles.section}>
        <h2>Recent Orders</h2>

        {orders.length === 0 ? (
          <p>No orders available.</p>
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
    padding: "40px",
    backgroundColor: "#f5f7f5",
    minHeight: "calc(100vh - 65px)",
  },

  title: {
    color: "#2e7d32",
    marginBottom: "5px",
  },

  subtitle: {
    color: "#666",
    marginBottom: "35px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
  },

  card: {
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
      "0 4px 12px rgba(0,0,0,0.08)",
  },

  icon: {
    fontSize: "45px",
  },

  actions: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
    marginTop: "30px",
  },

  addButton: {
    backgroundColor: "#2e7d32",
    color: "white",
    padding: "12px 20px",
    borderRadius: "7px",
    textDecoration: "none",
  },

  viewButton: {
    backgroundColor: "#1565c0",
    color: "white",
    padding: "12px 20px",
    borderRadius: "7px",
    textDecoration: "none",
  },

  orderButton: {
    backgroundColor: "#6a1b9a",
    color: "white",
    padding: "12px 20px",
    borderRadius: "7px",
    textDecoration: "none",
  },

  section: {
    marginTop: "40px",
    backgroundColor: "white",
    padding: "25px",
    borderRadius: "12px",
  },

  order: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    marginTop: "10px",
    borderBottom: "1px solid #eee",
  },

  status: {
    color: "#2e7d32",
  },
};

export default AdminDashboard;