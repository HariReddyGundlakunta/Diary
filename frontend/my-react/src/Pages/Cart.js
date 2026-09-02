import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function Cart() {

  const navigate = useNavigate();

  // ==================================================
  // API URL
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  // ==================================================
  // STATE
  // ==================================================

  const [cart, setCart] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);

  // ==================================================
  // LOAD CART
  // ==================================================

  const loadCart = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        const user =
          JSON.parse(
            localStorage.getItem("user")
          );

        const token =
          localStorage.getItem("token");

        if (!user || !user.id) {

          alert(
            "Please login to view your cart."
          );

          navigate("/login");

          return;
        }

        const response =
          await axios.get(
            `${API_URL}/api/cart/${user.id}`,
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

        setCart(
          Array.isArray(cartData)
            ? cartData
            : []
        );

      } catch (err) {

        console.error(
          "LOAD CART ERROR:",
          err
        );

        console.error(
          "SERVER RESPONSE:",
          err.response?.data
        );

        setError(
          err.response?.data?.message ||
          "Unable to load cart."
        );

      } finally {

        setLoading(false);

      }

    },
    [API_URL, navigate]
  );

  // ==================================================
  // LOAD CART ON PAGE LOAD
  // ==================================================

  useEffect(() => {

    loadCart();

  }, [loadCart]);

  // ==================================================
  // GET PRICE
  // ==================================================

  const getPrice = (item) => {

    return Number(
      item.price ||
      item.product_price ||
      0
    );

  };

  // ==================================================
  // GET PRODUCT NAME
  // ==================================================

  const getProductName = (item) => {

    return (
      item.name ||
      item.product_name ||
      "Product"
    );

  };

  // ==================================================
  // GET PRODUCT IMAGE
  // ==================================================

  const getProductImage = (item) => {

    if (item.image) {
      return item.image;
    }

    return "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80";

  };

  // ==================================================
  // TOTAL
  // ==================================================

  const total = cart.reduce(
    (sum, item) => {

      const price =
        getPrice(item);

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
  // UPDATE QUANTITY
  // ==================================================

  const updateQuantity = async (
    item,
    newQuantity
  ) => {

    if (newQuantity < 1) {
      return;
    }

    try {

      setUpdatingId(
        item.id ||
        item.cart_id ||
        item.product_id
      );

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const token =
        localStorage.getItem("token");

      if (!user || !user.id) {

        navigate("/login");

        return;
      }

      const cartItemId =
        item.id ||
        item.cart_id;

      await axios.put(
        `${API_URL}/api/cart/${cartItemId}`,
        {
          quantity:
            newQuantity,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      await loadCart();

    } catch (err) {

      console.error(
        "UPDATE CART ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      alert(
        err.response?.data?.message ||
        "Unable to update quantity."
      );

    } finally {

      setUpdatingId(null);

    }

  };

  // ==================================================
  // REMOVE ITEM
  // ==================================================

  const removeItem = async (item) => {

    try {

      setUpdatingId(
        item.id ||
        item.cart_id ||
        item.product_id
      );

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      const token =
        localStorage.getItem("token");

      if (!user || !user.id) {

        navigate("/login");

        return;
      }

      const cartItemId =
        item.id ||
        item.cart_id;

      await axios.delete(
        `${API_URL}/api/cart/${cartItemId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      await loadCart();

    } catch (err) {

      console.error(
        "REMOVE CART ERROR:",
        err
      );

      console.error(
        "SERVER RESPONSE:",
        err.response?.data
      );

      alert(
        err.response?.data?.message ||
        "Unable to remove item."
      );

    } finally {

      setUpdatingId(null);

    }

  };

  // ==================================================
  // PROCEED TO CHECKOUT
  // ==================================================

  const goToCheckout = () => {

    if (
      !cart ||
      cart.length === 0
    ) {

      alert(
        "Your cart is empty."
      );

      return;
    }

    navigate("/checkout");

  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div
        style={styles.loading}
      >

        <div
          style={styles.loadingIcon}
        >
          🛒
        </div>

        <h2>
          Loading your cart...
        </h2>

      </div>

    );

  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (

      <div
        style={styles.loading}
      >

        <div
          style={styles.errorIcon}
        >
          ⚠️
        </div>

        <h2>
          {error}
        </h2>

        <button
          onClick={loadCart}
          style={styles.retryButton}
        >
          Try Again
        </button>

      </div>

    );

  }

  // ==================================================
  // EMPTY CART
  // ==================================================

  if (cart.length === 0) {

    return (

      <div
        style={styles.page}
      >

        {/* NAVBAR */}

        <nav
          style={styles.navbar}
        >

          <Link
            to="/home"
            style={styles.logo}
          >
            🥛 HARI FARMS
          </Link>

          <div
            style={styles.navLinks}
          >

            <Link
              to="/home"
              style={styles.navLink}
            >
              Home
            </Link>

            <Link
              to="/products"
              style={styles.navLink}
            >
              Products
            </Link>

            <span
              style={styles.cartActive}
            >
              🛒 Cart
            </span>

          </div>

        </nav>

        {/* EMPTY CART */}

        <div
          style={styles.emptyContainer}
        >

          <div
            style={styles.emptyIcon}
          >
            🛒
          </div>

          <h1>
            Your Cart is Empty
          </h1>

          <p>
            Add some fresh dairy products
            to your cart.
          </p>

          <button
            onClick={() =>
              navigate("/products")
            }
            style={styles.shopButton}
          >
            Continue Shopping
          </button>

        </div>

      </div>

    );

  }

  // ==================================================
  // CART PAGE
  // ==================================================

  return (

    <div
      style={styles.page}
    >

      {/* ==================================================
          NAVBAR
      ================================================== */}

      <nav
        style={styles.navbar}
      >

        <Link
          to="/home"
          style={styles.logo}
        >
          🥛 HARI FARMS
        </Link>

        <div
          style={styles.navLinks}
        >

          <Link
            to="/home"
            style={styles.navLink}
          >
            Home
          </Link>

          <Link
            to="/products"
            style={styles.navLink}
          >
            Products
          </Link>

          <span
            style={styles.cartActive}
          >
            🛒 Cart
          </span>

        </div>

      </nav>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        style={styles.main}
      >

        <h1
          style={styles.heading}
        >
          Shopping Cart
        </h1>

        <div
          style={styles.content}
        >

          {/* ==============================================
              CART ITEMS
          =============================================== */}

          <div
            style={styles.itemsSection}
          >

            {cart.map(
              (item, index) => {

                const price =
                  getPrice(item);

                const quantity =
                  Number(
                    item.quantity || 0
                  );

                const itemId =
                  item.id ||
                  item.cart_id ||
                  item.product_id ||
                  index;

                const itemTotal =
                  price * quantity;

                const isUpdating =
                  updatingId === itemId;

                return (

                  <div
                    key={itemId}
                    style={styles.itemCard}
                  >

                    {/* IMAGE */}

                    <img
                      src={
                        getProductImage(
                          item
                        )
                      }
                      alt={
                        getProductName(
                          item
                        )
                      }
                      style={
                        styles.productImage
                      }
                    />

                    {/* DETAILS */}

                    <div
                      style={
                        styles.itemDetails
                      }
                    >

                      <h3>
                        {
                          getProductName(
                            item
                          )
                        }
                      </h3>

                      <p
                        style={
                          styles.unit
                        }
                      >
                        ₹
                        {price.toFixed(2)}
                      </p>

                      {/* QUANTITY */}

                      <div
                        style={
                          styles.quantityBox
                        }
                      >

                        <button
                          type="button"
                          disabled={
                            isUpdating ||
                            quantity <= 1
                          }
                          onClick={() =>
                            updateQuantity(
                              item,
                              quantity - 1
                            )
                          }
                          style={
                            styles.quantityButton
                          }
                        >
                          −
                        </button>

                        <span
                          style={
                            styles.quantity
                          }
                        >
                          {quantity}
                        </span>

                        <button
                          type="button"
                          disabled={
                            isUpdating
                          }
                          onClick={() =>
                            updateQuantity(
                              item,
                              quantity + 1
                            )
                          }
                          style={
                            styles.quantityButton
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                    {/* ITEM TOTAL */}

                    <div
                      style={
                        styles.itemRight
                      }
                    >

                      <strong
                        style={
                          styles.itemTotal
                        }
                      >
                        ₹
                        {itemTotal.toFixed(2)}
                      </strong>

                      <button
                        type="button"
                        disabled={
                          isUpdating
                        }
                        onClick={() =>
                          removeItem(item)
                        }
                        style={
                          styles.removeButton
                        }
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                );

              }
            )}

          </div>

          {/* ==============================================
              SUMMARY
          =============================================== */}

          <div
            style={styles.summary}
          >

            <h2>
              Order Summary
            </h2>

            <div
              style={styles.summaryRow}
            >

              <span>
                Items
              </span>

              <span>
                {cart.length}
              </span>

            </div>

            <div
              style={styles.summaryRow}
            >

              <span>
                Subtotal
              </span>

              <strong>
                ₹
                {total.toFixed(2)}
              </strong>

            </div>

            <div
              style={styles.summaryRow}
            >

              <span>
                Delivery
              </span>

              <strong>
                FREE
              </strong>

            </div>

            <hr />

            <div
              style={styles.totalRow}
            >

              <strong>
                Total
              </strong>

              <strong>
                ₹
                {total.toFixed(2)}
              </strong>

            </div>

            {/* IMPORTANT:
                THIS NOW GOES TO CHECKOUT */}

            <button
              type="button"
              onClick={
                goToCheckout
              }
              style={
                styles.checkoutButton
              }
            >
              Proceed to Checkout
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
              style={
                styles.continueButton
              }
            >
              Continue Shopping
            </button>

          </div>

        </div>

      </main>

    </div>

  );
}

// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5f8f4",
  },

  navbar: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding:
      "18px 50px",
    background: "#ffffff",
    boxShadow:
      "0 2px 10px rgba(0,0,0,0.08)",
  },

  logo: {
    textDecoration: "none",
    color: "#2e7d32",
    fontSize: "22px",
    fontWeight: "bold",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
  },

  cartActive: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: "16px",
  },

  main: {
    maxWidth: "1100px",
    margin: "auto",
    padding:
      "40px 20px",
  },

  heading: {
    marginBottom: "30px",
    color: "#222",
  },

  content: {
    display: "grid",
    gridTemplateColumns:
      "1fr 350px",
    gap: "25px",
    alignItems: "start",
  },

  itemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  itemCard: {
    background: "#ffffff",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
  },

  productImage: {
    width: "110px",
    height: "110px",
    objectFit: "cover",
    borderRadius: "10px",
  },

  itemDetails: {
    flex: 1,
  },

  unit: {
    color: "#666",
    margin:
      "5px 0 12px",
  },

  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  quantityButton: {
    width: "32px",
    height: "32px",
    border: "1px solid #ccc",
    background: "#fff",
    borderRadius: "6px",
    fontSize: "20px",
    cursor: "pointer",
  },

  quantity: {
    minWidth: "25px",
    textAlign: "center",
    fontWeight: "bold",
  },

  itemRight: {
    textAlign: "right",
  },

  itemTotal: {
    display: "block",
    marginBottom: "12px",
    fontSize: "17px",
  },

  removeButton: {
    border: "none",
    background: "transparent",
    color: "#d32f2f",
    cursor: "pointer",
    fontSize: "14px",
  },

  summary: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow:
      "0 3px 12px rgba(0,0,0,0.08)",
    position: "sticky",
    top: "20px",
  },

  summaryRow: {
    display: "flex",
    justifyContent:
      "space-between",
    margin:
      "15px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent:
      "space-between",
    margin:
      "20px 0",
    fontSize: "20px",
  },

  checkoutButton: {
    width: "100%",
    background: "#2e7d32",
    color: "#ffffff",
    border: "none",
    padding: "15px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: "12px",
  },

  continueButton: {
    width: "100%",
    background: "#ffffff",
    color: "#2e7d32",
    border:
      "1px solid #2e7d32",
    padding: "13px",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer",
  },

  emptyContainer: {
    maxWidth: "600px",
    margin: "100px auto",
    textAlign: "center",
    padding: "40px 20px",
  },

  emptyIcon: {
    fontSize: "70px",
    marginBottom: "20px",
  },

  shopButton: {
    marginTop: "20px",
    background: "#2e7d32",
    color: "#ffffff",
    border: "none",
    padding:
      "14px 30px",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f8f4",
  },

  loadingIcon: {
    fontSize: "60px",
  },

  errorIcon: {
    fontSize: "50px",
  },

  retryButton: {
    marginTop: "15px",
    padding:
      "12px 25px",
    border: "none",
    borderRadius: "7px",
    background: "#2e7d32",
    color: "white",
    cursor: "pointer",
  },

};

export default Cart;