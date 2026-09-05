import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";


function AdminDashboard() {

  const navigate =
    useNavigate();


  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ==================================================
  // STATES
  // ==================================================

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
    });


  const [recentOrders, setRecentOrders] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ==================================================
  // GET TOKEN
  // ==================================================

  const getToken = () => {

    return localStorage.getItem(
      "token"
    );

  };


  // ==================================================
  // AUTH CONFIG
  // ==================================================

  const getAuthConfig =
    useCallback(() => {

      const token =
        getToken();


      return {

        headers: {

          Authorization:
            `Bearer ${token}`,

        },

      };

    }, []);


  // ==================================================
  // FETCH ADMIN STATS
  // ==================================================

  const fetchAdminStats =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");


        const token =
          getToken();


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
          "================================="
        );

        console.log(
          "FETCHING ADMIN STATS"
        );

        console.log(
          "API:",
          `${API_URL}/api/orders/admin/stats`
        );

        console.log(
          "================================="
        );


        const response =
          await axios.get(

            `${API_URL}/api/orders/admin/stats`,

            getAuthConfig()

          );


        console.log(
          "ADMIN STATS RESPONSE:",
          response.data
        );


        if (
          response.data.success
        ) {

          setStats({

            totalProducts:
              Number(
                response.data.totalProducts || 0
              ),

            totalOrders:
              Number(
                response.data.totalOrders || 0
              ),

            totalRevenue:
              Number(
                response.data.totalRevenue || 0
              ),

            totalCustomers:
              Number(
                response.data.totalCustomers || 0
              ),

          });


          setRecentOrders(

            Array.isArray(
              response.data.recentOrders
            )

              ? response.data.recentOrders

              : []

          );

        } else {

          setError(

            response.data.message ||
            "Failed to load dashboard"

          );

        }

      } catch (error) {

        console.error(
          "ADMIN STATS ERROR:",
          error
        );


        console.log(
          "SERVER RESPONSE:",
          error.response?.data
        );


        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }


        if (
          error.response?.status === 403
        ) {

          setError(
            "You do not have admin permission."
          );

          return;

        }


        if (
          error.response?.status === 404
        ) {

          setError(
            "Admin statistics route is not available. Please redeploy the updated backend."
          );

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to load admin dashboard"

        );

      } finally {

        setLoading(false);

      }

    }, [
      API_URL,
      getAuthConfig,
      navigate,
    ]);


  // ==================================================
  // LOAD DATA
  // ==================================================

  useEffect(() => {

    fetchAdminStats();

  }, [
    fetchAdminStats,
  ]);


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );


      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  // ==================================================
  // NAVIGATION
  // ==================================================

  const handleManageProducts =
    () => {

      navigate("/products");

    };


  const handleOrders =
    () => {

      navigate("/orders");

    };


  // ==================================================
  // RETURN
  // ==================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "#f3f6f3",
        fontFamily:
          "Arial, sans-serif",
      }}
    >


      {/* ============================================== */}
      {/* NAVBAR */}
      {/* ============================================== */}

      <div
        style={{
          background:
            "#ffffff",
          padding:
            "20px 35px",
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          flexWrap:
            "wrap",
          gap:
            "15px",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,
              color:
                "#1f3d2b",
            }}
          >

            🌿 HARI FARMS

          </h2>


          <p
            style={{
              margin:
                "5px 0 0",
              color:
                "#777",
            }}
          >

            Admin Dashboard

          </p>

        </div>


        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            flexWrap:
              "wrap",
          }}
        >

          <button
            onClick={handleManageProducts}
            style={{
              padding:
                "10px 16px",
              border:
                "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >

            📦 Products

          </button>


          <button
            onClick={handleOrders}
            style={{
              padding:
                "10px 16px",
              border:
                "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >

            📋 Orders

          </button>


          <button
            onClick={handleLogout}
            style={{
              padding:
                "10px 16px",
              border:
                "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              background:
                "#c62828",
              color:
                "white",
              fontWeight:
                "bold",
            }}
          >

            Logout

          </button>

        </div>

      </div>


      {/* ============================================== */}
      {/* MAIN */}
      {/* ============================================== */}

      <div
        style={{
          padding:
            "35px",
        }}
      >


        {/* HEADER */}

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            flexWrap:
              "wrap",
            marginBottom:
              "30px",
          }}
        >

          <div>

            <h1
              style={{
                margin: 0,
                color:
                  "#263238",
              }}
            >

              Welcome, Admin 👋

            </h1>


            <p
              style={{
                color:
                  "#666",
              }}
            >

              Manage your HARI FARMS store from one place.

            </p>

          </div>


          <button
            onClick={fetchAdminStats}
            style={{
              background:
                "#276738",
              color:
                "white",
              padding:
                "13px 22px",
              border:
                "none",
              borderRadius:
                "8px",
              cursor:
                "pointer",
              fontWeight:
                "bold",
            }}
          >

            🔄 Refresh

          </button>

        </div>


        {/* ============================================ */}
        {/* ERROR */}
        {/* ============================================ */}

        {
          error && (

            <div
              style={{
                background:
                  "#fff5f5",
                border:
                  "1px solid #ffcaca",
                color:
                  "#c0392b",
                padding:
                  "20px",
                borderRadius:
                  "14px",
                marginBottom:
                  "25px",
              }}
            >

              <strong>
                Error:
              </strong>

              {" "}

              {error}


              <br />


              <button
                onClick={fetchAdminStats}
                style={{
                  marginTop:
                    "15px",
                  padding:
                    "10px 18px",
                  border:
                    "none",
                  borderRadius:
                    "7px",
                  background:
                    "#c0392b",
                  color:
                    "white",
                  cursor:
                    "pointer",
                }}
              >

                Try Again

              </button>

            </div>

          )
        }


        {/* ============================================ */}
        {/* LOADING */}
        {/* ============================================ */}

        {
          loading && (

            <div
              style={{
                textAlign:
                  "center",
                padding:
                  "30px",
              }}
            >

              Loading dashboard...

            </div>

          )
        }


        {/* ============================================ */}
        {/* STATISTICS */}
        {/* ============================================ */}

        {
          !loading && (

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap:
                  "22px",
                marginBottom:
                  "40px",
              }}
            >


              {/* PRODUCTS */}

              <div
                style={{
                  background:
                    "#ffffff",
                  padding:
                    "28px",
                  borderRadius:
                    "20px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin: 0,
                        color:
                          "#666",
                      }}
                    >

                      Total Products

                    </h4>


                    <h2>

                      {stats.totalProducts}

                    </h2>


                    <p
                      style={{
                        color:
                          "#888",
                      }}
                    >

                      Products in your store

                    </p>

                  </div>


                  <div
                    style={{
                      fontSize:
                        "40px",
                    }}
                  >

                    📦

                  </div>

                </div>

              </div>


              {/* ORDERS */}

              <div
                style={{
                  background:
                    "#ffffff",
                  padding:
                    "28px",
                  borderRadius:
                    "20px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin: 0,
                        color:
                          "#666",
                      }}
                    >

                      Total Orders

                    </h4>


                    <h2>

                      {stats.totalOrders}

                    </h2>


                    <p
                      style={{
                        color:
                          "#888",
                      }}
                    >

                      Orders received

                    </p>

                  </div>


                  <div
                    style={{
                      fontSize:
                        "40px",
                    }}
                  >

                    📋

                  </div>

                </div>

              </div>


              {/* REVENUE */}

              <div
                style={{
                  background:
                    "#ffffff",
                  padding:
                    "28px",
                  borderRadius:
                    "20px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin: 0,
                        color:
                          "#666",
                      }}
                    >

                      Total Revenue

                    </h4>


                    <h2>

                      ₹{
                        Number(
                          stats.totalRevenue
                        ).toFixed(2)
                      }

                    </h2>


                    <p
                      style={{
                        color:
                          "#888",
                      }}
                    >

                      Total store revenue

                    </p>

                  </div>


                  <div
                    style={{
                      fontSize:
                        "40px",
                    }}
                  >

                    💰

                  </div>

                </div>

              </div>


              {/* CUSTOMERS */}

              <div
                style={{
                  background:
                    "#ffffff",
                  padding:
                    "28px",
                  borderRadius:
                    "20px",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >

                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                  }}
                >

                  <div>

                    <h4
                      style={{
                        margin: 0,
                        color:
                          "#666",
                      }}
                    >

                      Total Customers

                    </h4>


                    <h2>

                      {stats.totalCustomers}

                    </h2>


                    <p
                      style={{
                        color:
                          "#888",
                      }}
                    >

                      Registered customers

                    </p>

                  </div>


                  <div
                    style={{
                      fontSize:
                        "40px",
                    }}
                  >

                    👥

                  </div>

                </div>

              </div>

            </div>

          )
        }


        {/* ============================================ */}
        {/* FARM MANAGEMENT */}
        {/* ============================================ */}

        <h2
          style={{
            color:
              "#294b35",
            marginBottom:
              "20px",
          }}
        >

          Farm Management

        </h2>


        <div
          style={{
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap:
              "22px",
            marginBottom:
              "35px",
          }}
        >


          {/* ADD PRODUCT */}

          <div
            style={{
              background:
                "#ffffff",
              padding:
                "28px",
              borderRadius:
                "20px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >

            <div
              style={{
                fontSize:
                  "38px",
              }}
            >

              ➕

            </div>


            <h3>

              Add Product

            </h3>


            <p>

              Add a new dairy product to HARI FARMS.

            </p>


            <button
              onClick={handleManageProducts}
              style={{
                border:
                  "none",
                background:
                  "transparent",
                color:
                  "#2e7d32",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                padding: 0,
              }}
            >

              Manage Products →

            </button>

          </div>


          {/* MANAGE PRODUCTS */}

          <div
            style={{
              background:
                "#ffffff",
              padding:
                "28px",
              borderRadius:
                "20px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >

            <div
              style={{
                fontSize:
                  "38px",
              }}
            >

              🥛

            </div>


            <h3>

              Manage Products

            </h3>


            <p>

              View and edit all products from the database.

            </p>


            <button
              onClick={handleManageProducts}
              style={{
                border:
                  "none",
                background:
                  "transparent",
                color:
                  "#2e7d32",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                padding: 0,
              }}
            >

              Manage Products →

            </button>

          </div>


          {/* MANAGE ORDERS */}

          <div
            style={{
              background:
                "#ffffff",
              padding:
                "28px",
              borderRadius:
                "20px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >

            <div
              style={{
                fontSize:
                  "38px",
              }}
            >

              📦

            </div>


            <h3>

              Manage Orders

            </h3>


            <p>

              View and manage customer orders.

            </p>


            <button
              onClick={handleOrders}
              style={{
                border:
                  "none",
                background:
                  "transparent",
                color:
                  "#2e7d32",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
                padding: 0,
              }}
            >

              View Orders →

            </button>

          </div>

        </div>


        {/* ============================================ */}
        {/* RECENT ORDERS */}
        {/* ============================================ */}

        <div
          style={{
            background:
              "#ffffff",
            padding:
              "30px",
            borderRadius:
              "20px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              marginBottom:
                "20px",
            }}
          >

            <h2>

              Recent Orders

            </h2>


            <span
              style={{
                background:
                  "#e8f5e9",
                color:
                  "#2e7d32",
                padding:
                  "10px 15px",
                borderRadius:
                  "20px",
                fontWeight:
                  "bold",
              }}
            >

              {recentOrders.length} Recent

            </span>

          </div>


          {
            recentOrders.length === 0 ? (

              <p
                style={{
                  textAlign:
                    "center",
                  padding:
                    "30px",
                  color:
                    "#777",
                }}
              >

                No recent orders found.

              </p>

            ) : (

              recentOrders.map(
                (order) => (

                  <div
                    key={order.id}
                    style={{
                      padding:
                        "15px",
                      borderBottom:
                        "1px solid #eeeeee",
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      flexWrap:
                        "wrap",
                      gap:
                        "10px",
                    }}
                  >

                    <div>

                      <strong>

                        Order #{order.id}

                      </strong>


                      <p
                        style={{
                          margin:
                            "5px 0",
                        }}
                      >

                        {order.customer_name ||
                          order.email ||
                          "Customer"}

                      </p>

                    </div>


                    <div>

                      ₹{
                        Number(
                          order.total || 0
                        ).toFixed(2)
                      }

                    </div>


                    <div>

                      {order.status ||
                        "Pending"}

                    </div>

                  </div>

                )
              )

            )
          }

        </div>

      </div>

    </div>

  );

}


export default AdminDashboard;