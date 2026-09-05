import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (loading) {
      return;
    }

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
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
          "Invalid login response from server."
        );
        return;
      }

      // ========================================
      // GET USER ROLE
      // ========================================

      const role = String(
        user?.role || "user"
      )
        .trim()
        .toLowerCase();

      console.log(
        "Logged-in user:",
        user
      );

      console.log(
        "User role:",
        role
      );

      // ========================================
      // SAVE LOGIN DATA
      // ========================================

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          role,
        })
      );

      // ========================================
      // ADMIN
      // ========================================

      if (
        email === "admin@gmail.com" &&
        role === "admin"
      ) {
        console.log(
          "ADMIN LOGIN → ADMIN DASHBOARD"
        );

        navigate(
          "/admin-dashboard",
          {
            replace: true,
          }
        );

        return;
      }

      // ========================================
      // NORMAL USER
      // ========================================

      console.log(
        "USER LOGIN → USER DASHBOARD"
      );

      navigate(
        "/user-dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to the server. Please try again."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div style={styles.page}>

      {/* ======================================
          LEFT BRANDING SECTION
      ====================================== */}

      <div style={styles.brandSection}>

        <div style={styles.brandOverlay}></div>

        <div style={styles.brandContent}>

          {/* BRAND LOGO */}

          <div style={styles.logoContainer}>

            <div style={styles.logoCircle}>
              🥛
            </div>

            <div>
              <h1 style={styles.brandName}>
                HARI FARMS
              </h1>

              <p style={styles.brandTagline}>
                Pure • Fresh • Natural
              </p>
            </div>

          </div>

          {/* MAIN BRANDING */}

          <div style={styles.brandMain}>

            <p style={styles.smallTitle}>
              WELCOME TO
            </p>

            <h2 style={styles.brandHeading}>
              Freshness
              <br />
              Straight From
              <br />
              <span style={styles.greenText}>
                Our Farm
              </span>
            </h2>

            <p style={styles.brandDescription}>
              Experience the goodness of
              fresh and quality dairy products
              delivered with care from HARI FARMS
              to your home.
            </p>

          </div>

          {/* FEATURES */}

          <div style={styles.features}>

            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                🐄
              </div>

              <div>
                <h3 style={styles.featureTitle}>
                  Farm Fresh
                </h3>

                <p style={styles.featureText}>
                  Quality products
                </p>
              </div>

            </div>

            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                🌱
              </div>

              <div>
                <h3 style={styles.featureTitle}>
                  Natural
                </h3>

                <p style={styles.featureText}>
                  Pure & healthy
                </p>
              </div>

            </div>

            <div style={styles.feature}>

              <div style={styles.featureIcon}>
                ❤️
              </div>

              <div>
                <h3 style={styles.featureTitle}>
                  Trusted
                </h3>

                <p style={styles.featureText}>
                  Made with care
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================
          RIGHT LOGIN SECTION
      ====================================== */}

      <div style={styles.loginSection}>

        <div style={styles.loginCard}>

          {/* MOBILE LOGO */}

          <div style={styles.mobileLogo}>
            🥛
          </div>

          <h2 style={styles.loginHeading}>
            Welcome Back!
          </h2>

          <p style={styles.loginSubtitle}>
            Login to continue to HARI FARMS
          </p>

          {/* ERROR */}

          {error && (
            <div style={styles.error}>
              <span style={styles.errorIcon}>
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

              <label
                htmlFor="email"
                style={styles.label}
              >
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                  style={styles.input}
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div style={styles.inputGroup}>

              <label
                htmlFor="password"
                style={styles.label}
              >
                Password
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
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
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
            >

              {loading ? (
                <>
                  <span style={styles.spinner}>
                    ⟳
                  </span>

                  Logging in...
                </>
              ) : (
                <>
                  Login to Account
                  <span style={styles.arrow}>
                    →
                  </span>
                </>
              )}

            </button>

          </form>

          {/* DIVIDER */}

          <div style={styles.divider}>
            <span style={styles.dividerLine}></span>

            <span style={styles.dividerText}>
              OR
            </span>

            <span style={styles.dividerLine}></span>
          </div>

          {/* REGISTER */}

          <div style={styles.registerBox}>

            <p style={styles.registerText}>
              Don't have an account?
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/register")
              }
              style={styles.registerButton}
            >
              Create New Account
            </button>

          </div>

          {/* FOOTER */}

          <p style={styles.footerText}>
            🥛 Freshness you can trust
          </p>

        </div>

      </div>

    </div>
  );
}

// ==========================================
// STYLES
// ==========================================

