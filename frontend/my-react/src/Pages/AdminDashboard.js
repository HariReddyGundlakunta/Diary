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



function AdminDashboard() {


  // ==================================================
  // NAVIGATION
  // ==================================================

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

  const [stats, setStats] =
    useState({
      totalProducts: 0,
      totalOrders: 0,
      totalCustomers: 0,
      revenue: 0,
    });


  const [recentOrders, setRecentOrders] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };


  // ==================================================
  // FORMAT API DATA
  // ==================================================

  const getArrayFromResponse =
    (data) => {

      if (
        Array.isArray(data)
      ) {

        return data;

      }


      if (
        Array.isArray(data?.products)
      ) {

        return data.products;

      }


      if (
        Array.isArray(data?.orders)
      ) {

        return data.orders;

      }


      if (
        Array.isArray(data?.data)
      ) {

        return data.data;

      }


      return [];

    };


  // ==================================================
  // LOAD DASHBOARD DATA
  // ==================================================

  const loadDashboard =
    useCallback(

      async () => {

        try {

          setLoading(true);

          setError("");


          const token =
            localStorage.getItem("token");


          const headers =
            token
              ? {
                  Authorization:
                    `Bearer ${token}`,
                }
              : {};


          // ============================================
          // GET PRODUCTS
          // ============================================

          const productsResponse =
            await axios.get(

              `${API_URL}/api/products`,

              {
                headers,
              }

            );


          const products =
            getArrayFromResponse(
              productsResponse.data
            );


          // ============================================
          // GET ORDERS
          // ============================================

          let orders = [];


          try {

            const ordersResponse =
              await axios.get(

                `${API_URL}/api/orders`,

                {
                  headers,
                }

              );


            orders =
              getArrayFromResponse(
                ordersResponse.data
              );


          } catch (orderError) {

            console.log(
              "Orders could not be loaded:",
              orderError.response?.data ||
              orderError.message
            );

          }


          // ============================================
          // CALCULATE TOTAL CUSTOMERS
          // ============================================

          const customerIds =
            new Set();


          orders.forEach(
            (order) => {

              if (
                order.user_id
              ) {

                customerIds.add(
                  order.user_id
                );

              }

            }
          );


          // ============================================
          // CALCULATE REVENUE
          // ============================================

          const revenue =
            orders.reduce(

              (total, order) => {

                const amount =
                  Number(
                    order.total ||
                    order.total_amount ||
                    order.amount ||
                    0
                  );


                return (
                  total + amount
                );

              },

              0

            );


          // ============================================
          // UPDATE STATS
          // ============================================

          setStats({

            totalProducts:
              products.length,

            totalOrders:
              orders.length,

            totalCustomers:
              customerIds.size,

            revenue:
              revenue,

          });


          // ============================================
          // RECENT ORDERS
          // ============================================

          const sortedOrders =
            [...orders]
              .sort(
                (a, b) => {

                  const dateA =
                    new Date(
                      a.created_at ||
                      a.createdAt ||
                      0
                    );


                  const dateB =
                    new Date(
                      b.created_at ||
                      b.createdAt ||
                      0
                    );


                  return (
                    dateB - dateA
                  );

                }
              )
              .slice(0, 5);


          setRecentOrders(
            sortedOrders
          );


        } catch (error) {

          console.error(
            "DASHBOARD ERROR:",
            error
          );


          setError(

            error.response?.data?.message ||

            "Unable to load dashboard data. Please check your backend server."

          );


        } finally {

          setLoading(false);

        }

      },

      [API_URL]

    );


  // ==================================================
  // LOAD DATA
  // ==================================================

  useEffect(() => {

    loadDashboard();

  }, [loadDashboard]);


  // ==================================================
  // PAGE
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


          <button
            onClick={loadDashboard}
            style={styles.refreshButton}
          >

            🔄 Refresh

          </button>


          <button
            onClick={handleLogout}
            style={styles.logout}
          >

            Logout

          </button>


        </div>

      </nav>


      {/* ============================================== */}
      {/* MAIN */}
      {/* ============================================== */}

      <main style={styles.main}>


        {/* ============================================ */}
        {/* WELCOME */}
        {/* ============================================ */}

        <section style={styles.welcome}>


          <div>


            <p style={styles.adminLabel}>

              HARI FARMS • ADMIN

            </p>


            <h1 style={styles.welcomeTitle}>

              Welcome to Admin Dashboard 👋

            </h1>


            <p style={styles.description}>

              Manage your dairy farm products,
              orders and store operations from one place.

            </p>


          </div>


          <div style={styles.cow}>

            🐄

          </div>


        </section>


        {/* ============================================ */}
        {/* ERROR */}
        {/* ============================================ */}

        {error && (

          <div style={styles.errorBox}>

            ⚠️ {error}


            <button
              onClick={loadDashboard}
              style={styles.errorRetry}
            >

              Try Again

            </button>

          </div>

        )}


        {/* ============================================ */}
        {/* STAT CARDS */}
        {/* ============================================ */}

        <div style={styles.stats}>


          {/* PRODUCTS */}

          <div style={styles.statCard}>


            <div style={styles.statIcon}>

              🥛

            </div>


            <p style={styles.statLabel}>

              Total Products

            </p>


            <h2 style={styles.statNumber}>

              {loading
                ? "..."
                : stats.totalProducts}

            </h2>


          </div>


          {/* ORDERS */}

          <div style={styles.statCard}>


            <div style={styles.statIcon}>

              📦

            </div>


            <p style={styles.statLabel}>

              Total Orders

            </p>


            <h2 style={styles.statNumber}>

              {loading
                ? "..."
                : stats.totalOrders}

            </h2>


          </div>


          {/* CUSTOMERS */}

          <div style={styles.statCard}>


            <div style={styles.statIcon}>

              👥

            </div>


            <p style={styles.statLabel}>

              Customers

            </p>


            <h2 style={styles.statNumber}>

              {loading
                ? "..."
                : stats.totalCustomers}

            </h2>


          </div>


          {/* REVENUE */}

          <div style={styles.statCard}>


            <div style={styles.statIcon}>

              💰

            </div>


            <p style={styles.statLabel}>

              Revenue

            </p>


            <h2 style={styles.statNumber}>

              {loading
                ? "..."
                : `₹${Number(
                    stats.revenue
                  ).toFixed(2)}`}

            </h2>


          </div>


        </div>


        {/* ============================================ */}
        {/* FARM MANAGEMENT */}
        {/* ============================================ */}

        <h2 style={styles.sectionTitle}>

          Farm Management

        </h2>


        <div style={styles.operations}>


          {/* ADD PRODUCT */}

          <Link
            to="/admin/products/add"
            style={styles.operation}
          >


            <div style={styles.operationIcon}>

              ➕

            </div>


            <h3>

              Add Product

            </h3>


            <p>

              Add a new dairy product
              to HARI FARMS.

            </p>


            <span style={styles.operationLink}>

              Add Product →

            </span>


          </Link>


          {/* MANAGE PRODUCTS */}

          <Link
            to="/products"
            style={styles.operation}
          >


            <div style={styles.operationIcon}>

              🥛

            </div>


            <h3>

              Manage Products

            </h3>


            <p>

              View and edit all products
              from the database.

            </p>


            <span style={styles.operationLink}>

              Manage Products →

            </span>


          </Link>


          {/* ORDERS */}

          <Link
            to="/admin/orders"
            style={styles.operation}
          >


            <div style={styles.operationIcon}>

              📦

            </div>


            <h3>

              Manage Orders

            </h3>


            <p>

              View and manage customer
              orders.

            </p>


            <span style={styles.operationLink}>

              View Orders →

            </span>


          </Link>


        </div>


        {/* ============================================ */}
        {/* RECENT ACTIVITY */}
        {/* ============================================ */}

        <section style={styles.activity}>


          <div style={styles.activityHeader}>


            <h2>

              Recent Orders

            </h2>


            <span style={styles.activityBadge}>

              {recentOrders.length} Recent

            </span>


          </div>


          {loading ? (

            <div style={styles.empty}>

              <div style={styles.emptyIcon}>

                ⏳

              </div>


              <h3>

                Loading...

              </h3>


              <p>

                Loading recent activity.

              </p>

            </div>

          ) : recentOrders.length === 0 ? (

            <div style={styles.empty}>


              <div style={styles.emptyIcon}>

                📋

              </div>


              <h3>

                No Recent Orders

              </h3>


              <p>

                Customer orders will appear here.

              </p>


            </div>

          ) : (

            <div style={styles.ordersList}>


              {recentOrders.map(
                (order) => (

                  <div
                    key={order.id}
                    style={styles.orderItem}
                  >


                    <div>


                      <strong>

                        Order #{order.id}

                      </strong>


                      <p style={styles.orderDate}>

                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleString()
                          : "Recently created"}

                      </p>


                    </div>


                    <div
                      style={styles.orderRight}
                    >


                      <strong
                        style={styles.orderAmount}
                      >

                        ₹{Number(
                          order.total ||
                          order.total_amount ||
                          0
                        ).toFixed(2)}

                      </strong>


                      <span
                        style={styles.orderStatus}
                      >

                        {order.status ||
                          "Pending"}

                      </span>


                    </div>


                  </div>

                )
              )}


            </div>

          )}


        </section>


      </main>


      {/* ============================================== */}
      {/* FOOTER */}
      {/* ============================================== */}

      <footer style={styles.footer}>


        <h3>

          🥛 HARI FARMS

        </h3>


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

    boxShadow:
      "0 3px 15px rgba(0,0,0,0.12)",

  },


  logo: {

    color: "#fff",

    textDecoration: "none",

    fontSize: "23px",

    fontWeight: "800",

  },


  navLinks: {

    display: "flex",

    alignItems: "center",

    gap: "20px",

  },


  navLink: {

    color: "#fff",

    textDecoration: "none",

    fontWeight: "600",

  },


  refreshButton: {

    border: "none",

    background: "#fff",

    color: "#2e7d32",

    padding: "10px 16px",

    borderRadius: "20px",

    fontWeight: "700",

    cursor: "pointer",

  },


  logout: {

    border: "none",

    background: "#e53935",

    color: "#fff",

    padding: "10px 20px",

    borderRadius: "20px",

    fontWeight: "700",

    cursor: "pointer",

  },


  main: {

    maxWidth: "1200px",

    margin: "auto",

    padding: "40px 25px 70px",

  },


  welcome: {

    background:
      "linear-gradient(135deg,#1b5e20,#43a047)",

    color: "#fff",

    padding: "40px",

    borderRadius: "25px",

    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    boxShadow:
      "0 15px 35px rgba(46,125,50,0.20)",

  },


  adminLabel: {

    fontSize: "12px",

    letterSpacing: "2px",

    fontWeight: "700",

  },


  welcomeTitle: {

    fontSize: "34px",

    margin: "10px 0",

  },


  description: {

    opacity: 0.9,

    fontSize: "16px",

    maxWidth: "600px",

    lineHeight: "1.6",

  },


  cow: {

    fontSize: "90px",

  },


  errorBox: {

    marginTop: "25px",

    padding: "18px",

    background: "#ffebee",

    color: "#c62828",

    borderRadius: "12px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

  },


  errorRetry: {

    border: "none",

    background: "#c62828",

    color: "#fff",

    padding: "8px 15px",

    borderRadius: "8px",

    cursor: "pointer",

  },


  stats: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "20px",

    marginTop: "30px",

  },


  statCard: {

    background: "#fff",

    padding: "25px",

    borderRadius: "18px",

    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",

    transition: "transform 0.2s",

  },


  statIcon: {

    fontSize: "32px",

    marginBottom: "12px",

  },


  statLabel: {

    color: "#555",

    fontSize: "16px",

    margin: "0",

  },


  statNumber: {

    fontSize: "27px",

    color: "#1f2937",

    marginBottom: "0",

  },


  sectionTitle: {

    color: "#205b26",

    marginTop: "45px",

  },


  operations: {

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",

    gap: "20px",

  },


  operation: {

    background: "#fff",

    padding: "28px",

    borderRadius: "20px",

    textDecoration: "none",

    color: "#26352a",

    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",

  },


  operationIcon: {

    fontSize: "35px",

  },


  operationLink: {

    color: "#2e7d32",

    fontWeight: "700",

  },


  activity: {

    background: "#fff",

    padding: "30px",

    borderRadius: "20px",

    marginTop: "35px",

    boxShadow:
      "0 7px 25px rgba(0,0,0,0.07)",

  },


  activityHeader: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

  },


  activityBadge: {

    background: "#e8f5e9",

    color: "#2e7d32",

    padding: "7px 12px",

    borderRadius: "20px",

    fontWeight: "700",

    fontSize: "13px",

  },


  empty: {

    textAlign: "center",

    color: "#78857b",

    padding: "40px",

  },


  emptyIcon: {

    fontSize: "45px",

  },


  ordersList: {

    marginTop: "20px",

  },


  orderItem: {

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "18px",

    marginBottom: "12px",

    background: "#f7faf7",

    borderRadius: "12px",

  },


  orderDate: {

    margin: "7px 0 0",

    color: "#777",

    fontSize: "13px",

  },


  orderRight: {

    textAlign: "right",

    display: "flex",

    flexDirection: "column",

    gap: "7px",

  },


  orderAmount: {

    color: "#2e7d32",

  },


  orderStatus: {

    background: "#fff3cd",

    padding: "5px 10px",

    borderRadius: "15px",

    fontSize: "12px",

    fontWeight: "700",

  },


  footer: {

    background: "#173d1b",

    color: "#fff",

    textAlign: "center",

    padding: "35px",

    marginTop: "20px",

  },

};


export default AdminDashboard;