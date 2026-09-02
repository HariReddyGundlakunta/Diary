import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        // ==========================================
        // GET LOGGED-IN USER
        // ==========================================

        const storedUser =
          localStorage.getItem("user");

        const token =
          localStorage.getItem("token");

        if (!token || !storedUser) {
          navigate("/login", {
            replace: true,
          });

          return;
        }

        const user =
          JSON.parse(storedUser);

        if (!user || !user.id) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login", {
            replace: true,
          });

          return;
        }

        console.log(
          "Getting orders for user:",
          user.id
        );

        // ==========================================
        // GET ORDERS FROM MYSQL
        // ==========================================

        const response =
          await axios.get(
            `${API_URL}/api/orders/${user.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "ORDERS RESPONSE:",
          response.data
        );

        if (response.data.success) {
          setOrders(
            Array.isArray(response.data.orders)
              ? response.data.orders
              : []
          );
        } else {
          setError(
            response.data.message ||
            "Failed to load orders."
          );
        }

      } catch (err) {
        console.error(
          "GET ORDERS ERROR:",
          err
        );

        if (err.response) {
          setError(
            err.response.data?.message ||
            "Failed to load orders."
          );
        } else {
          setError(
            "Unable to connect to the server."
          );
        }

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

  }, [API_URL, navigate]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.center}>
        <h2>📦 Loading orders...</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* ======================================
          HEADER
          ====================================== */}

      <div style={styles.header}>

        <h1>📦 My Orders</h1>

        <Link
          to="/dashboard"
          style={styles.back}
        >
          Dashboard
        </Link>

      </div>

      {/* ======================================
          ERROR
          ====================================== */}

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* ======================================
          NO ORDERS
          ====================================== */}

      {!error && orders.length === 0 && (
        <div style={styles.empty}>

          <h2>
            No orders yet.
          </h2>

          <p>
            You have not placed any orders.
          </p>

          <Link
            to="/products"
            style={styles.productsLink}
          >
            View Products
          </Link>

        </div>
      )}

      {/* ======================================
          ORDERS
          ====================================== */}

      {orders.map((order, orderIndex) => {

        const items =
          Array.isArray(order.items)
            ? order.items
            : [];

        return (
          <div
            key={
              order.id ||
              orderIndex
            }
            style={styles.order}
          >

            {/* ==================================
                ORDER HEADER
                ================================== */}

            <div
              style={styles.orderHeader}
            >

              <div>

                <h2>
                  Order #{order.id}
                </h2>

                <p style={styles.date}>
                  {order.order_date
                    ? new Date(
                        order.order_date
                      ).toLocaleString()
                    : "Date not available"}
                </p>

              </div>

              <div
                style={
                  styles.totalSection
                }
              >

                <h2>
                  ₹
                  {Number(
                    order.total || 0
                  ).toFixed(2)}
                </h2>

                <span
                  style={styles.status}
                >
                  {order.status ||
                    "Pending"}
                </span>

              </div>

            </div>

            <hr />

            {/* ==================================
                ORDER ITEMS
                ================================== */}

            {items.length === 0 ? (

              <p style={styles.noItems}>
                No items found for this order.
              </p>

            ) : (

              items.map(
                (item, index) => (

                  <div
                    key={
                      item.id ||
                      index
                    }
                    style={styles.item}
                  >

                    <span
                      style={
                        styles.itemName
                      }
                    >
                      {item.emoji ||
                        "📦"}{" "}
                      {item.name ||
                        "Product"}
                    </span>

                    <span
                      style={
                        styles.itemPrice
                      }
                    >
                      ₹
                      {Number(
                        item.price || 0
                      ).toFixed(2)}

                      {" × "}

                      {item.quantity ||
                        1}
                    </span>

                  </div>

                )
              )

            )}

          </div>
        );
      })}

    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f5f7f5",
    boxSizing: "border-box",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7f5",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },

  back: {
    background: "#2e7d32",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  empty: {
    background: "white",
    padding: "50px",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.06)",
  },

  productsLink: {
    display: "inline-block",
    marginTop: "15px",
    background: "#2e7d32",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    textDecoration: "none",
  },

  order: {
    background: "white",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.06)",
  },

  orderHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  totalSection: {
    textAlign: "right",
  },

  date: {
    color: "#666",
    margin: "5px 0 0",
  },

  status: {
    display: "inline-block",
    background: "#dff5e1",
    color: "#2e7d32",
    padding: "7px 12px",
    borderRadius: "20px",
    fontWeight: "bold",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom:
      "1px solid #eee",
    gap: "20px",
    flexWrap: "wrap",
  },

  itemName: {
    fontWeight: "500",
  },

  itemPrice: {
    color: "#555",
  },

  noItems: {
    color: "#777",
    textAlign: "center",
    padding: "15px",
  },
};

export default Orders;