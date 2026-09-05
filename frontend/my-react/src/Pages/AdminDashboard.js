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

  const navigate = useNavigate();


  // ==========================================
  // API URL
  // ==========================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ==========================================
  // STATE
  // ==========================================

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
      totalCustomers: 0,
      recentOrders: [],
    });


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ==========================================
  // GET ADMIN TOKEN
  // ==========================================

  const getHeaders = () => {

    const token =
      localStorage.getItem("token");


    return {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };

  };


  // ==========================================
  // FETCH ADMIN STATISTICS
  // ==========================================

  const fetchAdminStats =
    useCallback(async () => {

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
          "📊 Fetching admin statistics..."
        );


        const response =
          await axios.get(

            `${API_URL}/api/orders/admin/stats`,

            getHeaders()

          );


        console.log(
          "ADMIN STATS RESPONSE:",
          response.data
        );


        if (response.data.success) {

          setStats({

            totalProducts:
              Number(
                response.data.stats?.totalProducts ||
                0
              ),

            totalOrders:
              Number(
                response.data.stats?.totalOrders ||
                0
              ),

            totalRevenue:
              Number(
                response.data.stats?.totalRevenue ||
                0
              ),

            totalCustomers:
              Number(
                response.data.stats?.totalCustomers ||
                0
              ),

            recentOrders:
              Array.isArray(
                response.data.stats?.recentOrders
              )
                ? response.data.stats.recentOrders
                : [],

          });

        } else {

          setError(
            response.data.message ||
            "Failed to load dashboard statistics"
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


        // Unauthorized

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


        // Not admin

        if (
          error.response?.status === 403
        ) {

          navigate(
            "/user-dashboard",
            {
              replace: true,
            }
          );

          return;

        }


        setError(

          error.response?.data?.message ||

          "Unable to load dashboard statistics. Please check the backend OrderRoutes.js."

        );


      } finally {

        setLoading(false);

      }

    }, [
      API_URL,
      navigate,
    ]);


  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {

    fetchAdminStats();

  }, [
    fetchAdminStats,
  ]);


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

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


  // ==========================================
  // FORMAT CURRENCY
  // ==========================================

  const formatCurrency =
    (amount) => {

      return new Intl.NumberFormat(
        "en-IN",
        {
          style: "currency",
          currency: "INR",
          minimumFractionDigits: 2,
        }
      ).format(
        Number(amount || 0)
      );

    };


  // ==========================================
  // STYLES
  // ==========================================

  const pageStyle = {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg, #eef3ee 0%, #f7f7f4 100%)",

    padding: "30px",

    fontFamily:
      "Arial, sans-serif",

  };


  const cardStyle = {

    background:
      "#ffffff",

    borderRadius:
      "20px",

    padding:
      "28px",

    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",

    border:
      "1px solid rgba(0,0,0,0.04)",

  };


  const buttonStyle = {

    border:
      "none",

    background:
      "#2f6b3d",

    color:
      "#ffffff",

    padding:
      "12px 20px",

    borderRadius:
      "8px",

    cursor:
      "pointer",

    fontWeight:
      "bold",

    fontSize:
      "15px",

  };


  return (

    <div
      style={pageStyle}
    >


      {/* ======================================
          NAVBAR
      ====================================== */}

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

          gap:
            "20px",

          marginBottom:
            "30px",

        }}

      >


        <div>

          <h1

            style={{

              margin:
                "0 0 8px 0",

              color:
                "#263238",

            }}

          >

            Welcome, Admin 👋

          </h1>


          <p

            style={{

              margin:
                0,

              color:
                "#666",

              fontSize:
                "16px",

            }}

          >

            Manage your HARI FARMS store from one place.

          </p>

        </div>


        <div

          style={{

            display:
              "flex",

            gap:
              "12px",

            flexWrap:
              "wrap",

          }}

        >


          <button

            style={buttonStyle}

            onClick={
              fetchAdminStats
            }

          >

            🔄 Refresh

          </button>


          <button

            style={{

              ...buttonStyle,

              background:
                "#c0392b",

            }}

            onClick={
              handleLogout
            }

          >

            Logout

          </button>

        </div>

      </div>


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {

        error && (

          <div

            style={{

              background:
                "#fff3f3",

              border:
                "1px solid #f5c6c6",

              color:
                "#b33939",

              padding:
                "20px",

              borderRadius:
                "15px",

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

            <br />


            <button

              onClick={
                fetchAdminStats
              }

              style={{

                background:
                  "#c0392b",

                color:
                  "#ffffff",

                border:
                  "none",

                padding:
                  "10px 18px",

                borderRadius:
                  "7px",

                cursor:
                  "pointer",

                fontWeight:
                  "bold",

              }}

            >

              Try Again

            </button>

          </div>

        )

      }


      {/* ======================================
          STATISTICS
      ====================================== */}

      <div

        style={{

          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(230px, 1fr))",

          gap:
            "22px",

          marginBottom:
            "40px",

        }}

      >


        {/* TOTAL PRODUCTS */}

        <div
          style={cardStyle}
        >

          <div

            style={{

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

            }}

          >

            <div>

              <h3

                style={{

                  margin:
                    0,

                  color:
                    "#666",

                  fontSize:
                    "16px",

                }}

              >

                Total Products

              </h3>


              <h1

                style={{

                  margin:
                    "18px 0 10px",

                  color:
                    "#222",

                }}

              >

                {
                  loading
                    ? "..."
                    : stats.totalProducts
                }

              </h1>


              <p

                style={{

                  color:
                    "#777",

                  margin:
                    0,

                }}

              >

                Products in your store

              </p>

            </div>


            <div

              style={{

                fontSize:
                  "42px",

              }}

            >

              📦

            </div>

          </div>

        </div>


        {/* TOTAL ORDERS */}

        <div
          style={cardStyle}
        >

          <div

            style={{

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

            }}

          >

            <div>

              <h3

                style={{

                  margin:
                    0,

                  color:
                    "#666",

                  fontSize:
                    "16px",

                }}

              >

                Total Orders

              </h3>


              <h1

                style={{

                  margin:
                    "18px 0 10px",

                  color:
                    "#222",

                }}

              >

                {
                  loading
                    ? "..."
                    : stats.totalOrders
                }

              </h1>


              <p

                style={{

                  color:
                    "#777",

                  margin:
                    0,

                }}

              >

                Orders received

              </p>

            </div>


            <div
              style={{ fontSize: "42px" }}
            >

              📋

            </div>

          </div>

        </div>


        {/* TOTAL REVENUE */}

        <div
          style={cardStyle}
        >

          <div

            style={{

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

            }}

          >

            <div>

              <h3

                style={{

                  margin:
                    0,

                  color:
                    "#666",

                  fontSize:
                    "16px",

                }}

              >

                Total Revenue

              </h3>


              <h1

                style={{

                  margin:
                    "18px 0 10px",

                  color:
                    "#222",

                }}

              >

                {
                  loading
                    ? "..."
                    : formatCurrency(
                        stats.totalRevenue
                      )
                }

              </h1>


              <p

                style={{

                  color:
                    "#777",

                  margin:
                    0,

                }}

              >

                Total store revenue

              </p>

            </div>


            <div
              style={{ fontSize: "42px" }}
            >

              💰

            </div>

          </div>

        </div>


        {/* TOTAL CUSTOMERS */}

        <div
          style={cardStyle}
        >

          <div

            style={{

              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

            }}

          >

            <div>

              <h3

                style={{

                  margin:
                    0,

                  color:
                    "#666",

                  fontSize:
                    "16px",

                }}

              >

                Total Customers

              </h3>


              <h1

                style={{

                  margin:
                    "18px 0 10px",

                  color:
                    "#222",

                }}

              >

                {
                  loading
                    ? "..."
                    : stats.totalCustomers
                }

              </h1>


              <p

                style={{

                  color:
                    "#777",

                  margin:
                    0,

                }}

              >

                Registered customers

              </p>

            </div>


            <div
              style={{ fontSize: "42px" }}
            >

              👥

            </div>

          </div>

        </div>

      </div>


      {/* ======================================
          QUICK ACTIONS
      ====================================== */}

      <h2

        style={{

          color:
            "#2f4f3a",

          marginBottom:
            "20px",

        }}

      >

        ⚡ Quick Actions

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
          style={cardStyle}
        >

          <div
            style={{ fontSize: "45px" }}
          >
            ➕
          </div>


          <h2>
            Add Product
          </h2>


          <p
            style={{ color: "#666" }}
          >
            Add a new dairy product to HARI FARMS.
          </p>


          <button

            onClick={() =>
              navigate("/add-product")
            }

            style={buttonStyle}

          >

            Add Product →

          </button>

        </div>


        {/* MANAGE PRODUCTS */}

        <div
          style={cardStyle}
        >

          <div
            style={{ fontSize: "45px" }}
          >
            🥛
          </div>


          <h2>
            Manage Products
          </h2>


          <p
            style={{ color: "#666" }}
          >
            View, edit and manage all products.
          </p>


          <button

            onClick={() =>
              navigate("/products")
            }

            style={buttonStyle}

          >

            Manage Products →

          </button>

        </div>


        {/* MANAGE ORDERS */}

        <div
          style={cardStyle}
        >

          <div
            style={{ fontSize: "45px" }}
          >
            📦
          </div>


          <h2>
            Manage Orders
          </h2>


          <p
            style={{ color: "#666" }}
          >
            View and manage customer orders.
          </p>


          <button

            onClick={() =>
              navigate("/admin-orders")
            }

            style={buttonStyle}

          >

            View Orders →

          </button>

        </div>

      </div>


      {/* ======================================
          RECENT ORDERS
      ====================================== */}

      <div
        style={cardStyle}
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

          <h2
            style={{ margin: 0 }}
          >
            Recent Orders
          </h2>


          <span

            style={{

              background:
                "#e8f3e9",

              color:
                "#2f6b3d",

              padding:
                "8px 14px",

              borderRadius:
                "20px",

              fontWeight:
                "bold",

            }}

          >

            {
              stats.recentOrders.length
            } Recent

          </span>

        </div>


        {

          loading ? (

            <p>
              Loading recent orders...
            </p>

          ) : stats.recentOrders.length === 0 ? (

            <div

              style={{

                textAlign:
                  "center",

                padding:
                  "40px",

                color:
                  "#777",

              }}

            >

              <div
                style={{ fontSize: "50px" }}
              >
                📦
              </div>


              <h3>
                No orders yet
              </h3>


              <p>
                Customer orders will appear here.
              </p>

            </div>

          ) : (

            <div

              style={{

                overflowX:
                  "auto",

              }}

            >

              <table

                style={{

                  width:
                    "100%",

                  borderCollapse:
                    "collapse",

                }}

              >

                <thead>

                  <tr>

                    <th
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >
                      Order ID
                    </th>


                    <th
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >
                      Customer
                    </th>


                    <th
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >
                      Status
                    </th>


                    <th
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        borderBottom:
                          "1px solid #ddd",
                      }}
                    >
                      Date
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {

                    stats.recentOrders.map(
                      (order) => (

                        <tr
                          key={order.id}
                        >

                          <td
                            style={{
                              padding: "15px",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >
                            #{order.id}
                          </td>


                          <td
                            style={{
                              padding: "15px",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >
                            {
                              order.customer_name ||
                              `User ${order.user_id}`
                            }
                          </td>


                          <td
                            style={{
                              padding: "15px",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >

                            <span

                              style={{

                                background:
                                  "#fff4d6",

                                padding:
                                  "6px 12px",

                                borderRadius:
                                  "15px",

                                fontSize:
                                  "13px",

                              }}

                            >

                              {
                                order.status ||
                                "Pending"
                              }

                            </span>

                          </td>


                          <td
                            style={{
                              padding: "15px",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >

                            {

                              order.order_date

                                ? new Date(
                                    order.order_date
                                  ).toLocaleString()

                                : "Not available"

                            }

                          </td>

                        </tr>

                      )
                    )

                  }

                </tbody>

              </table>

            </div>

          )

        }

      </div>


    </div>

  );

}


export default AdminDashboard;