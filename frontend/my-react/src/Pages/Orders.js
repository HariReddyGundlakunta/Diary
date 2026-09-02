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

function Orders() {

  const navigate = useNavigate();

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

  const fetchOrders = useCallback(
    async () => {

      try {

        setLoading(true);
        setError("");

        // ==============================================
        // GET USER
        // ==============================================

        const storedUser =
          localStorage.getItem("user");

        const token =
          localStorage.getItem("token");

        if (
          !storedUser ||
          !token
        ) {

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        let user;

        try {

          user =
            JSON.parse(
              storedUser
            );

        } catch (parseError) {

          console.error(
            "USER JSON ERROR:",
            parseError
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "token"
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
          !user ||
          !user.id
        ) {

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "token"
          );

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
          "GETTING ORDERS"
        );

        console.log(
          "USER ID:",
          user.id
        );

        console.log(
          "================================="
        );

        // ==============================================
        // GET ORDERS FROM BACKEND
        // ==============================================

        const response =
          await axios.get(
            `${API_URL}/api/orders/${user.id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        console.log(
          "ORDERS RESPONSE:",
          response.data
        );

        // ==============================================
        // SUCCESS
        // ==============================================

        if (
          response.data.success
        ) {

          const orderData =
            Array.isArray(
              response.data.orders
            )
              ? response.data.orders
              : [];

          setOrders(
            orderData
          );

        } else {

          setError(
            response.data.message ||
            "Failed to load orders."
          );

        }

      } catch (err) {

        console.error(
          "================================="
        );

        console.error(
          "GET ORDERS ERROR:",
          err
        );

        console.error(
          "SERVER RESPONSE:",
          err.response?.data
        );

        console.error(
          "================================="
        );

        if (
          err.response?.status === 401
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

        setError(
          err.response?.data?.message ||
          "Unable to connect to the server."
        );

      } finally {

        setLoading(false);

      }

    },
    [API_URL, navigate]
  );

  // ==================================================
  // LOAD ORDERS
  // ==================================================

  useEffect(() => {

    fetchOrders();

  }, [fetchOrders]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div
        style={styles.center}
      >

        <div
          style={styles.loadingIcon}
        >
          📦
        </div>

        <h2>
          Loading your orders...
        </h2>

      </div>

    );

  }

  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div
      style={styles.page}
    >

      {/* ==============================================
          NAVBAR
      ============================================== */}

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

          <Link
            to="/cart"
            style={styles.navLink}
          >
            🛒 Cart
          </Link>

          <span
            style={styles.activeLink}
          >
            📦 My Orders
          </span>

        </div>

      </nav>

      {/* ==============================================
          MAIN
      ============================================== */}

      <main
        style={styles.container}
      >

        <div
          style={styles.header}
        >

          <div>

            <h1>
              📦 My Orders
            </h1>

            <p
              style={styles.subtitle}
            >
              View your order history
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              navigate("/home")
            }
            style={styles.backButton}
          >
            ← Back to Home
          </button>

        </div>

        {/* ==========================================
            ERROR
        =========================================== */}

        {error && (

          <div
            style={styles.error}
          >

            <strong>
              ⚠️ Error:
            </strong>

            {" "}

            {error}

            <button
              type="button"
              onClick={fetchOrders}
              style={
                styles.retryButton
              }
            >
              Try Again
            </button>

          </div>

        )}

        {/* ==========================================
            NO ORDERS
        =========================================== */}

        {!error &&
          orders.length === 0 && (

            <div
              style={styles.empty}
            >

              <div
                style={styles.emptyIcon}
              >
                📦
              </div>

              <h2>
                No Orders Yet
              </h2>

              <p>
                You haven't placed
                any orders yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    "/products"
                  )
                }
                style={
                  styles.shopButton
                }
              >
                Start Shopping
              </button>

            </div>

          )}

        {/* ==========================================
            ORDERS
        =========================================== */}

        {!error &&
          orders.map(
            (
              order,
              orderIndex
            ) => {

              const orderId =
                order.id ||
                order.order_id ||
                orderIndex + 1;

              const total =
                Number(
                  order.total ||
                  order.total_amount ||
                  order.amount ||
                  0
                );

              const status =
                order.status ||
                order.order_status ||
                "Confirmed";

              const payment =
                order.payment ||
                order.payment_method ||
                "Cash on Delivery";

              const orderDate =
                order.order_date ||
                order.orderDate ||
                order.created_at ||
                order.date;

              const items =
                Array.isArray(
                  order.items
                )
                  ? order.items
                  : [];

              return (

                <div
                  key={orderId}
                  style={styles.orderCard}
                >

                  {/* ==================================
                      ORDER HEADER
                  =================================== */}

                  <div
                    style={
                      styles.orderHeader
                    }
                  >

                    <div>

                      <h2
                        style={
                          styles.orderTitle
                        }
                      >
                        Order #{orderId}
                      </h2>

                      <p
                        style={
                          styles.date
                        }
                      >

                        {orderDate
                          ? new Date(
                              orderDate
                            ).toLocaleString()
                          : "Date not available"}

                      </p>

                    </div>

                    <div
                      style={
                        styles.orderRight
                      }
                    >

                      <div
                        style={
                          styles.orderTotal
                        }
                      >
                        ₹
                        {total.toFixed(
                          2
                        )}
                      </div>

                      <span
                        style={
                          styles.status
                        }
                      >
                        {status}
                      </span>

                    </div>

                  </div>

                  <hr />

                  {/* ==================================
                      PAYMENT
                  =================================== */}

                  <div
                    style={
                      styles.paymentRow
                    }
                  >

                    <span>
                      Payment
                    </span>

                    <strong>
                      {payment}
                    </strong>

                  </div>

                  {/* ==================================
                      ITEMS
                  =================================== */}

                  <h3
                    style={
                      styles.itemsTitle
                    }
                  >
                    Ordered Products
                  </h3>

                  {items.length === 0 ? (

                    <div
                      style={
                        styles.noItems
                      }
                    >
                      Order items are not
                      available.
                    </div>

                  ) : (

                    <div>

                      {items.map(
                        (
                          item,
                          itemIndex
                        ) => {

                          const name =
                            item.product_name ||
                            item.name ||
                            "Product";

                          const quantity =
                            Number(
                              item.quantity ||
                              item.qty ||
                              1
                            );

                          const price =
                            Number(
                              item.price ||
                              item.unit_price ||
                              0
                            );

                          const itemTotal =
                            Number(
                              item.total ||
                              item.subtotal ||
                              price *
                                quantity
                            );

                          return (

                            <div
                              key={
                                item.id ||
                                itemIndex
                              }
                              style={
                                styles.item
                              }
                            >

                              <div
                                style={
                                  styles.itemName
                                }
                              >

                                <span
                                  style={
                                    styles.productIcon
                                  }
                                >
                                  🥛
                                </span>

                                <div>

                                  <strong>
                                    {name}
                                  </strong>

                                  <p
                                    style={
                                      styles.quantityText
                                    }
                                  >
                                    Quantity:
                                    {" "}
                                    {quantity}
                                  </p>

                                </div>

                              </div>

                              <div
                                style={
                                  styles.itemPrice
                                }
                              >

                                ₹
                                {price.toFixed(
                                  2
                                )}

                                {" × "}

                                {quantity}

                                {" = "}

                                <strong>
                                  ₹
                                  {itemTotal.toFixed(
                                    2
                                  )}
                                </strong>

                              </div>

                            </div>

                          );

                        }
                      )}

                    </div>

                  )}

                </div>

              );

            }
          )}

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
    flexWrap: "wrap",
    gap: "15px",
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
    gap: "20px",
    flexWrap: "wrap",
  },

  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "15px",
  },

  activeLink: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: "15px",
  },

  container: {
    maxWidth: "1000px",
    margin: "auto",
    padding:
      "40px 20px",
  },

  header: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "15px",
  },

  subtitle: {
    color: "#666",
    marginTop: "5px",
  },

  backButton: {
    background: "#ffffff",
    color: "#2e7d32",
    border:
      "1px solid #2e7d32",
    padding:
      "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  orderCard: {
    background: "#ffffff",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.07)",
  },

  orderHeader: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  orderTitle: {
    margin: 0,
  },

  date: {
    color: "#777",
    margin:
      "7px 0 0",
    fontSize: "14px",
  },

  orderRight: {
    textAlign: "right",
  },

  orderTotal: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "8px",
  },

  status: {
    display: "inline-block",
    background: "#dff5e1",
    color: "#2e7d32",
    padding:
      "7px 14px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "13px",
  },

  paymentRow: {
    display: "flex",
    justifyContent:
      "space-between",
    background: "#f7f7f7",
    padding: "12px 15px",
    borderRadius: "8px",
    margin:
      "15px 0",
  },

  itemsTitle: {
    marginTop: "20px",
    marginBottom: "10px",
  },

  item: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    padding:
      "15px 0",
    borderBottom:
      "1px solid #eeeeee",
    gap: "20px",
    flexWrap: "wrap",
  },

  itemName: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  productIcon: {
    fontSize: "28px",
  },

  quantityText: {
    color: "#777",
    margin:
      "5px 0 0",
    fontSize: "13px",
  },

  itemPrice: {
    color: "#555",
  },

  noItems: {
    padding: "20px",
    textAlign: "center",
    background: "#f8f8f8",
    color: "#777",
    borderRadius: "8px",
  },

  empty: {
    background: "#ffffff",
    padding: "60px 30px",
    textAlign: "center",
    borderRadius: "15px",
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.06)",
  },

  emptyIcon: {
    fontSize: "65px",
  },

  shopButton: {
    marginTop: "20px",
    background: "#2e7d32",
    color: "#ffffff",
    border: "none",
    padding:
      "13px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
  },

  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
  },

  retryButton: {
    marginLeft: "15px",
    border: "none",
    background: "#c62828",
    color: "white",
    padding:
      "7px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  center: {
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

};

export default Orders;