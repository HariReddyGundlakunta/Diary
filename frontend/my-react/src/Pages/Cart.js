import React from "react";
import { Link } from "react-router-dom";

function Cart({ cart, setCart }) {

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;

    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  const total = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div style={styles.empty}>
        <h1>🛒 Your Cart is Empty</h1>

        <Link
          to="/products"
          style={styles.button}
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <h1>Shopping Cart</h1>

      {cart.map((item) => (

        <div
          key={item.id}
          style={styles.item}
        >

          <div style={styles.emoji}>
            {item.emoji}
          </div>

          <div style={styles.info}>
            <h3>{item.name}</h3>
            <p>₹{item.price}</p>
          </div>

          <div>

            <button
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity - 1
                )
              }
            >
              −
            </button>

            <span style={styles.quantity}>
              {item.quantity}
            </span>

            <button
              onClick={() =>
                updateQuantity(
                  item.id,
                  item.quantity + 1
                )
              }
            >
              +
            </button>

          </div>

          <strong>
            ₹{item.price * item.quantity}
          </strong>

          <button
            onClick={() =>
              removeItem(item.id)
            }
            style={styles.remove}
          >
            Remove
          </button>

        </div>

      ))}

      <div style={styles.summary}>

        <h2>Total: ₹{total}</h2>

        <Link
          to="/checkout"
          style={styles.checkout}
        >
          Proceed to Checkout
        </Link>

      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "1000px",
    margin: "auto",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
    padding: "20px",
    marginBottom: "15px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },

  emoji: {
    fontSize: "50px",
  },

  info: {
    flex: 1,
  },

  quantity: {
    margin: "0 15px",
  },

  remove: {
    background: "#c62828",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "5px",
  },

  summary: {
    textAlign: "right",
    marginTop: "30px",
  },

  checkout: {
    background: "#2e7d32",
    color: "white",
    padding: "13px 25px",
    textDecoration: "none",
    borderRadius: "7px",
  },

  empty: {
    textAlign: "center",
    padding: "100px",
  },

  button: {
    display: "inline-block",
    padding: "12px 25px",
    background: "#2e7d32",
    color: "white",
    textDecoration: "none",
    borderRadius: "7px",
  },
};

export default Cart;