import React from "react";

import {
  Link,
  useLocation,
} from "react-router-dom";


function OrderConfirmation() {

  const location =
    useLocation();


  const order =
    location.state?.order;


  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <div style={styles.icon}>
          ✅
        </div>


        <h1 style={styles.heading}>
          Order Confirmed!
        </h1>


        <p style={styles.message}>
          Thank you for shopping with
          HARI FARMS.
        </p>


        {order ? (

          <div style={styles.details}>

            <div style={styles.row}>

              <span>
                Order ID
              </span>

              <strong>
                #{order.id}
              </strong>

            </div>


            <div style={styles.row}>

              <span>
                Total
              </span>

              <strong>
                ₹
                {Number(
                  order.total || 0
                ).toFixed(2)}
              </strong>

            </div>


            <div style={styles.row}>

              <span>
                Payment
              </span>

              <strong>
                {order.payment ||
                  "Cash on Delivery"}
              </strong>

            </div>

          </div>

        ) : (

          <p style={styles.message}>
            Your order was placed successfully.
          </p>

        )}


        <div style={styles.buttons}>

          <Link
            to="/products"
            style={styles.shopButton}
          >
            Continue Shopping
          </Link>


          <Link
            to="/home"
            style={styles.homeButton}
          >
            Go to Home
          </Link>

        </div>

      </div>

    </div>

  );
}


const styles = {

  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f8e9",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "550px",
    background: "white",
    borderRadius: "20px",
    padding: "50px",
    textAlign: "center",
    boxShadow:
      "0 5px 25px rgba(0,0,0,0.1)",
    boxSizing: "border-box",
  },

  icon: {
    fontSize: "80px",
  },

  heading: {
    color: "#2e7d32",
  },

  message: {
    color: "#666",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  details: {
    marginTop: "25px",
    padding: "20px",
    background: "#f8faf8",
    borderRadius: "12px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "13px 0",
    borderBottom:
      "1px solid #ddd",
    gap: "20px",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "25px",
  },

  shopButton: {
    padding: "12px 20px",
    background: "#2e7d32",
    color: "white",
    textDecoration: "none",
    borderRadius: "7px",
    fontWeight: "bold",
  },

  homeButton: {
    padding: "12px 20px",
    background: "#eeeeee",
    color: "#333",
    textDecoration: "none",
    borderRadius: "7px",
    fontWeight: "bold",
  },

};


export default OrderConfirmation;