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


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };


  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError(
        "Please fill all fields."
      );

      return;
    }


    if (
      formData.password !==
      formData.confirmPassword
    ) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    if (formData.password.length < 6) {

      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }


    try {

      setLoading(true);


      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }
      );


      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      setSuccess(
        "Registration successful! Redirecting to login..."
      );


      setTimeout(() => {

        navigate("/login");

      }, 1000);


    } catch (error) {

      console.error(
        "REGISTER ERROR:",
        error
      );


      if (
        error.response?.status === 409
      ) {

        setError(
          "Email already exists. Please login."
        );

      } else {

        setError(
          error.response?.data?.message ||
          "Registration failed."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div style={styles.page}>

      <div style={styles.card}>

        <div style={styles.logo}>
          🥛
        </div>

        <h1>
          HARI FARMS
        </h1>

        <h2>
          Create Account
        </h2>

        <p style={styles.subtitle}>
          Join HARI FARMS today
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


        <form onSubmit={handleRegister}>

          <label style={styles.label}>
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />


          <label style={styles.label}>
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />


          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />


          <label style={styles.label}>
            Confirm Password
          </label>

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />


          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >

            {loading
              ? "Creating Account..."
              : "Create Account →"}

          </button>

        </form>


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
  },

  logo: {
    textAlign: "center",
    fontSize: "50px",
  },

  h1: {
    textAlign: "center",
  },

  h2: {
    textAlign: "center",
    color: "#245b29",
    margin: "5px 0",
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
    cursor: "pointer",
  },

  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "11px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "13px",
  },

  success: {
    background: "#e8f5e9",
    color: "#2e7d32",
    padding: "11px",
    borderRadius: "8px",
    textAlign: "center",
    fontSize: "13px",
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