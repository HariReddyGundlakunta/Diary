import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";


function AdminOrders() {

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


  // ================================================
  // FETCH ALL ADMIN ORDERS
  // ================================================

  const fetchOrders =
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


        const response =
          await axios.get(

            `${API_URL}/api/orders/admin/all`,

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        console.log(
          "ADMIN ORDERS RESPONSE:",
          response.data
        );


        if (response.data.success) {

          setOrders(

            Array.isArray(
              response.data.orders
            )

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
          "ADMIN ORDERS ERROR:",
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
            "You do not have permission to view admin orders."
          );

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to load customer orders"

        );


      } finally {

        setLoading(false);

      }

    }, [
      API_URL,
      navigate,
    ]);


  // ================================================
  // LOAD ORDERS
  // ================================================

  useEffect(() => {

    fetchOrders();

  }, [
    fetchOrders,
  ]);


  // ================================================
  // UPDATE ORDER STATUS
  // ================================================

  const updateOrderStatus =
    async (
      orderId,
      status
    ) => {

      try {

        const token =
          localStorage.getItem("token");


        const response =
          await axios.put(

            `${API_URL}/api/orders/admin/${orderId}/status`,

            {
              status,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        if (
          response.data.success
        ) {

          fetchOrders();

        } else {

          alert(
            response.data.message ||
            "Failed to update order"
          );

        }


      } catch (error) {

        console.error(
          "UPDATE ORDER ERROR:",
          error
        );


        alert(

          error.response?.data?.message ||

          "Failed to update order status"

        );

      }

    };


  // ================================================
  // LOGOUT
  // ================================================

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


  // ================================================
  // STATUS STYLE
  // ================================================

  const getStatusStyle =
    (status) => {

      const value =
        String(status || "")
          .toLowerCase();


      if (value === "delivered") {

        return {
          background: "#dff7e7",
          color: "#237a3b",
        };

      }


      if (value === "cancelled") {

        return {
          background: "#ffe2e2",
          color: "#c62828",
        };

      }


      if (value === "processing") {

        return {
          background: "#fff3cd",
          color: "#856404",
        };

      }


      return {

        background: "#e8f0fe",

        color: "#2457a5",

      };

    };


  // ================================================
  // UI
  // ================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f7f4, #eef2ee)",
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
          background: "#ffffff",
          padding: "20px 25px",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,
              color: "#254b34",
            }}
          >
            🌿 HARI FARMS ADMIN
          </h2>

          <p
            style={{
              margin:
                "6px 0 0 0",
              color: "#777",
            }}
          >
            Manage customer orders
          </p>

        </div>


        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >

          <button
            onClick={() =>
              navigate("/admin-dashboard")
            }
            style={buttonStyle}
          >
            ← Dashboard
          </button>


          <button
            onClick={fetchOrders}
            style={buttonStyle}
          >
            🔄 Refresh
          </button>


          <button
            onClick={handleLogout}
            style={{
              ...buttonStyle,
              background: "#c62828",
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
            margin: 0,
            color: "#1e2d24",
          }}
        >
          📦 Customer Orders
        </h1>

        <p
          style={{
            color: "#666",
          }}
        >
          View and manage all customer orders.
        </p>

      </div>


      {/* ============================================ */}
      {/* LOADING */}
      {/* ============================================ */}

      {
        loading && (

          <div style={messageCardStyle}>

            Loading customer orders...

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
              ...messageCardStyle,

              background: "#fff4f4",

              border:
                "1px solid #f5c2c2",

              color: "#c62828",

            }}
          >

            <h3>
              Unable to Load Orders
            </h3>

            <p>
              {error}
            </p>


            <button
              onClick={fetchOrders}
              style={buttonStyle}
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
            style={messageCardStyle}
          >

            <h3>
              📦 No Orders Found
            </h3>

            <p>
              No customer orders have been placed yet.
            </p>

          </div>

        )
      }


      {/* ============================================ */}
      {/* ORDERS TABLE */}
      {/* ============================================ */}

      {
        !loading &&
        !error &&
        orders.length > 0 && (

          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              padding: "25px",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.08)",
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
                minWidth: "850px",
              }}
            >

              <thead>

                <tr
                  style={{
                    background:
                      "#f3f7f3",
                  }}
                >

                  <th style={tableHeaderStyle}>
                    Order ID
                  </th>

                  <th style={tableHeaderStyle}>
                    Customer
                  </th>

                  <th style={tableHeaderStyle}>
                    Email
                  </th>

                  <th style={tableHeaderStyle}>
                    Total
                  </th>

                  <th style={tableHeaderStyle}>
                    Status
                  </th>

                  <th style={tableHeaderStyle}>
                    Order Date
                  </th>

                  <th style={tableHeaderStyle}>
                    Action
                  </th>

                </tr>

              </thead>


              <tbody>

                {

                  orders.map(
                    (order) => (

                      <tr
                        key={order.id}
                      >

                        <td style={tableCellStyle}>
                          #{order.id}
                        </td>


                        <td style={tableCellStyle}>

                          {
                            order.customer_name ||
                            order.name ||
                            "Customer"
                          }

                        </td>


                        <td style={tableCellStyle}>

                          {
                            order.email ||
                            "Not available"
                          }

                        </td>


                        <td style={tableCellStyle}>

                          ₹{
                            Number(
                              order.total ||
                              order.total_amount ||
                              0
                            ).toFixed(2)
                          }

                        </td>


                        <td style={tableCellStyle}>

                          <span
                            style={{
                              ...getStatusStyle(
                                order.status
                              ),

                              padding:
                                "7px 12px",

                              borderRadius:
                                "20px",

                              fontWeight:
                                "bold",

                              textTransform:
                                "capitalize",

                            }}
                          >

                            {
                              order.status ||
                              "Pending"
                            }

                          </span>

                        </td>


                        <td style={tableCellStyle}>

                          {

                            order.order_date ||
                            order.created_at

                              ? new Date(

                                  order.order_date ||
                                  order.created_at

                                ).toLocaleString()

                              : "Not available"

                          }

                        </td>


                        <td style={tableCellStyle}>

                          <select

                            value={
                              order.status ||
                              "Pending"
                            }

                            onChange={(event) =>
                              updateOrderStatus(
                                order.id,
                                event.target.value
                              )
                            }

                            style={{
                              padding:
                                "8px 10px",

                              borderRadius:
                                "8px",

                              border:
                                "1px solid #ccc",

                            }}

                          >

                            <option value="Pending">
                              Pending
                            </option>

                            <option value="Processing">
                              Processing
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>

                          </select>

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

  );

}


// ================================================
// STYLES
// ================================================

const buttonStyle = {

  background: "#2f6b45",

  color: "#ffffff",

  border: "none",

  padding: "10px 18px",

  borderRadius: "8px",

  cursor: "pointer",

  fontWeight: "bold",

};


const messageCardStyle = {

  background: "#ffffff",

  padding: "30px",

  borderRadius: "16px",

  boxShadow:
    "0 5px 20px rgba(0,0,0,0.08)",

};


const tableHeaderStyle = {

  padding: "15px",

  textAlign: "left",

  color: "#254b34",

};


const tableCellStyle = {

  padding: "15px",

  borderBottom:
    "1px solid #eeeeee",

};


export default AdminOrders;