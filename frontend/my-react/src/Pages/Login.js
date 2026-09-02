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


  // ==================================================
  // API URL
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";


  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {

    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };


  // ==================================================
  // LOGIN
  // ==================================================

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

        console.log(
          "================================="
        );

        console.log(
          "🔄 Sending login request..."
        );

        console.log(
          "Email:",
          formData.email
        );


        const response =
          await axios.post(
            `${API_URL}/api/auth/login`,
            {
              email:
                formData.email
                  .trim()
                  .toLowerCase(),

              password:
                formData.password,
            }
          );


        console.log(
          "LOGIN RESPONSE:",
          response.data
        );


        // ==================================================
        // CHECK TOKEN
        // ==================================================

        if (
          !response.data.token
        ) {

          console.error(
            "❌ Token missing"
          );

          setError(
            response.data.message ||
            "Login failed. Token was not received."
          );

          return;
        }


        // ==================================================
        // SAVE TOKEN
        // ==================================================

        localStorage.setItem(
          "token",
          response.data.token
        );


        // ==================================================
        // SAVE USER
        // ==================================================

        if (
          response.data.user
        ) {

          localStorage.setItem(
            "user",
            JSON.stringify(
              response.data.user
            )
          );
        }


        console.log(
          "✅ LOGIN SUCCESSFUL"
        );


        const user =
          response.data.user;


        // ==================================================
        // NAVIGATION
        // ==================================================

        if (
          user &&
          user.role &&
          user.role.toLowerCase() ===
            "admin"
        ) {

          console.log(
            "➡️ Opening Admin Dashboard"
          );

          navigate(
            "/admin-dashboard",
            {
              replace: true,
            }
          );

        } else {

          console.log(
            "➡️ Opening User Dashboard"
          );

          navigate(
            "/dashboard",
            {
              replace: true,
            }
          );
        }


      } catch (error) {

        console.error(
          "❌ LOGIN ERROR:",
          error
        );


        if (
          error.response
        ) {

          console.error(
            "STATUS:",
            error.response.status
          );

          console.error(
            "SERVER RESPONSE:",
            error.response.data
          );


          setError(
            error.response.data
              ?.message ||
            "Invalid email or password."
          );


        } else if (
          error.request
        ) {

          console.error(
            "❌ No response from server"
          );

          setError(
            "Unable to connect to server."
          );


        } else {

          setError(
            "Something went wrong."
          );
        }

      } finally {

        setLoading(false);
      }
    };


  // ==================================================
  // UI
  // ==================================================

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <div style={styles.icon}>
          🐄
        </div>

        <h1>
          Login
        </h1>

        <p style={styles.subtitle}>
          Login to Dairy Management System
        </p>


        {/* ERROR */}

        {error && (

          <div style={styles.error}>
            {error}
          </div>

        )}


        {/* FORM */}

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* LOGIN BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,

              opacity:
                loading
                  ? 0.7
                  : 1,

              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>


        {/* REGISTER */}

        <p
          style={
            styles.registerText
          }
        >

          Don't have an account?{" "}

          <Link to="/register">
            Create Account
          </Link>

        </p>

      </div>

    </div>
  );
}


// ======================================================
// STYLES
// ======================================================

const styles = {

  container: {
    minHeight: "100vh",

    display: "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

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

    boxSizing:
      "border-box",
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

    border:
      "1px solid #ddd",

    boxSizing:
      "border-box",

    fontSize: "15px",
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

    fontSize: "16px",
  },

  error: {
    padding: "12px",

    background:
      "#ffebee",

    color:
      "#c62828",

    borderRadius: "8px",

    marginBottom: "15px",
  },

  registerText: {
    marginTop: "20px",
  },
};


export default Login;