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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all fields");
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Registration failed"
        );
      } else {
        setError("Cannot connect to backend");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2>🥛 Create Account</h2>

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Register
          </button>

        </form>

        <p>
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
    minHeight: "90vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f8e9",
  },

  card: {
    width: "380px",
    padding: "35px",
    background: "white",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "12px",
    margin: "8px 0",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "7px",
  },

  button: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    border: "none",
    borderRadius: "7px",
    background: "#2e7d32",
    color: "white",
    fontSize: "16px",
  },

  error: {
    color: "#c62828",
  },
};

export default Register;