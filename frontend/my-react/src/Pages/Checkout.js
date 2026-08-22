import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Checkout({ cart }) {

  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [payment, setPayment] =
    useState("Cash on Delivery");

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = (e) => {
    e.preventDefault();

    if (
      !address.name ||
      !address.phone ||
      !address.address ||
      !address.city ||
      !address.pincode
    ) {
      alert("Please enter delivery details");
      return;
    }

    const order = {
      id: Date.now(),
      products: cart,
      address,
      payment,
      total,
      date: new Date().toLocaleString(),
      status: "Confirmed",
    };

    const oldOrders =
      JSON.parse(
        localStorage.getItem("orders")
      ) || [];

    localStorage.setItem(
      "orders",
      JSON.stringify([
        ...oldOrders,
        order,
      ])
    );

    navigate("/order-confirmation", {
      state: { order },
    });
  };

  return (
    <div style={styles.container}>

      <h1>Checkout</h1>

      <form onSubmit={placeOrder}>

        <div style={styles.card}>

          <h2>Delivery Address</h2>

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
            style={styles.input}
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

        <div style={styles.card}>

          <h2>Payment Method</h2>

          <label>
            <input
              type="radio"
              value="Cash on Delivery"
              checked={
                payment === "Cash on Delivery"
              }
              onChange={(e) =>
                setPayment(e.target.value)
              }
            />
            Cash on Delivery
          </label>

          <br />

          <label>
            <input
              type="radio"
              value="UPI"
              checked={payment === "UPI"}
              onChange={(e) =>
                setPayment(e.target.value)
              }
            />
            UPI
          </label>

          <br />

          <label>
            <input
              type="radio"
              value="Card"
              checked={payment === "Card"}
              onChange={(e) =>
                setPayment(e.target.value)
              }
            />
            Debit / Credit Card
          </label>

        </div>

        <div style={styles.summary}>

          <h2>Total Amount: ₹{total}</h2>

          <button
            type="submit"
            style={styles.button}
          >
            Place Order
          </button>

        </div>

      </form>

    </div>
  );
}

const styles = {
  container: {
    maxWidth: "800px",
    margin: "auto",
    padding: "40px",
  },

  card: {
    background: "white",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },

  summary: {
    textAlign: "right",
  },

  button: {
    background: "#2e7d32",
    color: "white",
    border: "none",
    padding: "14px 30px",
    borderRadius: "7px",
    fontSize: "16px",
  },
};

export default Checkout;