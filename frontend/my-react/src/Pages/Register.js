import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        API_URL + "/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      setSuccess(
        "Registration successful! Please login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      if (err.response) {
        setError(
          err.response.data?.message ||
          "Registration failed."
        );
      } else {
        setError(
          "Unable to connect to the server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <div style={styles.icon}>
          🐄
        </div>

        <h1>Create Account</h1>

        <p style={styles.subtitle}>
          Join the Dairy Management System
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        <p style={styles.loginText}>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    background:
      "linear-gradient(135deg, #fff3e0, #e8f5e9)",
  },

  card: {
    background: "white",
    width: "100%",
    maxWidth: "450px",
    padding: "40px",
    borderRadius: "25px",
    boxShadow:
      "0 15px 40px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  icon: {
    fontSize: "55px",
  },

  subtitle: {
    color: "#777",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    background:
      "linear-gradient(135deg, #ff9800, #f57c00)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  error: {
    padding: "12px",
    background: "#ffebee",
    color: "#c62828",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  success: {
    padding: "12px",
    background: "#e8f5e9",
    color: "#2e7d32",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  loginText: {
    marginTop: "20px",
  },
};

export default Register;