import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // ==================================================
  // API URL
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";

  // ==================================================
  // FORM STATE
  // ==================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    // Validation
    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    console.log("=================================");
    console.log("LOGIN REQUEST");
    console.log("Email:", email);
    console.log("API:", `${API_URL}/api/auth/login`);

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

      const token = response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        setError(
          "Login failed. Please try again."
        );
        return;
      }

      // Save login information
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

      // Get role
      const role = String(
        user?.role || "user"
      ).toLowerCase();

      console.log("ROLE:", role);

      // Admin
      if (role === "admin") {
        navigate(
          "/admin-dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      // Normal user
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

      // 401
      if (
        error.response?.status === 401
      ) {
        setError(
          error.response?.data?.message ||
          "Invalid email or password."
        );

        return;
      }

      // 500+
      if (
        error.response?.status >= 500
      ) {
        setError(
          "Server error. Please try again."
        );

        return;
      }

      // Network
      if (!error.response) {
        setError(
          "Unable to connect to the server. Please try again."
        );

        return;
      }

      // Other
      setError(
        error.response?.data?.message ||
        "Login failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div style={styles.page}>

      {/* ==================================================
          LEFT HARI FARMS OVERVIEW
      ================================================== */}

      <section style={styles.hero}>

        <div style={styles.heroGlowOne}></div>
        <div style={styles.heroGlowTwo}></div>

        <div style={styles.heroContent}>

          {/* Logo */}

          <div style={styles.logoCircle}>
            🐄
          </div>

          <h1 style={styles.brandTitle}>
            HARI FARMS
          </h1>

          <p style={styles.brandTagline}>
            Freshness You Can Trust
          </p>

          <div style={styles.line}></div>

          <h2 style={styles.heroHeading}>
            From Our Farm
            <br />
            To Your Family
          </h2>

          <p style={styles.heroDescription}>
            Welcome to HARI FARMS, your trusted
            destination for fresh and quality dairy
            products. We bring the goodness of the
            farm directly to your home.
          </p>

          {/* Features */}

          <div style={styles.features}>

            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                🥛
              </div>

              <div>
                <h3 style={styles.featureTitle}>
                  Fresh Dairy
                </h3>

                <p style={styles.featureText}>
                  Quality dairy products
                  every day
                </p>
              </div>

            </div>


            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                🌱
              </div>

              <div>
                <h3 style={styles.featureTitle}>
                  Farm Fresh
                </h3>

                <p style={styles.featureText}>
                  Naturally sourced
                  ingredients
                </p>
              </div>

            </div>


            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                🚚
              </div>

              <div>
                <h3 style={styles.featureTitle}>
                  Easy Ordering
                </h3>

                <p style={styles.featureText}>
                  Simple and convenient
                  shopping
                </p>
              </div>

            </div>

          </div>

          <p style={styles.bottomMessage}>
            ♥ Goodness in every drop
          </p>

        </div>

      </section>


      {/* ==================================================
          RIGHT LOGIN SECTION
      ================================================== */}

      <section style={styles.loginSection}>

        <div style={styles.loginCard}>

          {/* Mobile Logo */}

          <div style={styles.mobileBrand}>

            <div style={styles.mobileLogo}>
              🐄
            </div>

            <div>
              <h1 style={styles.mobileTitle}>
                HARI FARMS
              </h1>

              <p style={styles.mobileSubtitle}>
                Freshness You Can Trust
              </p>
            </div>

          </div>


          {/* Welcome */}

          <div style={styles.welcomeArea}>

            <div style={styles.welcomeEmoji}>
              👋
            </div>

            <div>

              <h2 style={styles.loginTitle}>
                Welcome Back!
              </h2>

              <p style={styles.loginSubtitle}>
                Login to continue to HARI FARMS
              </p>

            </div>

          </div>


          {/* Error */}

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


          {/* Form */}

          <form onSubmit={handleSubmit}>

            {/* Email */}

            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputContainer}>

                <span style={styles.inputIcon}>
                  ✉
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


            {/* Password */}

            <div style={styles.inputGroup}>

              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputContainer}>

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


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.loginButton,
                ...(loading
                  ? styles.loginButtonDisabled
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


          {/* Register */}

          <div style={styles.registerArea}>

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


          {/* Footer */}

          <div style={styles.footer}>

            <span>
              🔒 Secure Login
            </span>

            <span>
              |
            </span>

            <span>
              HARI FARMS
            </span>

          </div>

        </div>

      </section>


      {/* ==================================================
          RESPONSIVE STYLE
      ================================================== */}

      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          * {
            box-sizing: border-box;
          }

          @media (max-width: 850px) {

            .hari-farms-page {
              flex-direction: column !important;
            }

          }

          @media (max-width: 850px) {

            .hari-farms-hero {
              min-height: auto !important;
              padding: 40px 20px !important;
            }

          }

          @media (max-width: 850px) {

            .hari-farms-login {
              min-height: auto !important;
              padding: 40px 20px !important;
            }

          }

          @media (max-width: 500px) {

            .hari-farms-login-card {
              padding: 10px !important;
            }

          }

          @media (max-width: 850px) {

            .hari-farms-mobile-brand {
              display: flex !important;
            }

          }

        `}
      </style>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = {

  // ================================================
  // PAGE
  // ================================================

  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
    background: "#ffffff",
  },


  // ================================================
  // HERO
  // ================================================

  hero: {
    flex: 1.15,
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #0b542c 0%, #1b6f35 45%, #43a047 100%)",
    color: "#ffffff",
    padding: "50px",
  },


  heroGlowOne: {
    position: "absolute",
    width: "350px",
    height: "350px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.07)",
    top: "-130px",
    left: "-120px",
  },


  heroGlowTwo: {
    position: "absolute",
    width: "450px",
    height: "450px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.05)",
    bottom: "-220px",
    right: "-180px",
  },


  heroContent: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "570px",
  },


  logoCircle: {
    width: "80px",
    height: "80px",
    borderRadius: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.16)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    fontSize: "42px",
    marginBottom: "20px",
    boxShadow:
      "0 15px 35px rgba(0,0,0,0.18)",
  },


  brandTitle: {
    margin: 0,
    fontSize: "48px",
    fontWeight: "800",
    letterSpacing: "4px",
  },


  brandTagline: {
    margin:
      "8px 0 0",
    fontSize: "18px",
    letterSpacing: "1px",
    opacity: 0.9,
  },


  line: {
    width: "70px",
    height: "4px",
    borderRadius: "10px",
    background: "#ffffff",
    margin:
      "28px 0",
  },


  heroHeading: {
    fontSize: "38px",
    lineHeight: 1.2,
    margin:
      "0 0 18px",
    fontWeight: "700",
  },


  heroDescription: {
    fontSize: "16px",
    lineHeight: 1.8,
    maxWidth: "520px",
    opacity: 0.9,
    marginBottom: "32px",
  },


  // ================================================
  // FEATURES
  // ================================================

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },


  feature: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },


  featureIcon: {
    minWidth: "50px",
    height: "50px",
    borderRadius: "15px",
    background:
      "rgba(255,255,255,0.16)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "23px",
  },


  featureTitle: {
    margin: 0,
    fontSize: "16px",
  },


  featureText: {
    margin:
      "4px 0 0",
    fontSize: "13px",
    opacity: 0.75,
  },


  bottomMessage: {
    marginTop: "35px",
    fontSize: "14px",
    opacity: 0.8,
  },


  // ================================================
  // LOGIN SECTION
  // ================================================

  loginSection: {
    flex: 0.85,
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "50px",
    background: "#ffffff",
  },


  loginCard: {
    width: "100%",
    maxWidth: "440px",
  },


  // ================================================
  // MOBILE BRAND
  // ================================================

  mobileBrand: {
    display: "none",
    alignItems: "center",
    gap: "12px",
    marginBottom: "35px",
  },


  mobileLogo: {
    width: "55px",
    height: "55px",
    borderRadius: "16px",
    background: "#e8f5e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },


  mobileTitle: {
    margin: 0,
    color: "#2e7d32",
    fontSize: "24px",
  },


  mobileSubtitle: {
    margin: "3px 0 0",
    color: "#777",
    fontSize: "12px",
  },


  // ================================================
  // WELCOME
  // ================================================

  welcomeArea: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "32px",
  },


  welcomeEmoji: {
    fontSize: "34px",
  },


  loginTitle: {
    margin: 0,
    color: "#222",
    fontSize: "30px",
  },


  loginSubtitle: {
    margin:
      "7px 0 0",
    color: "#777",
    fontSize: "14px",
  },


  // ================================================
  // ERROR
  // ================================================

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#fff3f3",
    color: "#c62828",
    border:
      "1px solid #ffcdd2",
    borderRadius: "10px",
    padding: "13px 15px",
    marginBottom: "20px",
    fontSize: "14px",
  },


  // ================================================
  // INPUTS
  // ================================================

  inputGroup: {
    marginBottom: "22px",
  },


  label: {
    display: "block",
    color: "#333",
    fontWeight: "600",
    fontSize: "14px",
    marginBottom: "8px",
  },


  inputContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    border:
      "1px solid #dce2dd",
    borderRadius: "12px",
    background: "#fafcfb",
    overflow: "hidden",
  },


  inputIcon: {
    paddingLeft: "15px",
    fontSize: "18px",
    color: "#2e7d32",
  },


  input: {
    flex: 1,
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "14px",
    fontSize: "15px",
    color: "#222",
  },


  // ================================================
  // BUTTON
  // ================================================

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
    transition:
      "transform 0.2s",
  },


  loginButtonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },


  spinner: {
    width: "17px",
    height: "17px",
    border:
      "2px solid rgba(255,255,255,0.4)",
    borderTop:
      "2px solid #ffffff",
    borderRadius: "50%",
    display: "inline-block",
    animation:
      "spin 0.7s linear infinite",
  },


  arrow: {
    fontSize: "22px",
  },


  // ================================================
  // REGISTER
  // ================================================

  registerArea: {
    textAlign: "center",
    marginTop: "28px",
    color: "#777",
    fontSize: "14px",
  },


  registerLink: {
    marginLeft: "6px",
    color: "#2e7d32",
    fontWeight: "700",
    textDecoration: "none",
  },


  // ================================================
  // FOOTER
  // ================================================

  footer: {
    marginTop: "35px",
    paddingTop: "20px",
    borderTop:
      "1px solid #eeeeee",
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    color: "#999",
    fontSize: "12px",
  },

};


export default Login;