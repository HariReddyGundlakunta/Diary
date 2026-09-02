import React, { useState } from "react";
import axios from "axios";
import {
  useNavigate,
} from "react-router-dom";


function AddProduct() {

  const navigate =
    useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  const [formData, setFormData] =
    useState({
      name: "",
      price: "",
      unit: "",
      description: "",
      emoji: "🥛",
      image: "",
      stock: "",
    });


  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );
    };


  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(true);
      setError("");


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        await axios.post(
          `${API_URL}/api/products`,
          {
            name:
              formData.name,
            price:
              Number(
                formData.price
              ),
            unit:
              formData.unit,
            description:
              formData.description,
            emoji:
              formData.emoji,
            image:
              formData.image,
            stock:
              Number(
                formData.stock
              ) || 0,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        alert(
          "Product added successfully!"
        );


        navigate(
          "/products"
        );

      } catch (error) {

        console.error(
          "ADD PRODUCT ERROR:",
          error
        );

        setError(
          error.response?.data
            ?.message ||
          "Failed to add product."
        );

      } finally {

        setLoading(false);
      }
    };


  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1>
          ➕ Add Product
        </h1>


        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}


        <form
          onSubmit={
            handleSubmit
          }
        >

          <input
            name="name"
            placeholder="Product Name"
            value={
              formData.name
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
            name="price"
            type="number"
            placeholder="Price"
            value={
              formData.price
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
            name="unit"
            placeholder="Unit (Example: 1 Liter)"
            value={
              formData.unit
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
          />


          <textarea
            name="description"
            placeholder="Product Description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
          />


          <select
            name="emoji"
            value={
              formData.emoji
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
          >
            <option value="🥛">
              🥛 Milk
            </option>

            <option value="🥣">
              🥣 Curd
            </option>

            <option value="🧀">
              🧀 Paneer
            </option>

            <option value="🧈">
              🧈 Butter
            </option>

            <option value="🫙">
              🫙 Ghee
            </option>
          </select>


          <input
            name="image"
            placeholder="Image URL (optional)"
            value={
              formData.image
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
          />


          <input
            name="stock"
            type="number"
            placeholder="Stock"
            value={
              formData.stock
            }
            onChange={
              handleChange
            }
            style={
              styles.input
            }
          />


          <button
            type="submit"
            disabled={loading}
            style={
              styles.button
            }
          >

            {loading
              ? "Adding..."
              : "Add Product"}

          </button>

        </form>

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
    background: "#f5faf5",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    padding: "35px",
    borderRadius: "20px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
};


export default AddProduct;