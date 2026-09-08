import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

function Checkout() {

  const navigate =
    useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [placingOrder, setPlacingOrder] =
    useState(false);

  const [address, setAddress] =
    useState({
      name: "",
      phone: "",
      address: "",
      city: "",
      pincode: "",
    });

  const [payment, setPayment] =
    useState(
      "Cash on Delivery"
    );

  // ==================================================
  // LOAD CART
  // ==================================================

  useEffect(() => {

    const loadCart = async () => {

      try {

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const token =
          localStorage.getItem(
            "token"
          );

        if (!user || !user.id) {

          alert(
            "Please login first."
          );

          navigate("/login");

          return;
        }

        const response =
          await axios.get(
            `${API_URL}/api/cart`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "CART RESPONSE:",
          response.data
        );

        const cartData =
          response.data.cart ||
          response.data.items ||
          [];

        setCart(cartData);

      } catch (error) {

        console.error(
          "LOAD CART ERROR:",
          error
        );

        alert(
          error.response?.data
            ?.message ||
          "Unable to load cart."
        );

      } finally {

        setLoading(false);

      }

    };

    loadCart();

  }, [API_URL, navigate]);

  // ==================================================
  // TOTAL
  // ==================================================

  const total =
    cart.reduce(
      (sum, item) => {

        const price =
          Number(
            item.price ||
            item.product_price ||
            0
          );

        const quantity =
          Number(
            item.quantity || 0
          );

        return (
          sum +
          price * quantity
        );

      },
      0
    );

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange =
    (e) => {

      setAddress({
        ...address,

        [e.target.name]:
          e.target.value,
      });

    };

  // ==================================================
  // PLACE ORDER
  // ==================================================

  const placeOrder =
    async (e) => {

      e.preventDefault();

      // CHECK ADDRESS
      if (
        !address.name.trim() ||
        !address.phone.trim() ||
        !address.address.trim() ||
        !address.city.trim() ||
        !address.pincode.trim()
      ) {

        alert(
          "Please enter all delivery details."
        );

        return;
      }

      // CHECK CART
      if (cart.length === 0) {

        alert(
          "Your cart is empty."
        );

        navigate("/products");

        return;
      }

      try {

        setPlacingOrder(true);

        const user =
          JSON.parse(
            localStorage.getItem(
              "user"
            )
          );

        const token =
          localStorage.getItem(
            "token"
          );

        if (!user || !user.id) {

          alert(
            "Please login first."
          );

          navigate("/login");

          return;
        }

        console.log(
          "================================="
        );

        console.log(
          "PLACING ORDER"
        );

        console.log(
          "USER:",
          user.id
        );

        console.log(
          "PAYMENT:",
          payment
        );

        console.log(
          "ADDRESS:",
          address
        );

        const response =
          await axios.post(
            `${API_URL}/api/orders`,
            {
              userId: user.id,
              payment: payment,
              address: address,
            },
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "ORDER RESPONSE:",
          response.data
        );

        if (
          response.data.success
        ) {

          const order = {

            id:
              response.data.orderId,

            total:
              Number(
                response.data.total ||
                total
              ),

            payment:
              response.data.payment ||
              payment,

            address:
              address,

            status:
              "Confirmed",

            date:
              new Date()
                .toLocaleString(),

          };

          navigate(
            "/order-confirmation",
            {
              state: {
                order: order,
              },
            }
          );

        } else {

          alert(
            response.data.message ||
            "Order failed."
          );

        }

      } catch (error) {

        console.error(
          "================================="
        );

        console.error(
          "PLACE ORDER ERROR:",
          error
        );

        console.error(
          "SERVER RESPONSE:",
          error.response?.data
        );

        console.error(
          "================================="
        );

        alert(
          error.response?.data
            ?.error ||
          error.response?.data
            ?.message ||
          "Failed to place order."
        );

      } finally {

        setPlacingOrder(false);

      }

    };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (
      <div
        style={styles.loading}
      >
        Loading checkout...
      </div>
    );

  }

  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div
      style={styles.container}
    >

      <h1>
        Checkout
      </h1>

      <form
        onSubmit={placeOrder}
      >

        {/* DELIVERY */}

        <div
          style={styles.card}
        >

          <h2>
            Delivery Address
          </h2>

          <input
            name="name"
            placeholder="Full Name"
            value={address.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="address"
            placeholder="Complete Address"
            value={address.address}
            onChange={handleChange}
            style={{
              ...styles.input,
              minHeight: "100px",
            }}
          />

          <input
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleChange}
            style={styles.input}
          />

        </div>

        {/* PAYMENT */}

        <div
          style={styles.card}
        >

          <h2>
            Payment Method
          </h2>

          <label
            style={styles.radio}
          >

            <input
              type="radio"
              value="Cash on Delivery"
              checked={
                payment ===
                "Cash on Delivery"
              }
              onChange={(e) =>
                setPayment(
                  e.target.value
                )
              }
            />

            {" "}
            Cash on Delivery

          </label>

          <label
            style={styles.radio}
          >

            <input
              type="radio"
              value="UPI"
              checked={
                payment === "UPI"
              }
              onChange={(e) =>
                setPayment(
                  e.target.value
                )
              }
            />

            {" "}
            UPI

          </label>

          <label
            style={styles.radio}
          >

            <input
              type="radio"
              value="Card"
              checked={
                payment === "Card"
              }
              onChange={(e) =>
                setPayment(
                  e.target.value
                )
              }
            />

            {" "}
            Debit / Credit Card

          </label>

        </div>

        {/* ORDER SUMMARY */}

        <div
          style={styles.card}
        >

          <h2>
            Order Summary
          </h2>

          {cart.map(
            (item, index) => {

              const price =
                Number(
                  item.price ||
                  item.product_price ||
                  0
                );

              const quantity =
                Number(
                  item.quantity || 0
                );

              return (

                <div
                  key={
                    item.id ||
                    item.product_id ||
                    index
                  }
                  style={
                    styles.row
                  }
                >

                  <span>
                    {item.name ||
                      item.product_name ||
                      "Product"}

                    {" × "}

                    {quantity}
                  </span>

                  <strong>
                    ₹
                    {(
                      price *
                      quantity
                    ).toFixed(2)}
                  </strong>

                </div>

              );

            }
          )}

          <hr />

          <div
            style={styles.total}
          >

            <strong>
              Total Amount
            </strong>

            <strong>
              ₹
              {total.toFixed(2)}
            </strong>

          </div>

          <button
            type="submit"
            disabled={
              placingOrder
            }
            style={
              styles.button
            }
          >

            {placingOrder
              ? "⏳ Placing Order..."
              : "Place Order"}

          </button>

        </div>

      </form>

    </div>

  );
}

// ==================================================
// STYLES
// ==================================================

const styles = {

  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "40px 20px",
    minHeight: "100vh",
    background: "#f5f8f4",
  },

  loading: {
    textAlign: "center",
    padding: "100px",
    fontSize: "20px",
  },

  card: {
    background: "white",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    boxSizing: "border-box",
    border:
      "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "15px",
  },

  radio: {
    display: "block",
    margin: "15px 0",
    fontSize: "16px",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    padding: "10px 0",
  },

  total: {
    display: "flex",
    justifyContent:
      "space-between",
    fontSize: "20px",
    margin:
      "20px 0",
  },

  button: {
    width: "100%",
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "7px",
    fontSize: "17px",
    cursor: "pointer",
  },

};

export default Checkout;