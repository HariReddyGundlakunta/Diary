import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  // ================================================
  // API URL
  // ================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";


  // ================================================
  // FORM STATE
  // ================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // ================================================
  // HANDLE INPUT
  // ================================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

  };


  // ================================================
  // LOGIN
  // ================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;


    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }


    setLoading(true);


    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log(
      "API:",
      `${API_URL}/api/auth/login`
    );


    try {

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );


      console.log(
        "LOGIN RESPONSE:",
        response.data
      );


      const token =
        response.data?.token;

      const user =
        response.data?.user;


      if (!token || !user) {

        setError(
          "Login failed. Please try again."
        );

        return;
      }


      // ==========================================
      // SAVE LOGIN
      // ==========================================

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      console.log("LOGIN SUCCESS");
      console.log("USER:", user);


      // ==========================================
      // ROLE
      // ==========================================

      const role =
        String(
          user?.role || "user"
        ).toLowerCase();


      console.log(
        "ROLE:",
        role
      );


      // ==========================================
      // ADMIN
      // ==========================================

      if (role === "admin") {

        navigate(
          "/admin-dashboard",
          {
            replace: true,
          }
        );

        return;
      }


      // ==========================================
      // NORMAL USER
      // ==========================================

      navigate(
        "/home",
        {
          replace: true,
        }
      );


    } catch (error) {

      console.error(
        "LOGIN ERROR:",
        error
      );


      if (
        error.response?.status === 401
      ) {

        setError(
          error.response?.data?.message ||
          "Invalid email or password."
        );

        return;
      }


      if (
        error.response?.status >= 500
      ) {

        setError(
          "Server error. Please try again."
        );

        return;
      }


      if (!error.response) {

        setError(
          "Unable to connect to the server. Please try again."
        );

        return;
      }


      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  // ================================================
  // UI
  // ================================================

  return (

    <div style={styles.page}>

      {/* ============================================
          LEFT SIDE
      ============================================ */}

      <div style={styles.hero}>

        <div style={styles.heroOverlay}></div>

        <div style={styles.heroContent}>

          {/* BRAND */}

          <div style={styles.brandIcon}>
            🐄
          </div>

          <h1 style={styles.brandTitle}>
            HARI FARMS
          </h1>

          <p style={styles.brandSubtitle}>
            Freshness You Can Trust
          </p>


          {/* OVERVIEW */}

          <div style={styles.overviewBox}>

            <h2 style={styles.overviewTitle}>
              Welcome to HARI FARMS
            </h2>

            <p style={styles.overviewText}>
              Experience fresh, quality dairy
              products delivered with care.
              HARI FARMS brings farm-fresh
              goodness directly to your family.
            </p>


            <div style={styles.features}>

              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  🥛
                </span>

                <div>
                  <strong>
                    Fresh Dairy
                  </strong>

                  <small>
                    Quality products every day
                  </small>
                </div>
              </div>


              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  🌱
                </span>

                <div>
                  <strong>
                    Farm Fresh
                  </strong>

                  <small>
                    Naturally sourced products
                  </small>
                </div>
              </div>


              <div style={styles.feature}>
                <span style={styles.featureIcon}>
                  🚚
                </span>

                <div>
                  <strong>
                    Easy Ordering
                  </strong>

                  <small>
                    Simple and convenient shopping
                  </small>
                </div>
              </div>

            </div>

          </div>


          <p style={styles.bottomText}>
            From our farm to your family ❤️
          </p>

        </div>

      </div>


      {/* ============================================
          RIGHT SIDE
      ============================================ */}

      <div style={styles.loginSide}>

        <div style={styles.loginCard}>

          {/* MOBILE BRAND */}

          <div style={styles.mobileBrand}>

            <div style={styles.mobileIcon}>
              🐄
            </div>

            <h1>
              HARI FARMS
            </h1>

          </div>


          <div style={styles.welcome}>

            <span style={styles.welcomeIcon}>
              👋
            </span>

            <div>

              <h2>
                Welcome Back!
              </h2>

              <p>
                Login to continue to HARI FARMS
              </p>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div style={styles.errorBox}>

              <span>
                ⚠️
              </span>

              <span>
                {error}
              </span>

            </div>

          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>


            {/* EMAIL */}

            <div style={styles.inputGroup}>

              <label>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  disabled={loading}
                  required
                  style={styles.input}
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div style={styles.inputGroup}>

              <label>
                Password
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  style={styles.input}
                />

              </div>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                ...(loading
                  ? styles.loginButtonLoading
                  : {}),
              }}
            >

              {loading ? (
                <>
                  <span style={styles.spinner}></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span style={styles.arrow}>
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div style={styles.registerSection}>

            <span>
              Don't have an account?
            </span>

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create Account
            </Link>

          </div>


          {/* FOOTER */}

          <div style={styles.footer}>

            <span>
              🔒 Secure Login
            </span>

            <span>
              •
            </span>

            <span>
              HARI FARMS
            </span>

          </div>

        </div>

      </div>

    </div>

  );

}


// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
    background: "#f5f7f5",
  },


  // ================================================
  // HERO
  // ================================================

  hero: {
    flex: "1.15",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(135deg, #0f5d32 0%, #2e7d32 45%, #66bb6a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },


  heroOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.16), transparent 30%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.12), transparent 30%)",
  },


  heroContent: {
    position: "relative",
    zIndex: 2,
    width: "85%",
    maxWidth: "600px",
    color: "#ffffff",
    padding: "50px 20px",
  },


  brandIcon: {
    width: "76px",
    height: "76px",
    borderRadius: "22px",
    background:
      "rgba(255,255,255,0.18)",
    backdropFilter: "blur(10px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "42px",
    marginBottom: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.15)",
  },


  brandTitle: {
    fontSize: "52px",
    letterSpacing: "3px",
    margin: "0 0 8px",
    fontWeight: "800",
  },


  brandSubtitle: {
    fontSize: "21px",
    margin: "0 0 40px",
    opacity: 0.9,
  },


  overviewBox: {
    background:
      "rgba(255,255,255,0.12)",
    border:
      "1px solid rgba(255,255,255,0.2)",
    borderRadius: "24px",
    padding: "30px",
    backdropFilter: "blur(12px)",
    boxShadow:
      "0 20px 50px rgba(0,0,0,0.12)",
  },


  overviewTitle: {
    margin: "0 0 12px",
    fontSize: "28px",
  },


  overviewText: {
    lineHeight: 1.7,
    fontSize: "16px",
    opacity: 0.92,
    marginBottom: "28px",
  },


  features: {
    display: "flex",
    flexDirection: "column",
    gap: "17px",
  },


  feature: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },


  featureIcon: {
    width: "45px",
    height: "45px",
    borderRadius: "13px",
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },


  feature: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },


  featureIcon: {
    minWidth: "45px",
    height: "45px",
    borderRadius: "13px",
    background:
      "rgba(255,255,255,0.18)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "22px",
  },


  bottomText: {
    marginTop: "30px",
    fontSize: "15px",
    opacity: 0.85,
  },


  // ================================================
  // LOGIN SIDE
  // ================================================

  loginSide: {
    flex: "0.85",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    background: "#ffffff",
  },


  loginCard: {
    width: "100%",
    maxWidth: "440px",
  },


  mobileBrand: {
    display: "none",
  },


  welcome: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "35px",
  },


  welcomeIcon: {
    fontSize: "34px",
  },


  inputGroup: {
    marginBottom: "22px",
  },


  inputGroupLabel: {
    display: "block",
  },


  errorBox: {
    display: "flex",
    gap: "9px",
    alignItems: "center",
    background: "#fff1f0",
    border: "1px solid #ffcdd2",
    color: "#c62828",
    padding: "13px 15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
  },


  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d7ddd8",
    borderRadius: "12px",
    background: "#fafcfb",
    transition: "all 0.2s",
    overflow: "hidden",
  },


  inputIcon: {
    paddingLeft: "15px",
    fontSize: "18px",
  },


  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "14px 15px",
    fontSize: "16px",
    color: "#222",
  },


  loginButton: {
    width: "100%",
    border: "none",
    borderRadius: "12px",
    padding: "15px",
    background:
      "linear-gradient(135deg, #2e7d32, #43a047)",
    color: "#ffffff",
    fontSize: "17px",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow:
      "0 8px 20px rgba(46,125,50,0.25)",
  },


  loginButtonLoading: {
    opacity: 0.75,
    cursor: "not-allowed",
  },


  arrow: {
    fontSize: "22px",
  },


  spinner: {
    width: "17px",
    height: "17px",
    border:
      "2px solid rgba(255,255,255,0.5)",
    borderTop:
      "2px solid #ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation:
      "spin 0.7s linear infinite",
  },


  registerSection: {
    textAlign: "center",
    marginTop: "28px",
    color: "#666",
    fontSize: "14px",
  },


  registerLink: {
    marginLeft: "6px",
    color: "#2e7d32",
    fontWeight: "700",
    textDecoration: "none",
  },


  footer: {
    marginTop: "35px",
    paddingTop: "20px",
    borderTop: "1px solid #eeeeee",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    color: "#999",
    fontSize: "12px",
  },

};


export default Login;