const styles = {

  page: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    fontFamily:
      "'Segoe UI', Arial, Helvetica, sans-serif",
    background: "#f5f8f4",
  },

  // ========================================
  // LEFT BRAND SECTION
  // ========================================

  brandSection: {
    width: "52%",
    minHeight: "100vh",
    position: "relative",
    overflow: "hidden",
    background:
      "linear-gradient(145deg, #123b1a 0%, #1b5e20 45%, #2e7d32 100%)",
    display: "flex",
    alignItems: "center",
  },

  brandOverlay: {
    position: "absolute",
    width: "550px",
    height: "550px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.04)",
    top: "-200px",
    right: "-180px",
  },

  brandContent: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxWidth: "620px",
    padding: "55px 8%",
    boxSizing: "border-box",
    color: "#ffffff",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "70px",
  },

  logoCircle: {
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.15)",
    border:
      "1px solid rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "34px",
  },

  brandName: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "2px",
  },

  brandTagline: {
    margin: "5px 0 0",
    fontSize: "12px",
    letterSpacing: "3px",
    opacity: 0.75,
  },

  brandMain: {
    maxWidth: "500px",
  },

  smallTitle: {
    fontSize: "13px",
    letterSpacing: "4px",
    fontWeight: "700",
    opacity: 0.75,
    marginBottom: "18px",
  },

  brandHeading: {
    fontSize: "52px",
    lineHeight: "1.12",
    margin: 0,
    fontWeight: "800",
    letterSpacing: "-1px",
  },

  greenText: {
    color: "#b9e5a8",
  },

  brandDescription: {
    fontSize: "16px",
    lineHeight: "1.8",
    maxWidth: "470px",
    marginTop: "25px",
    opacity: 0.82,
  },

  // ========================================
  // FEATURES
  // ========================================

  features: {
    display: "flex",
    gap: "35px",
    marginTop: "55px",
    flexWrap: "wrap",
  },

  feature: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  featureIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,0.12)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  featureTitle: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "700",
  },

  featureText: {
    margin: "3px 0 0",
    fontSize: "11px",
    opacity: 0.65,
  },

  // ========================================
  // LOGIN SECTION
  // ========================================

  loginSection: {
    width: "48%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    boxSizing: "border-box",
    background: "#f8faf7",
  },

  loginCard: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "48px",
    borderRadius: "22px",
    boxSizing: "border-box",
    boxShadow:
      "0 15px 50px rgba(0,0,0,0.08)",
    border:
      "1px solid #edf2ed",
  },

  mobileLogo: {
    display: "none",
  },

  loginHeading: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "800",
    color: "#183b20",
  },

  loginSubtitle: {
    color: "#7b867e",
    fontSize: "14px",
    marginTop: "8px",
    marginBottom: "32px",
  },

  // ========================================
  // ERROR
  // ========================================

  error: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#fff1f1",
    border:
      "1px solid #ffd4d4",
    color: "#c62828",
    padding: "12px 14px",
    borderRadius: "9px",
    fontSize: "13px",
    marginBottom: "22px",
  },

  errorIcon: {
    fontSize: "16px",
  },

  // ========================================
  // INPUTS
  // ========================================

  inputGroup: {
    marginBottom: "22px",
  },

  label: {
    display: "block",
    color: "#304936",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "8px",
  },

  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #dce5dd",
    borderRadius: "10px",
    background: "#fbfdfb",
    transition: "all 0.2s ease",
  },

  inputIcon: {
    width: "45px",
    textAlign: "center",
    fontSize: "17px",
    opacity: 0.55,
  },

  input: {
    flex: 1,
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "14px 12px 14px 0",
    fontSize: "14px",
    color: "#222222",
    boxSizing: "border-box",
  },

  // ========================================
  // LOGIN BUTTON
  // ========================================

  loginButton: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #246b2a, #43a047)",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow:
      "0 8px 20px rgba(46,125,50,0.20)",
  },

  arrow: {
    fontSize: "20px",
    lineHeight: 1,
  },

  spinner: {
    fontSize: "20px",
    display: "inline-block",
  },

  // ========================================
  // DIVIDER
  // ========================================

  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    margin: "30px 0",
  },

  dividerLine: {
    flex: 1,
    height: "1px",
    background: "#e8ede9",
  },

  dividerText: {
    color: "#a0aaa3",
    fontSize: "11px",
    fontWeight: "700",
  },

  // ========================================
  // REGISTER
  // ========================================

  registerBox: {
    textAlign: "center",
  },

  registerText: {
    color: "#707b73",
    fontSize: "13px",
    margin: "0 0 12px",
  },

  registerButton: {
    width: "100%",
    height: "48px",
    border:
      "1px solid #2e7d32",
    borderRadius: "10px",
    background: "#ffffff",
    color: "#2e7d32",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  },

  // ========================================
  // FOOTER
  // ========================================

  footerText: {
    textAlign: "center",
    color: "#a0aaa3",
    fontSize: "11px",
    marginTop: "28px",
    marginBottom: 0,
  },
};

// ==========================================
// RESPONSIVE CSS
// ==========================================

const responsiveStyle = document.createElement("style");

responsiveStyle.innerHTML = `
  @media (max-width: 900px) {

    .hari-farms-login-page {
      flex-direction: column;
    }

  }

  @media (max-width: 900px) {

    body {
      margin: 0;
    }

  }
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "hari-farms-login-responsive"
  )
) {
  responsiveStyle.id =
    "hari-farms-login-responsive";

  document.head.appendChild(
    responsiveStyle
  );
}

export default Login;