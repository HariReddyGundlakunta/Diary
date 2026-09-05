import React, { useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://diary-88q0.onrender.com";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Prevent duplicate submission
    if (loading) {
      return;
    }

    // ========================================
    // VALIDATION
    // ========================================

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      // ======================================
      // SEND REGISTRATION REQUEST
      // ======================================

      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name,
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
        "REGISTER RESPONSE:",
        response.data
      );

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Redirect to login
      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1000);

    } catch (error) {
      console.error(
        "REGISTER ERROR:",
        error
      );

      if (error.response) {
        if (
          error.response.status === 409
        ) {
          setError(
            "Email already exists. Please login."
          );
        } else {
          setError(
            error.response.data?.message ||
              "Registration failed."
          );
        }
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

      <div style={styles.card}>

        {/* LOGO */}

        <div style={styles.logo}>
          🥛
        </div>

        <h1 style={styles.title}>
          HARI FARMS
        </h1>

        <h2 style={styles.heading}>
          Create Account
        </h2>

        <p style={styles.subtitle}>
          Join HARI FARMS today
        </p>

        {/* ERROR */}

        {error && (
          <div style={styles.error}>
            ⚠️ {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div style={styles.success}>
            ✓ {success}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <label
            htmlFor="name"
            style={styles.label}
          >
            Full Name
          </label>

          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            autoComplete="name"
            required
          />

          {/* EMAIL */}

          <label
            htmlFor="email"
            style={styles.label}
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            autoComplete="email"
            required
          />

          {/* PASSWORD */}

          <label
            htmlFor="password"
            style={styles.label}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            autoComplete="new-password"
            required
          />

          {/* CONFIRM PASSWORD */}

          <label
            htmlFor="confirmPassword"
            style={styles.label}
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            autoComplete="new-password"
            required
          />

          {/* REGISTER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
              cursor: loading
                ? "not-allowed"
                : "pointer",
            }}
          >
            {loading
              ? "Creating Account..."
              : "Create Account →"}
          </button>

        </form>

        {/* LOGIN LINK */}

        <p style={styles.bottom}>

          Already have an account?

          {" "}

          <Link
            to="/login"
            style={styles.link}
          >
            Login
          </Link>

        </p>

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
    background:
      "linear-gradient(135deg,#e8f5e9,#ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "30px",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "460px",
    background: "#ffffff",
    padding: "38px",
    borderRadius: "25px",
    boxShadow:
      "0 15px 45px rgba(0,0,0,0.10)",
    boxSizing: "border-box",
  },

  logo: {
    textAlign: "center",
    fontSize: "50px",
  },

  title: {
    textAlign: "center",
    color: "#2e7d32",
    margin: "5px 0",
    fontSize: "30px",
    fontWeight: "800",
  },

  heading: {
    textAlign: "center",
    color: "#245b29",
    margin: "10px 0 5px",
  },

  subtitle: {
    textAlign: "center",
    color: "#7a867e",
    marginBottom: "25px",
  },

  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#35563a",
    marginTop: "15px",
    marginBottom: "7px",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "13px",
    border:
      "1px solid #d7e4d9",
    borderRadius: "10px",
    fontSize: "14px",
    outline: "none",
  },

  button: {
    width: "100%",
    marginTop: "25px",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg,#2e7d32,#43a047)",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "700",
  },

  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "11px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "13px",
    marginBottom: "15px",
  },

  success: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "11px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "13px",
    marginBottom: "15px",
  },

  bottom: {
    textAlign: "center",
    color: "#7a867e",
    marginTop: "25px",
    fontSize: "14px",
  },

  link: {
    color: "#2e7d32",
    fontWeight: "700",
    textDecoration: "none",
  },
};

export default Register;