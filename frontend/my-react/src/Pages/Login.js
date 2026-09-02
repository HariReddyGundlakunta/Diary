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

    const {
      name,
      value,
    } = e.target;


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

    const email =
      formData.email.trim();

    const password =
      formData.password;


    // ==============================================
    // VALIDATION
    // ==============================================

    if (!email) {

      setError(
        "Please enter your email."
      );

      return;

    }


    if (!password) {

      setError(
        "Please enter your password."
      );

      return;

    }


    setLoading(true);


    console.log(
      "LOGIN REQUEST"
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "API:",
      `${API_URL}/api/auth/login`
    );


    try {

      // ==========================================
      // LOGIN
      // ==========================================

      const response =
        await axios.post(
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


      // ==========================================
      // GET LOGIN DATA
      // ==========================================

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
      // SAVE LOGIN DATA
      // ==========================================

      localStorage.setItem(
        "token",
        token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      console.log(
        "LOGIN SUCCESS"
      );

      console.log(
        "USER:",
        user
      );


      // ==========================================
      // USER ROLE
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


      // ==========================================
      // INVALID LOGIN
      // ==========================================

      if (
        error.response?.status === 401
      ) {

        setError(
          error.response?.data?.message ||
          "Invalid email or password."
        );

        return;

      }


      // ==========================================
      // SERVER ERROR
      // ==========================================

      if (
        error.response?.status >= 500
      ) {

        setError(
          "Server error. Please try again."
        );

        return;

      }


      // ==========================================
      // NETWORK ERROR
      // ==========================================

      if (
        !error.response
      ) {

        setError(
          "Unable to connect to the server. Please try again."
        );

        return;

      }


      // ==========================================
      // OTHER ERROR
      // ==========================================

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

    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        background:
          "linear-gradient(135deg, #e8f5e9, #f1f8e9)",

        padding: "20px",
      }}
    >

      <div
        style={{
          width: "100%",

          maxWidth: "420px",

          background: "#ffffff",

          padding: "35px",

          borderRadius: "15px",

          boxShadow:
            "0 5px 25px rgba(0,0,0,0.12)",
        }}
      >

        {/* ========================================
            TITLE
        ======================================== */}

        <h1
          style={{
            textAlign: "center",

            color: "#2e7d32",

            marginBottom: "10px",
          }}
        >
          HARI FARMS
        </h1>


        <h2
          style={{
            textAlign: "center",

            marginBottom: "25px",

            color: "#333",
          }}
        >
          Login
        </h2>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (

          <div
            style={{
              background: "#ffebee",

              color: "#c62828",

              padding: "12px",

              borderRadius: "8px",

              marginBottom: "20px",

              textAlign: "center",

              fontSize: "14px",
            }}
          >

            {error}

          </div>

        )}


        {/* ========================================
            FORM
        ======================================== */}

        <form
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div
            style={{
              marginBottom: "18px",
            }}
          >

            <label
              style={{
                display: "block",

                marginBottom: "7px",

                fontWeight: "600",

                color: "#333",
              }}
            >
              Email
            </label>


            <input
              type="email"

              name="email"

              value={
                formData.email
              }

              onChange={
                handleChange
              }

              placeholder="Enter your email"

              autoComplete="email"

              disabled={loading}

              required

              style={{
                width: "100%",

                boxSizing: "border-box",

                padding: "12px",

                border:
                  "1px solid #ccc",

                borderRadius: "8px",

                fontSize: "16px",

                outline: "none",
              }}
            />

          </div>


          {/* PASSWORD */}

          <div
            style={{
              marginBottom: "22px",
            }}
          >

            <label
              style={{
                display: "block",

                marginBottom: "7px",

                fontWeight: "600",

                color: "#333",
              }}
            >
              Password
            </label>


            <input
              type="password"

              name="password"

              value={
                formData.password
              }

              onChange={
                handleChange
              }

              placeholder="Enter your password"

              autoComplete="current-password"

              disabled={loading}

              required

              style={{
                width: "100%",

                boxSizing: "border-box",

                padding: "12px",

                border:
                  "1px solid #ccc",

                borderRadius: "8px",

                fontSize: "16px",

                outline: "none",
              }}
            />

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"

            disabled={loading}

            style={{
              width: "100%",

              padding: "13px",

              border: "none",

              borderRadius: "8px",

              background:
                loading
                  ? "#81c784"
                  : "#2e7d32",

              color: "#ffffff",

              fontSize: "17px",

              fontWeight: "600",

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


        {/* ========================================
            REGISTER
        ======================================== */}

        <p
          style={{
            textAlign: "center",

            marginTop: "25px",

            color: "#555",
          }}
        >

          Don't have an account?{" "}

          <Link
            to="/register"

            style={{
              color: "#2e7d32",

              fontWeight: "600",

              textDecoration:
                "none",
            }}
          >
            Register
          </Link>

        </p>

      </div>

    </div>

  );

}


export default Login;