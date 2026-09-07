import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
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

  const [total, setTotal] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  const [checkoutLoading, setCheckoutLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // ==================================================
  // FETCH CART
  // ==================================================

  const fetchCart =
    useCallback(async () => {

      try {

        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");


        // CHECK LOGIN

        if (!token) {

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }


        // GET CART

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


        if (response.data.success) {

          const items =

            Array.isArray(
              response.data.cartItems
            )

              ? response.data.cartItems

              : Array.isArray(
                  response.data.items
                )

              ? response.data.items

              : Array.isArray(
                  response.data.cart
                )

              ? response.data.cart

              : [];


          setCartItems(items);


          const calculatedTotal =

            response.data.total !== undefined

              ? Number(response.data.total)

              : items.reduce(
                  (sum, item) => {

                    return (
                      sum +

                      (
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      )
                    );

                  },
                  0
                );


          setTotal(calculatedTotal);

        } else {

          setCartItems([]);
          setTotal(0);

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

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to fetch cart"

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

        setError("");
        setMessage("");


        if (quantity < 1) {

          return;

        }


        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate("/login");

          return;

        }


        const response =
          await axios.put(

            `${API_URL}/api/cart/${productId}`,

            {
              quantity,
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
          "UPDATE CART RESPONSE:",
          response.data
        );


        await fetchCart();


      } catch (error) {

        console.error(
          "UPDATE CART ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to update quantity"

        );

      }

    };


  // ==================================================
  // REMOVE PRODUCT
  // ==================================================

  const removeFromCart =
    async (productId) => {

      try {

        setError("");
        setMessage("");


        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate("/login");

          return;

        }


        if (!productId) {

          console.error(
            "Product ID is missing"
          );

          return;

        }


        const response =
          await axios.delete(

            `${API_URL}/api/cart/${productId}`,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },
            }

          );


        console.log(
          "REMOVE CART RESPONSE:",
          response.data
        );


        if (response.data.success) {

          setMessage(
            "Product removed from cart successfully"
          );

          await fetchCart();

        } else {

          setError(

            response.data.message ||

            "Failed to remove product"

          );

        }


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

  const handleCheckout =
    async () => {

      try {

        setError("");
        setMessage("");


        // GET TOKEN

        const token =
          localStorage.getItem("token");


        if (!token) {

          alert(
            "Please login first"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }


        // CHECK CART

        if (
          !Array.isArray(cartItems) ||
          cartItems.length === 0
        ) {

          setError(
            "Your cart is empty"
          );

          return;

        }


        // CONFIRM ORDER

        const confirmed =
          window.confirm(

            `Are you sure you want to place this order?

Total: ₹${Number(total).toFixed(2)}`

          );


        if (!confirmed) {

          return;

        }


        setCheckoutLoading(true);


        console.log(
          "🛒 PLACING ORDER..."
        );


        // PLACE ORDER

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
          "✅ CHECKOUT RESPONSE:",
          response.data
        );


        // SUCCESS

        if (response.data.success) {

          setMessage(

            `Order placed successfully! Order ID: ${

              response.data.orderId || ""

            }`

          );


          setCartItems([]);

          setTotal(0);


          setTimeout(
            () => {

              navigate("/orders");

            },
            1500
          );


        } else {

          setError(

            response.data.message ||

            "Failed to place order"

          );

        }


      } catch (error) {

        console.error(
          "❌ CHECKOUT ERROR:",
          error
        );


        console.error(
          "❌ SERVER RESPONSE:",
          error.response?.data
        );


        setError(

          error.response?.data?.message ||

          "Failed to place order"

        );


      } finally {

        setCheckoutLoading(false);

      }

    };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout =
    () => {

      localStorage.removeItem("token");

      localStorage.removeItem("user");


      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f5",
        padding: "30px",
      }}
    >


      {/* NAVBAR */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            margin: 0,
          }}
        >
          🌿 HARI FARMS
        </h2>


        <div>

          <button
            onClick={() =>
              navigate("/user-dashboard")
            }
            style={{
              marginRight: "10px",
            }}
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/products")
            }
            style={{
              marginRight: "10px",
            }}
          >
            Products
          </button>


          <button
            onClick={() =>
              navigate("/orders")
            }
            style={{
              marginRight: "10px",
            }}
          >
            📦 My Orders
          </button>


          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      <h1>
        🛒 My Cart
      </h1>


      {/* SUCCESS MESSAGE */}

      {
        message && (

          <div
            style={{
              background: "#e8f5e9",
              color: "#2e7d32",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >

            {message}

          </div>

        )
      }


      {/* ERROR MESSAGE */}

      {
        error && (

          <div
            style={{
              background: "#ffebee",
              color: "#d32f2f",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >

            {error}

          </div>

        )
      }


      {/* LOADING */}

      {
        loading && (

          <p>
            Loading cart...
          </p>

        )
      }


      {/* EMPTY CART */}

      {
        !loading &&
        cartItems.length === 0 && (

          <div
            style={{
              background: "#ffffff",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >

            <h3>
              Your cart is empty
            </h3>


            <button
              onClick={() =>
                navigate("/products")
              }
            >
              Continue Shopping
            </button>

          </div>

        )
      }


      {/* CART ITEMS */}

      {
        !loading &&
        cartItems.length > 0 && (

          <div>

            {
              cartItems.map(
                (item) => (

                  <div

                    key={
                      item.cart_id ||
                      item.product_id ||
                      item.id
                    }

                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      flexWrap:
                        "wrap",
                      gap: "15px",
                      background:
                        "#ffffff",
                      padding:
                        "20px",
                      marginBottom:
                        "15px",
                      borderRadius:
                        "12px",
                    }}

                  >


                    {/* PRODUCT */}

                    <div>

                      <h3>
                        {item.name}
                      </h3>


                      <p>

                        ₹{
                          Number(
                            item.price || 0
                          ).toFixed(2)
                        }

                      </p>

                    </div>


                    {/* QUANTITY */}

                    <div>

                      <button

                        onClick={() =>
                          updateQuantity(

                            item.product_id,

                            Number(
                              item.quantity
                            ) - 1

                          )
                        }

                      >
                        −
                      </button>


                      <span
                        style={{
                          margin:
                            "0 15px",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {item.quantity}
                      </span>


                      <button

                        onClick={() =>
                          updateQuantity(

                            item.product_id,

                            Number(
                              item.quantity
                            ) + 1

                          )
                        }

                      >
                        +
                      </button>

                    </div>


                    {/* SUBTOTAL */}

                    <div>

                      ₹{

                        (
                          Number(
                            item.price || 0
                          ) *

                          Number(
                            item.quantity || 0
                          )

                        ).toFixed(2)

                      }

                    </div>


                    {/* REMOVE */}

                    <button

                      onClick={() =>
                        removeFromCart(
                          item.product_id
                        )
                      }

                    >
                      Remove
                    </button>


                  </div>

                )

              )
            }


            {/* TOTAL */}

            <div
              style={{
                background:
                  "#ffffff",
                padding:
                  "25px",
                borderRadius:
                  "12px",
                marginTop:
                  "20px",
              }}
            >

              <h2>

                Total: ₹{

                  Number(
                    total
                  ).toFixed(2)

                }

              </h2>


              <button

                onClick={
                  handleCheckout
                }

                disabled={
                  checkoutLoading
                }

                style={{
                  width:
                    "100%",
                  padding:
                    "15px",
                  fontSize:
                    "18px",
                  cursor:
                    checkoutLoading
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    checkoutLoading
                      ? 0.7
                      : 1,
                }}

              >

                {
                  checkoutLoading
                    ? "Placing Order..."
                    : "Proceed to Checkout"
                }

              </button>

            </div>

          </div>

        )
      }


    </div>

  );

}


export default Cart;