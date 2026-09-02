import React, { useState } from "react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setError("");
      setLoading(true);

      // Remove old authentication
      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      try {

        const response =
          await axios.post(
            `${API_URL}/api/auth/login`,
            {
              email:
                formData.email.trim(),
              password:
                formData.password,
            }
          );


        if (
          response.data.success &&
          response.data.token
        ) {

          // Save JWT
          localStorage.setItem(
            "token",
            response.data.token
          );


          // Save user
          localStorage.setItem(
            "user",
            JSON.stringify(
              response.data.user
            )
          );


          console.log(
            "✅ Login successful"
          );


          // Direct dashboard
          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );

        } else {

          setError(
            response.data.message ||
            "Login failed."
          );
        }

      } catch (error) {

        console.error(
          "LOGIN ERROR:",
          error
        );

        if (
          error.response
        ) {

          setError(
            error.response.data
              ?.message ||
            "Invalid email or password."
          );

        } else {

          setError(
            "Unable to connect to server."
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

        <h1>Login</h1>

        <p style={styles.subtitle}>
          Login to Dairy Management System
        </p>


        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        <form
          onSubmit={handleSubmit}
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={
              formData.email
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
            required
          />


          <input
            type="password"
            name="password"
            placeholder="Password"
            value={
              formData.password
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
            required
          />


          <button
            type="submit"
            disabled={loading}
            style={
              styles.button
            }
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>


        <p style={styles.registerText}>

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
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

  registerText: {
    marginTop: "20px",
  },
};

export default Login;