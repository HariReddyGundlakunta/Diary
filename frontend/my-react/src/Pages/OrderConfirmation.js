import React from "react";
import { Link, useLocation } from "react-router-dom";

function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.icon}>
          ✅
        </div>

        <h1>Order Confirmed!</h1>

        <p>
          Thank you for shopping with Farms.
        </p>

        {order && (
          <>
            <h3>
              Order ID: #{order.id}
            </h3>

            <h3>
              Total: ₹{order.total}
            </h3>

            <p>
              Payment: {order.payment}
            </p>
          </>
        )}

        <Link
          to="/products"
          style={styles.button}
        >
          Continue Shopping
        </Link>

        <Link
          to="/orders"
          style={styles.orders}
        >
          View My Orders
        </Link>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f8e9",
  },

  card: {
    textAlign: "center",
    padding: "50px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },

  icon: {
    fontSize: "80px",
  },

  button: {
    display: "inline-block",
    margin: "10px",
    padding: "12px 20px",
    backgroundColor: "#2e7d32",
    color: "white",
    textDecoration: "none",
    borderRadius: "7px",
  },

  orders: {
    display: "inline-block",
    margin: "10px",
    padding: "12px 20px",
    backgroundColor: "#eeeeee",
    color: "#333",
    textDecoration: "none",
    borderRadius: "7px",
  },
};

export default OrderConfirmation;