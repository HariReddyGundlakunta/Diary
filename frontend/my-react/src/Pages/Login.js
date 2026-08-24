import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email || !formData.password) {
      setError("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        formData
      );

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      navigate("/");
    } catch (error) {
      console.error(error);

      if (error.response) {
        setError(
          error.response.data.message ||
            "Invalid email or password"
        );
      } else {
        setError("Cannot connect to backend");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2>🥛 Welcome Back</h2>

        {error && (
          <p style={styles.error}>{error}</p>
        )}

        <form onSubmit={handleSubmit}>

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

          <button
            type="submit"
            style={styles.button}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/register">
            Register
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
    margin: "10px 0",
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

export default Login;