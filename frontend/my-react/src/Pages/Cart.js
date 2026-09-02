import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  const getUser = () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      return user;
    } catch (error) {
      console.error(
        "USER DATA ERROR:",
        error
      );

      return null;
    }
  };

  // ==========================================
  // GET CART FROM MYSQL
  // ==========================================

  const loadCart = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getUser();

      if (!user || !user.id) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      console.log(
        "Getting cart for user:",
        user.id
      );

      const response = await axios.get(
        `${API_URL}/api/cart/${user.id}`
      );

      console.log(
        "CART RESPONSE:",
        response.data
      );

      if (response.data.success) {
        setCart(
          Array.isArray(response.data.items)
            ? response.data.items
            : []
        );
      } else {
        setCart([]);
        setError(
          response.data.message ||
            "Failed to load cart"
        );
      }

    } catch (error) {

      console.error(
        "GET CART ERROR:",
        error
      );

      if (
        error.response?.data?.message
      ) {
        setError(
          error.response.data.message
        );
      } else {
        setError(
          "Unable to load cart. Please check the server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================================
  // UPDATE QUANTITY
  // ==========================================

  const updateQuantity = async (
    cartId,
    newQuantity
  ) => {
    try {

      if (newQuantity < 1) {
        await removeItem(cartId);
        return;
      }

      await axios.put(
        `${API_URL}/api/cart/${cartId}`,
        {
          quantity: newQuantity,
        }
      );

      await loadCart();

    } catch (error) {

      console.error(
        "UPDATE CART ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update cart"
      );
    }
  };

  // ==========================================
  // REMOVE ITEM
  // ==========================================

  const removeItem = async (cartId) => {
    try {

      await axios.delete(
        `${API_URL}/api/cart/${cartId}`
      );

      await loadCart();

    } catch (error) {

      console.error(
        "DELETE CART ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to remove item"
      );
    }
  };

  // ==========================================
  // TOTAL
  // ==========================================

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  // ==========================================
  // PLACE ORDER
  // ==========================================

  const placeOrder = async () => {

    if (cart.length === 0) {
      alert(
        "Your cart is empty."
      );

      return;
    }

    try {

      const user = getUser();

      if (!user || !user.id) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      console.log(
        "Placing order for user:",
        user.id
      );

      const response =
        await axios.post(
          `${API_URL}/api/orders`,
          {
            userId: user.id,
            total: total,
            items: cart,
          }
        );

      console.log(
        "ORDER RESPONSE:",
        response.data
      );

      if (response.data.success) {

        alert(
          "Order placed successfully!"
        );

        // Reload cart from MySQL.
        // Backend should have deleted cart_items.
        await loadCart();

        navigate("/orders");

      } else {

        alert(
          response.data.message ||
            "Failed to place order"
        );
      }

    } catch (error) {

      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to place order"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div style={styles.container}>
        <h1>🛒 My Cart</h1>

        <div style={styles.message}>
          Loading cart...
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div style={styles.container}>

      <div style={styles.header}>

        <div>
          <h1>🛒 My Cart</h1>

          <p style={styles.subtitle}>
            Your products from MySQL database
          </p>
        </div>

        <Link
          to="/products"
          style={styles.back}
        >
          ← Continue Shopping
        </Link>

      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {/* EMPTY CART */}

      {cart.length === 0 ? (

        <div style={styles.empty}>

          <div style={styles.emptyIcon}>
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            Add products from the
            products page.
          </p>

          <Link
            to="/products"
            style={styles.shopButton}
          >
            View Products
          </Link>

        </div>

      ) : (

        <>

          {/* CART ITEMS */}

          {cart.map((item) => (

            <div
              key={item.id}
              style={styles.item}
            >

              <div style={styles.productInfo}>

                <div style={styles.emoji}>
                  {item.emoji || "🥛"}
                </div>

                <div>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    ₹
                    {Number(
                      item.price
                    ).toFixed(2)}
                  </p>

                  {item.unit && (
                    <small>
                      {item.unit}
                    </small>
                  )}

                </div>

              </div>

              <div style={styles.controls}>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      Number(
                        item.quantity
                      ) - 1
                    )
                  }
                  style={styles.quantityButton}
                >
                  −
                </button>

                <strong>
                  {item.quantity}
                </strong>

                <button
                  onClick={() =>
                    updateQuantity(
                      item.id,
                      Number(
                        item.quantity
                      ) + 1
                    )
                  }
                  style={styles.quantityButton}
                >
                  +
                </button>

                <button
                  onClick={() =>
                    removeItem(item.id)
                  }
                  style={styles.remove}
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

          {/* TOTAL */}

          <div style={styles.total}>

            <div>

              <p>
                Total Items:{" "}
                <strong>
                  {cart.reduce(
                    (sum, item) =>
                      sum +
                      Number(
                        item.quantity
                      ),
                    0
                  )}
                </strong>
              </p>

              <h2>
                Total: ₹
                {total.toFixed(2)}
              </h2>

            </div>

            <button
              onClick={placeOrder}
              style={styles.orderButton}
            >
              📦 Place Order
            </button>

          </div>

        </>
      )}

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
    background: "#f8faf8",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    gap: "20px",
    flexWrap: "wrap",
  },

  subtitle: {
    color: "#777",
  },

  back: {
    background: "#2e7d32",
    color: "white",
    padding: "10px 18px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
  },

  message: {
    background: "white",
    padding: "40px",
    textAlign: "center",
    borderRadius: "15px",
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
    padding: "60px",
    borderRadius: "15px",
    textAlign: "center",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.06)",
  },

  emptyIcon: {
    fontSize: "70px",
  },

  shopButton: {
    display: "inline-block",
    marginTop: "15px",
    background: "#2e7d32",
    color: "white",
    padding: "12px 22px",
    borderRadius: "8px",
    textDecoration: "none",
  },

  item: {
    background: "white",
    marginBottom: "15px",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
    boxShadow:
      "0 3px 10px rgba(0,0,0,0.05)",
  },

  productInfo: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  emoji: {
    fontSize: "50px",
  },

  controls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  quantityButton: {
    width: "35px",
    height: "35px",
    border: "none",
    borderRadius: "6px",
    background: "#e8f5e9",
    cursor: "pointer",
    fontSize: "20px",
  },

  remove: {
    background: "#e53935",
    color: "white",
    border: "none",
    padding: "9px 13px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  total: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    marginTop: "20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },

  orderButton: {
    padding: "14px 25px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default Cart;