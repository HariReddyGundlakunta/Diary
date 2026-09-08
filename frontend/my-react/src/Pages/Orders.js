import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";


function Orders() {

  const navigate =
    useNavigate();


  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  const [orders, setOrders] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ==================================================
  // FETCH ORDERS
  // ==================================================

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }


        console.log(
          "Fetching my orders..."
        );


        const response =
          await axios.get(
            `${API_URL}/api/orders/my-orders`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );


        console.log(
          "MY ORDERS RESPONSE:",
          response.data
        );


        if (response.data.success) {

          setOrders(
            Array.isArray(response.data.orders)
              ? response.data.orders
              : []
          );

        } else {

          setError(
            response.data.message ||
            "Failed to fetch orders"
          );

        }

      } catch (error) {

        console.error(
          "FETCH ORDERS ERROR:",
          error
        );


        console.log(
          "SERVER RESPONSE:",
          error.response?.data
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
          "Failed to fetch your orders"
        );

      } finally {

        setLoading(false);

      }

    };


    fetchOrders();

  }, [API_URL, navigate]);


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

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
  // RETRY
  // ==================================================

  const handleRetry = () => {

    window.location.reload();

  };


  // ==================================================
  // FORMAT DATE
  // ==================================================

  const formatDate = (date) => {

    if (!date) {
      return "Not available";
    }

    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "Not available";
    }


    return parsedDate.toLocaleString();

  };


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f5",
        padding: "30px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >


      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}

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

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >


        <h2
          style={{
            margin: 0,
            color: "#2e7d32",
          }}
        >
          🌿 HARI FARMS
        </h2>


        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >


          <button
            onClick={() =>
              navigate("/user-dashboard")
            }
            style={{
              padding:
                "10px 16px",

              border: "none",

              borderRadius: "8px",

              cursor: "pointer",

              background:
                "#e8f5e9",

              color:
                "#2e7d32",

              fontWeight:
                "bold",
            }}
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/products")
            }
            style={{
              padding:
                "10px 16px",

              border: "none",

              borderRadius: "8px",

              cursor: "pointer",

              background:
                "#e8f5e9",

              color:
                "#2e7d32",

              fontWeight:
                "bold",
            }}
          >
            Products
          </button>


          <button
            onClick={() =>
              navigate("/cart")
            }
            style={{
              padding:
                "10px 16px",

              border: "none",

              borderRadius: "8px",

              cursor: "pointer",

              background:
                "#fff3e0",

              color:
                "#ef6c00",

              fontWeight:
                "bold",
            }}
          >
            🛒 Cart
          </button>


          <button
            onClick={handleLogout}
            style={{
              padding:
                "10px 16px",

              border: "none",

              borderRadius: "8px",

              cursor: "pointer",

              background:
                "#ffebee",

              color:
                "#c62828",

              fontWeight:
                "bold",
            }}
          >
            Logout
          </button>


        </div>

      </div>


      {/* ============================================ */}
      {/* TITLE */}
      {/* ============================================ */}

      <div
        style={{
          marginBottom: "25px",
        }}
      >

        <h1
          style={{
            marginBottom: "8px",
            color: "#1b5e20",
          }}
        >
          📦 My Orders
        </h1>


        <p
          style={{
            color: "#666",
          }}
        >
          View all your orders and their current status.
        </p>

      </div>


      {/* ============================================ */}
      {/* LOADING */}
      {/* ============================================ */}

      {
        loading && (

          <div
            style={{
              background: "#ffffff",

              padding: "30px",

              borderRadius: "12px",

              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",

              textAlign: "center",
            }}
          >

            <h3>
              Loading your orders...
            </h3>

            <p>
              Please wait while we fetch your orders.
            </p>

          </div>

        )
      }


      {/* ============================================ */}
      {/* ERROR */}
      {/* ============================================ */}

      {
        !loading &&
        error && (

          <div
            style={{
              background: "#fff3f3",

              color: "#d32f2f",

              padding: "25px",

              borderRadius: "12px",

              marginTop: "20px",

              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >

            <h3>
              Unable to load orders
            </h3>


            <p>
              {error}
            </p>


            <button
              onClick={handleRetry}
              style={{
                padding:
                  "10px 20px",

                border: "none",

                borderRadius: "8px",

                cursor: "pointer",

                background:
                  "#d32f2f",

                color:
                  "#ffffff",

                fontWeight:
                  "bold",
              }}
            >
              Try Again
            </button>

          </div>

        )
      }


      {/* ============================================ */}
      {/* EMPTY ORDERS */}
      {/* ============================================ */}

      {
        !loading &&
        !error &&
        orders.length === 0 && (

          <div
            style={{
              background: "#ffffff",

              padding: "40px",

              borderRadius: "12px",

              textAlign: "center",

              marginTop: "20px",

              boxShadow:
                "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >

            <div
              style={{
                fontSize: "60px",
              }}
            >
              📦
            </div>


            <h2>
              No orders found
            </h2>


            <p
              style={{
                color: "#666",
              }}
            >
              You haven't placed any orders yet.
            </p>


            <button
              onClick={() =>
                navigate("/products")
              }
              style={{
                padding:
                  "12px 25px",

                border: "none",

                borderRadius: "8px",

                cursor: "pointer",

                background:
                  "#2e7d32",

                color:
                  "#ffffff",

                fontWeight:
                  "bold",

                fontSize:
                  "16px",
              }}
            >
              Start Shopping
            </button>

          </div>

        )
      }


      {/* ============================================ */}
      {/* ORDERS */}
      {/* ============================================ */}

      {
        !loading &&
        !error &&
        orders.length > 0 && (

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",

              gap: "20px",
            }}
          >

            {
              orders.map(
                (order) => (

                  <div

                    key={
                      order.id ||
                      `${order.user_id}-${order.created_at}`
                    }

                    style={{

                      background:
                        "#ffffff",

                      padding:
                        "25px",

                      borderRadius:
                        "12px",

                      boxShadow:
                        "0 2px 10px rgba(0,0,0,0.08)",

                      borderLeft:
                        "5px solid #2e7d32",

                    }}

                  >


                    <h3
                      style={{
                        marginTop: 0,
                        color: "#1b5e20",
                      }}
                    >

                      📦 Order #{order.id}

                    </h3>


                    <div
                      style={{
                        marginTop: "20px",
                      }}
                    >

                      <p>

                        <strong>
                          💰 Total:
                        </strong>

                        {" "}

                        ₹{
                          Number(
                            order.total || 0
                          ).toFixed(2)
                        }

                      </p>


                      <p>

                        <strong>
                          📋 Status:
                        </strong>

                        {" "}

                        <span
                          style={{
                            background:
                              "#e8f5e9",

                            color:
                              "#2e7d32",

                            padding:
                              "5px 10px",

                            borderRadius:
                              "20px",

                            fontSize:
                              "13px",

                            fontWeight:
                              "bold",
                          }}
                        >

                          {
                            order.status ||
                            "Pending"
                          }

                        </span>

                      </p>


                      <p>

                        <strong>
                          📅 Ordered On:
                        </strong>

                        <br />

                        {
                          formatDate(
                            order.created_at
                          )
                        }
                      </p>

                    </div>


                  </div>

                )
              )
            }

          </div>

        )
      }


    </div>

  );

}

export default Orders;