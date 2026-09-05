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
  // STATES
  // ==================================================

  const [cartItems, setCartItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [updatingId, setUpdatingId] =
    useState(null);


  // ==================================================
  // GET TOKEN
  // ==================================================

  const getToken = () => {

    return localStorage.getItem("token");

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


        // ----------------------------------------------
        // CHECK LOGIN
        // ----------------------------------------------

        if (!token) {

          setCartItems([]);

          setLoading(false);

          setError(
            "Please login to view your cart."
          );

          return;

        }


        // ----------------------------------------------
        // GET CART
        // ----------------------------------------------

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


        // ----------------------------------------------
        // HANDLE DIFFERENT RESPONSE FORMATS
        // ----------------------------------------------

        let items = [];


        if (
          Array.isArray(response.data)
        ) {

          items =
            response.data;

        }

        else if (
          Array.isArray(
            response.data.cartItems
          )
        ) {

          items =
            response.data.cartItems;

        }

        else if (
          Array.isArray(
            response.data.items
          )
        ) {

          items =
            response.data.items;

        }

        else if (
          Array.isArray(
            response.data.cart
          )
        ) {

          items =
            response.data.cart;

        }


        setCartItems(items);


      } catch (error) {

        console.error(
          "FETCH CART ERROR:",
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          setError(
            "Your login session expired. Please login again."
          );


          setCartItems([]);

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to load cart"

        );


      } finally {

        setLoading(false);

      }

    }, [API_URL]);


  // ==================================================
  // LOAD CART
  // ==================================================

  useEffect(() => {

    fetchCart();

  }, [fetchCart]);


  // ==================================================
  // UPDATE QUANTITY
  // ==================================================

  const updateQuantity =
    async (item, newQuantity) => {

      try {

        if (newQuantity < 1) {

          return;

        }


        const token =
          getToken();


        if (!token) {

          navigate("/login");

          return;

        }


        setUpdatingId(
          item.id
        );


        await axios.put(

          `${API_URL}/api/cart/${item.id}`,

          {
            quantity:
              newQuantity,
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

      } finally {

        setUpdatingId(
          null
        );

      }

    };


  // ==================================================
  // REMOVE FROM CART
  // ==================================================

  const removeFromCart =
    async (item) => {

      try {

        const token =
          getToken();


        if (!token) {

          navigate("/login");

          return;

        }


        setUpdatingId(
          item.id
        );


        await axios.delete(

          `${API_URL}/api/cart/${item.id}`,

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );


        setMessage(
          "Product removed from cart."
        );


        await fetchCart();


        setTimeout(() => {

          setMessage("");

        }, 2000);


      } catch (error) {

        console.error(
          "REMOVE CART ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to remove product"

        );

      } finally {

        setUpdatingId(
          null
        );

      }

    };


  // ==================================================
  // CHECKOUT
  // ==================================================

  const handleCheckout =
    async () => {

      try {

        setError("");

        setMessage("");


        const token =
          getToken();


        if (!token) {

          setError(
            "Please login before checkout."
          );


          setTimeout(() => {

            navigate("/login");

          }, 1000);


          return;

        }


        if (
          cartItems.length === 0
        ) {

          setError(
            "Your cart is empty."
          );

          return;

        }


        const response =
          await axios.post(

            `${API_URL}/api/orders/checkout`,

            {},

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
          "CHECKOUT RESPONSE:",
          response.data
        );


        setMessage(
          "🎉 Order placed successfully!"
        );


        setCartItems([]);


        setTimeout(() => {

          navigate("/orders");

        }, 1500);


      } catch (error) {

        console.error(
          "CHECKOUT ERROR:",
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          setError(
            "Your login session expired. Please login again."
          );


          setTimeout(() => {

            navigate("/login");

          }, 1500);


          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to place order"

        );

      }

    };


  // ==================================================
  // TOTAL
  // ==================================================

  const getItemPrice =
    (item) => {

      return Number(

        item.price ||

        item.product_price ||

        0

      );

    };


  const total =
    cartItems.reduce(

      (sum, item) => {

        const price =
          getItemPrice(item);

        const quantity =
          Number(item.quantity || 1);


        return (
          sum +
          price * quantity
        );

      },

      0

    );


  // ==================================================
  // IMAGE URL
  // ==================================================

  const getProductImage =
    (item) => {

      const image =
        item.image ||
        item.product_image ||
        "";


      if (!image) {

        return null;

      }


      if (
        image.startsWith("http")
      ) {

        return image;

      }


      return `${API_URL}${image}`;

    };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div style={styles.loading}>

        Loading your cart... 🛒

      </div>

    );

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div style={styles.page}>


      {/* ============================================== */}
      {/* NAVBAR */}
      {/* ============================================== */}

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
            to="/cart"
            style={styles.navLink}
          >

            🛒 Cart

          </Link>


          <Link
            to="/orders"
            style={styles.navLink}
          >

            📦 My Orders

          </Link>


        </div>

      </nav>


      {/* ============================================== */}
      {/* MAIN */}
      {/* ============================================== */}

      <main style={styles.main}>


        <h1 style={styles.title}>

          🛒 My Shopping Cart

        </h1>


        {/* SUCCESS */}

        {message && (

          <div style={styles.success}>

            {message}

          </div>

        )}


        {/* ERROR */}

        {error && (

          <div style={styles.error}>

            ❌ {error}

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

              🥛 Shop Products

            </Link>


          </div>

        ) : (

          <div style={styles.cartLayout}>


            {/* ======================================== */}
            {/* CART ITEMS */}
            {/* ======================================== */}

            <section style={styles.cartItems}>


              {cartItems.map(
                (item) => {

                  const imageUrl =
                    getProductImage(item);


                  const productName =
                    item.name ||
                    item.product_name ||
                    "Product";


                  const price =
                    getItemPrice(item);


                  return (

                    <div
                      key={item.id}
                      style={styles.cartItem}
                    >


                      {/* IMAGE */}

                      <div
                        style={styles.imageBox}
                      >

                        {imageUrl ? (

                          <img

                            src={imageUrl}

                            alt={productName}

                            style={styles.image}

                            onError={(event) => {

                              event.currentTarget.style.display =
                                "none";

                            }}

                          />

                        ) : (

                          <div
                            style={styles.emoji}
                          >

                            {
                              item.emoji ||
                              item.product_emoji ||
                              "🥛"
                            }

                          </div>

                        )}

                      </div>


                      {/* DETAILS */}

                      <div
                        style={styles.itemDetails}
                      >


                        <h3>

                          {productName}

                        </h3>


                        <p>

                          ₹{price.toFixed(2)}

                        </p>


                        {/* QUANTITY */}

                        <div
                          style={styles.quantityBox}
                        >


                          <button

                            disabled={
                              updatingId === item.id
                            }

                            style={styles.quantityButton}

                            onClick={() =>
                              updateQuantity(
                                item,
                                Number(item.quantity) - 1
                              )
                            }

                          >

                            −

                          </button>


                          <span
                            style={styles.quantity}
                          >

                            {item.quantity}

                          </span>


                          <button

                            disabled={
                              updatingId === item.id
                            }

                            style={styles.quantityButton}

                            onClick={() =>
                              updateQuantity(
                                item,
                                Number(item.quantity) + 1
                              )
                            }

                          >

                            +

                          </button>


                        </div>


                      </div>


                      {/* SUBTOTAL */}

                      <div
                        style={styles.itemRight}
                      >


                        <strong>

                          ₹
                          {
                            (
                              price *
                              Number(item.quantity || 1)
                            ).toFixed(2)
                          }

                        </strong>


                        <button

                          disabled={
                            updatingId === item.id
                          }

                          style={styles.removeButton}

                          onClick={() =>
                            removeFromCart(item)
                          }

                        >

                          🗑 Remove

                        </button>


                      </div>


                    </div>

                  );

                }
              )}


            </section>


            {/* ======================================== */}
            {/* ORDER SUMMARY */}
            {/* ======================================== */}

            <aside style={styles.summary}>


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


              <div style={styles.summaryRow}>

                <span>

                  Total

                </span>


                <strong
                  style={styles.total}
                >

                  ₹{total.toFixed(2)}

                </strong>

              </div>


              <button

                style={styles.checkoutButton}

                onClick={handleCheckout}

              >

                Proceed to Checkout →

              </button>


              <Link
                to="/products"
                style={styles.continueShopping}
              >

                ← Continue Shopping

              </Link>


            </aside>


          </div>

        )}


      </main>


      {/* FOOTER */}

      <footer style={styles.footer}>

        🥛 <strong>

          HARI FARMS

        </strong>

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


  navbar: {
    minHeight: "68px",
    background: "#2e7d32",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    gap: "20px",
    flexWrap: "wrap",
  },


  logo: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "800",
  },


  navLinks: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
  },


  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },


  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 25px 70px",
  },


  title: {
    color: "#205b26",
    marginBottom: "30px",
  },


  success: {
    background: "#dff5e1",
    color: "#1b5e20",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontWeight: "600",
  },


  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },


  cartLayout: {
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr",
    gap: "30px",
    alignItems: "start",
  },


  cartItems: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },


  cartItem: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
  },


  imageBox: {
    width: "100px",
    height: "100px",
    borderRadius: "14px",
    background: "#edf7ee",
    overflow: "hidden",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },


  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },


  emoji: {
    fontSize: "50px",
  },


  itemDetails: {
    flex: 1,
  },


  quantityBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
  },


  quantityButton: {
    width: "32px",
    height: "32px",
    border: "none",
    borderRadius: "8px",
    background: "#2e7d32",
    color: "#ffffff",
    fontSize: "20px",
    cursor: "pointer",
  },


  quantity: {
    fontWeight: "700",
    minWidth: "20px",
    textAlign: "center",
  },


  itemRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "15px",
  },


  removeButton: {
    border: "none",
    background: "#ffebee",
    color: "#c62828",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },


  summary: {
    background: "#ffffff",
    padding: "25px",
    borderRadius: "18px",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
    position: "sticky",
    top: "20px",
  },


  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 0",
    borderBottom:
      "1px solid #eeeeee",
  },


  total: {
    color: "#2e7d32",
    fontSize: "22px",
  },


  checkoutButton: {
    width: "100%",
    marginTop: "25px",
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "15px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "16px",
  },


  continueShopping: {
    display: "block",
    textAlign: "center",
    marginTop: "18px",
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "600",
  },


  emptyCart: {
    background: "#ffffff",
    padding: "70px 30px",
    borderRadius: "20px",
    textAlign: "center",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",
  },


  emptyIcon: {
    fontSize: "70px",
  },


  shopButton: {
    display: "inline-block",
    marginTop: "15px",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "13px 22px",
    borderRadius: "25px",
    textDecoration: "none",
    fontWeight: "700",
  },


  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },


  footer: {
    background: "#173d1b",
    color: "#ffffff",
    textAlign: "center",
    padding: "35px",
    marginTop: "40px",
  },

};


export default Cart;