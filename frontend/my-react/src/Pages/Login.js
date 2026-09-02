import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://diary-88q0.onrender.com";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      console.log("=================================");
      console.log("LOGIN REQUEST");
      console.log("Email:", formData.email);
      console.log("API:", `${API_URL}/api/auth/login`);
      console.log("=================================");

      // Remove previous login
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      console.log("LOGIN RESPONSE:", response.data);

      const token = response.data.token;
      const user = response.data.user;

      if (!token || !user) {
        setError("Invalid response received from server.");
        return;
      }

      // Save login information
      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      console.log("=================================");
      console.log("LOGIN SUCCESS");
      console.log("USER:", user);
      console.log("ROLE:", user.role);
      console.log("=================================");

      setSuccess("Login successful!");

      // ==========================================
      // ADMIN → ADMIN DASHBOARD
      // NORMAL USER → HOME
      // ==========================================

      setTimeout(() => {
        const role = String(
          user?.role || "user"
        ).toLowerCase();

        if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/home");
        }
      }, 500);
    } catch (error) {
      console.error("=================================");
      console.error("LOGIN ERROR");
      console.error(error);
      console.error("=================================");

      if (error.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (error.response?.status === 404) {
        setError(
          "Login API was not found on the server."
        );
      } else if (error.response?.status === 409) {
        setError(
          "Login conflict. Please try again."
        );
      } else {
        setError(
          error.response?.data?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ==========================================
          LEFT BRAND SECTION
      =========================================== */}

      <div style={styles.brandSection}>

        <div style={styles.brandContent}>

          <div style={styles.brandIcon}>
            🥛
          </div>

          <h1 style={styles.brandTitle}>
            HARI FARMS
          </h1>

          <div style={styles.brandLine}></div>

          <h2 style={styles.brandHeading}>
            Fresh From Farm
          </h2>

          <p style={styles.brandText}>
            Pure dairy products,
            <br />
            straight from our farm
            <br />
            to your family.
          </p>

          <div style={styles.features}>

            <div style={styles.feature}>
              <span>🌿</span>
              <span>100% Fresh</span>
            </div>

            <div style={styles.feature}>
              <span>🐄</span>
              <span>Farm Quality</span>
            </div>

            <div style={styles.feature}>
              <span>❤️</span>
              <span>Made With Care</span>
            </div>

          </div>

        </div>

      </div>


      {/* ==========================================
          LOGIN SECTION
      =========================================== */}

      <div style={styles.loginSection}>

        <div style={styles.card}>

          <div style={styles.loginIcon}>
            🔐
          </div>

          <h2 style={styles.loginTitle}>
            Welcome Back
          </h2>

          <p style={styles.subtitle}>
            Login to your HARI FARMS account
          </p>


          {/* ERROR */}

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}


          {/* SUCCESS */}

          {success && (
            <div style={styles.successBox}>
              <span>✓</span>
              <span>{success}</span>
            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}

            <div style={styles.field}>

              <label style={styles.label}>
                Email Address
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  ✉️
                </span>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="email"
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div style={styles.field}>

              <label style={styles.label}>
                Password
              </label>

              <div style={styles.inputWrapper}>

                <span style={styles.inputIcon}>
                  🔒
                </span>

                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  style={styles.input}
                  autoComplete="current-password"
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
              }}
            >

              {loading ? (
                <>
                  <span>⏳</span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span style={styles.buttonArrow}>
                    →
                  </span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}

          <div style={styles.registerArea}>

            <p style={styles.registerText}>
              Don't have an account?
            </p>

            <Link
              to="/register"
              style={styles.registerLink}
            >
              Create Account
            </Link>

          </div>


          {/* HOME LINK */}

          <Link
            to="/home"
            style={styles.homeLink}
          >
            ← Back to Home
          </Link>

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
    background: "#f5faf6",
  },


  // ==========================================
  // BRAND SECTION
  // ==========================================

  brandSection: {
    width: "45%",
    minHeight: "100vh",
    background:
      "linear-gradient(145deg, #124d19, #2e7d32, #43a047)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },


  brandContent: {
    textAlign: "center",
    padding: "40px",
    position: "relative",
    zIndex: 2,
  },


  brandIcon: {
    width: "105px",
    height: "105px",
    borderRadius: "50%",
    background:
      "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "58px",
    margin: "0 auto 20px",
    border:
      "2px solid rgba(255,255,255,0.25)",
  },


  brandTitle: {
    fontSize: "42px",
    margin: "0",
    fontWeight: "800",
    letterSpacing: "2px",
  },


  brandLine: {
    width: "60px",
    height: "4px",
    background: "#ffffff",
    margin: "18px auto",
    borderRadius: "10px",
  },


  brandHeading: {
    fontSize: "25px",
    margin: "10px 0",
    fontWeight: "600",
  },


  brandText: {
    fontSize: "16px",
    lineHeight: "1.8",
    opacity: 0.9,
    marginTop: "15px",
  },


  features: {
    marginTop: "35px",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    gap: "13px",
  },


  feature: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    fontSize: "14px",
    fontWeight: "600",
  },


  // ==========================================
  // LOGIN SECTION
  // ==========================================

  loginSection: {
    width: "55%",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    boxSizing: "border-box",
  },


  card: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "42px",
    borderRadius: "25px",
    boxShadow:
      "0 20px 60px rgba(25,80,30,0.12)",
    boxSizing: "border-box",
  },


  loginIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 15px",
    borderRadius: "18px",
    background: "#e8f5e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "30px",
  },


  loginTitle: {
    textAlign: "center",
    color: "#1b5e20",
    fontSize: "30px",
    margin: "5px 0",
    fontWeight: "800",
  },


  subtitle: {
    textAlign: "center",
    color: "#7b877e",
    fontSize: "14px",
    marginBottom: "28px",
  },


  // ==========================================
  // ALERTS
  // ==========================================

  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#ffebee",
    color: "#c62828",
    border:
      "1px solid #ffcdd2",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "18px",
  },


  successBox: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#e8f5e9",
    color: "#2e7d32",
    border:
      "1px solid #c8e6c9",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "13px",
    marginBottom: "18px",
  },


  // ==========================================
  // FORM
  // ==========================================

  field: {
    marginBottom: "20px",
  },


  label: {
    display: "block",
    color: "#304b34",
    fontSize: "14px",
    fontWeight: "700",
    marginBottom: "8px",
  },


  inputWrapper: {
    display: "flex",
    alignItems: "center",
    border:
      "1px solid #d7e4d9",
    borderRadius: "11px",
    background: "#fbfdfb",
    overflow: "hidden",
  },


  inputIcon: {
    paddingLeft: "14px",
    fontSize: "17px",
  },


  input: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "14px 12px",
    fontSize: "14px",
    color: "#26352a",
    boxSizing: "border-box",
  },


  // ==========================================
  // LOGIN BUTTON
  // ==========================================

  loginButton: {
    width: "100%",
    border: "none",
    padding: "15px",
    borderRadius: "11px",
    background:
      "linear-gradient(135deg, #2e7d32, #43a047)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    boxShadow:
      "0 8px 20px rgba(46,125,50,0.22)",
  },


  buttonArrow: {
    fontSize: "20px",
  },


  // ==========================================
  // REGISTER
  // ==========================================

  registerArea: {
    textAlign: "center",
    marginTop: "25px",
    paddingTop: "22px",
    borderTop:
      "1px solid #edf1ed",
  },


  registerText: {
    display: "inline",
    color: "#7b877e",
    fontSize: "13px",
    marginRight: "7px",
  },


  registerLink: {
    color: "#2e7d32",
    fontSize: "13px",
    fontWeight: "800",
    textDecoration: "none",
  },


  homeLink: {
    display: "block",
    textAlign: "center",
    color: "#7b877e",
    textDecoration: "none",
    fontSize: "13px",
    marginTop: "20px",
  },

};


export default Login;