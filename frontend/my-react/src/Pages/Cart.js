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

  const navigate =
    useNavigate();


  // ==================================================
  // API URL
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";


  // ==================================================
  // STATE
  // ==================================================

  const [cartItems, setCartItems] =
    useState([]);

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [checkingOut, setCheckingOut] =
    useState(false);


  // ==================================================
  // GET TOKEN
  // ==================================================

  const getToken = () => {

    return localStorage.getItem("token");

  };


  // ==================================================
  // AUTH HEADERS
  // ==================================================

  const getHeaders = () => {

    const token =
      getToken();

    return {

      headers: {

        Authorization:
          `Bearer ${token}`,

      },

    };

  };


  // ==================================================
  // FETCH CART
  // ==================================================

  const fetchCart =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");

        const token =
          getToken();


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.get(

            `${API_URL}/api/cart`,

            getHeaders()

          );


        console.log(
          "CART RESPONSE:",
          response.data
        );


        if (response.data.success) {

          setCartItems(
            response.data.cartItems || []
          );

          setTotal(
            Number(response.data.total || 0)
          );

        }


      } catch (error) {

        console.error(
          "FETCH CART ERROR:",
          error
        );


        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem("token");

          localStorage.removeItem("user");

          navigate("/login");

          return;

        }


        setError(
          error.response?.data?.message ||
          "Failed to load cart"
        );


      } finally {

        setLoading(false);

      }

    }, [
      API_URL,
      navigate,
    ]);


  // ==================================================
  // LOAD CART
  // ==================================================

  useEffect(() => {

    fetchCart();

  }, [
    fetchCart,
  ]);


  // ==================================================
  // UPDATE QUANTITY
  // ==================================================

  const updateQuantity =
    async (
      productId,
      quantity
    ) => {

      try {

        if (
          !productId ||
          Number(productId) <= 0
        ) {

          console.error(
            "Invalid Product ID:",
            productId
          );

          return;

        }


        if (
          quantity < 1
        ) {

          return;

        }


        await axios.put(

          `${API_URL}/api/cart/${productId}`,

          {

            quantity,

          },

          getHeaders()

        );


        await fetchCart();


      } catch (error) {

        console.error(
          "UPDATE CART ERROR:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Failed to update cart"
        );

      }

    };


  // ==================================================
  // REMOVE ITEM
  // ==================================================

  const removeItem =
    async (productId) => {

      try {

        if (
          !productId ||
          Number(productId) <= 0
        ) {

          console.error(
            "REMOVE ERROR: Invalid product ID:",
            productId
          );

          setError(
            "Invalid product ID"
          );

          return;

        }


        await axios.delete(

          `${API_URL}/api/cart/${productId}`,

          getHeaders()

        );


        setMessage(
          "Product removed from cart"
        );


        await fetchCart();


      } catch (error) {

        console.error(
          "REMOVE CART ERROR:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Failed to remove product"
        );

      }

    };


  // ==================================================
  // CHECKOUT
  // ==================================================

  const handleCheckout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login before checkout");
      navigate("/login");
      return;
    }

    const response = await axios.post(
      `${API_URL}/api/orders/checkout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("CHECKOUT RESPONSE:", response.data);

    if (response.data.success) {
      alert("Order placed successfully!");

      // Refresh cart
      fetchCart();

      // Go to My Orders page
      navigate("/orders");
    }

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    console.log(
      "SERVER RESPONSE:",
      error.response?.data
    );

    alert(
      error.response?.data?.message ||
      "Failed to place order"
    );
  }
};


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div style={styles.loading}>

        Loading your cart...

      </div>

    );

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div style={styles.page}>


      {/* NAVBAR */}

      <nav style={styles.navbar}>

        <Link
          to="/home"
          style={styles.logo}
        >

          🥛 HARI FARMS

        </Link>


        <div style={styles.navLinks}>

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


          <Link
            to="/my-orders"
            style={styles.navLink}
          >
            My Orders
          </Link>


          <Link
            to="/cart"
            style={styles.cartButton}
          >
            🛒 Cart
          </Link>


          <button
            onClick={handleLogout}
            style={styles.logout}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* MAIN */}

      <main style={styles.main}>


        <h1 style={styles.title}>

          🛒 My Shopping Cart

        </h1>


        {/* MESSAGE */}

        {message && (

          <div style={styles.success}>

            {message}

          </div>

        )}


        {error && (

          <div style={styles.error}>

            {error}

          </div>

        )}


        {/* EMPTY CART */}

        {cartItems.length === 0 ? (

          <div style={styles.emptyCart}>

            <div style={styles.emptyIcon}>

              🛒

            </div>


            <h2>

              Your Cart is Empty

            </h2>


            <p>

              Add fresh dairy products
              from HARI FARMS.

            </p>


            <Link
              to="/products"
              style={styles.shopButton}
            >

              Browse Products

            </Link>

          </div>

        ) : (


          <div style={styles.cartLayout}>


            {/* CART ITEMS */}

            <div style={styles.itemsSection}>


              {cartItems.map((item) => (

                <div
                  key={
                    item.cart_id ||
                    item.product_id
                  }
                  style={styles.cartItem}
                >


                  {/* PRODUCT IMAGE */}

                  <div style={styles.imageBox}>

                    {item.image ? (

                      <img
                        src={
                          item.image.startsWith("http")
                            ? item.image
                            : `${API_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`
                        }
                        alt={item.name}
                        style={styles.image}
                        onError={(event) => {

                          event.currentTarget.style.display =
                            "none";

                        }}
                      />

                    ) : (

                      <div style={styles.emoji}>

                        {item.emoji || "🥛"}

                      </div>

                    )}

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div style={styles.details}>

                    <h3 style={styles.productName}>

                      {item.name}

                    </h3>


                    <p style={styles.unit}>

                      {item.unit}

                    </p>


                    <p style={styles.price}>

                      ₹{Number(item.price).toFixed(2)}

                    </p>

                  </div>


                  {/* QUANTITY */}

                  <div style={styles.quantityBox}>

                    <button
                      style={styles.quantityButton}
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Number(item.quantity) - 1
                        )
                      }
                      disabled={
                        Number(item.quantity) <= 1
                      }
                    >

                      −

                    </button>


                    <span style={styles.quantity}>

                      {item.quantity}

                    </span>


                    <button
                      style={styles.quantityButton}
                      onClick={() =>
                        updateQuantity(
                          item.product_id,
                          Number(item.quantity) + 1
                        )
                      }
                    >

                      +

                    </button>

                  </div>


                  {/* TOTAL */}

                  <div style={styles.itemTotal}>

                    ₹
                    {(
                      Number(item.price) *
                      Number(item.quantity)
                    ).toFixed(2)}

                  </div>


                  {/* REMOVE */}

                  <button
                    style={styles.removeButton}
                    onClick={() =>
                      removeItem(
                        item.product_id
                      )
                    }
                  >

                    Remove

                  </button>


                </div>

              ))}

            </div>


            {/* ORDER SUMMARY */}

            <div style={styles.summary}>


              <h2>

                Order Summary

              </h2>


              <div style={styles.summaryRow}>

                <span>

                  Items

                </span>


                <span>

                  {cartItems.length}

                </span>

              </div>


              <div style={styles.line} />


              <div style={styles.totalRow}>

                <strong>

                  Total

                </strong>


                <strong style={styles.totalPrice}>

                  ₹{total.toFixed(2)}

                </strong>

              </div>


              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                style={{
                  ...styles.checkoutButton,

                  opacity:
                    checkingOut
                      ? 0.7
                      : 1,

                  cursor:
                    checkingOut
                      ? "not-allowed"
                      : "pointer",

                }}
              >

                {checkingOut
                  ? "Placing Order..."
                  : "Proceed to Checkout →"}

              </button>


              <Link
                to="/products"
                style={styles.continue}
              >

                ← Continue Shopping

              </Link>


            </div>


          </div>

        )}


      </main>


      {/* FOOTER */}

      <footer style={styles.footer}>

        🥛 <strong>HARI FARMS</strong>

        <p>

          Fresh From Farm • Pure For Family

        </p>

        <small>

          © 2026 HARI FARMS

        </small>

      </footer>


    </div>

  );

}


// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5faf5",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },

  loading: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
    fontWeight: "600",
  },

  navbar: {
    background: "#2e7d32",
    minHeight: "68px",
    padding: "0 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "15px",
  },

  logo: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "800",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },

  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },

  cartButton: {
    color: "#2e7d32",
    background: "#ffffff",
    padding: "9px 16px",
    borderRadius: "20px",
    textDecoration: "none",
    fontWeight: "700",
  },

  logout: {
    background: "#e53935",
    color: "#ffffff",
    border: "none",
    padding: "9px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "700",
  },

  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px 70px",
  },

  title: {
    color: "#205b26",
    marginBottom: "30px",
  },

  success: {
    background: "#dff5e1",
    color: "#176b24",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "600",
  },

  error: {
    background: "#ffe0e0",
    color: "#b71c1c",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "600",
  },

  emptyCart: {
    background: "#ffffff",
    padding: "70px 30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 5px 25px rgba(0,0,0,0.08)",
  },

  emptyIcon: {
    fontSize: "70px",
  },

  shopButton: {
    display: "inline-block",
    marginTop: "20px",
    background: "#2e7d32",
    color: "#ffffff",
    textDecoration: "none",
    padding: "13px 25px",
    borderRadius: "25px",
    fontWeight: "700",
  },

  cartLayout: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 2fr) minmax(300px, 1fr)",
    gap: "25px",
  },

  itemsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  cartItem: {
    background: "#ffffff",
    padding: "18px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.07)",
  },

  imageBox: {
    width: "90px",
    height: "90px",
    borderRadius: "12px",
    overflow: "hidden",
    background: "#eef7ee",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },

  emoji: {
    fontSize: "45px",
  },

  details: {
    flex: 1,
  },

  productName: {
    margin: "0 0 6px",
    color: "#26352a",
  },

  unit: {
    margin: "4px 0",
    color: "#777777",
  },

  price: {
    margin: "5px 0",
    color: "#2e7d32",
    fontWeight: "700",
  },

  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  quantityButton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    border: "none",
    background: "#e8f5e9",
    color: "#2e7d32",
    fontSize: "20px",
    cursor: "pointer",
  },

  quantity: {
    fontWeight: "700",
    minWidth: "25px",
    textAlign: "center",
  },

  itemTotal: {
    fontWeight: "800",
    color: "#205b26",
    minWidth: "90px",
  },

  removeButton: {
    background: "transparent",
    color: "#e53935",
    border: "none",
    cursor: "pointer",
    fontWeight: "700",
  },

  summary: {
    background: "#ffffff",
    padding: "28px",
    borderRadius: "20px",
    height: "fit-content",
    boxShadow:
      "0 5px 25px rgba(0,0,0,0.08)",
  },

  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "20px",
  },

  line: {
    height: "1px",
    background: "#e5e5e5",
    margin: "20px 0",
  },

  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "20px",
  },

  totalPrice: {
    color: "#2e7d32",
  },

  checkoutButton: {
    width: "100%",
    marginTop: "25px",
    padding: "15px",
    background: "#2e7d32",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
  },

  continue: {
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "600",
  },

  footer: {
    background: "#173d1b",
    color: "#ffffff",
    textAlign: "center",
    padding: "35px",
  },

};


export default Cart;