import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProducts() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    unit: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (
      !product.name ||
      !product.price ||
      !product.category ||
      !product.unit
    ) {
      setError("Please fill all required fields");
      return;
    }

    const products =
      JSON.parse(
        localStorage.getItem("products")
      ) || [];

    const newProduct = {
      id: Date.now(),
      name: product.name,
      price: Number(product.price),
      category: product.category,
      unit: product.unit,
      description: product.description,
      emoji: "🥛",
    };

    localStorage.setItem(
      "products",
      JSON.stringify([
        ...products,
        newProduct,
      ])
    );

    alert("Product added successfully!");

    navigate("/admin");
  };

  return (
    <div style={styles.container}>

      <div style={styles.card}>

        <h1>➕ Add Product</h1>

        <p>
          Add a new milk or dairy product
        </p>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>Product Name</label>

          <input
            type="text"
            name="name"
            placeholder="Fresh Cow Milk"
            value={product.name}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Price</label>

          <input
            type="number"
            name="price"
            placeholder="60"
            value={product.price}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Category</label>

          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">
              Select Category
            </option>

            <option value="Milk">
              Milk
            </option>

            <option value="Curd">
              Curd
            </option>

            <option value="Paneer">
              Paneer
            </option>

            <option value="Butter">
              Butter
            </option>

            <option value="Ghee">
              Ghee
            </option>

            <option value="Cheese">
              Cheese
            </option>
          </select>

          <label>Unit</label>

          <input
            type="text"
            name="unit"
            placeholder="1 Liter"
            value={product.unit}
            onChange={handleChange}
            style={styles.input}
          />

          <label>Description</label>

          <textarea
            name="description"
            placeholder="Enter product description"
            value={product.description}
            onChange={handleChange}
            style={styles.textarea}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Add Product
          </button>

        </form>

      </div>

    </div>
  );
}

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    backgroundColor: "#f1f8e9",
  },

  card: {
    width: "500px",
    padding: "35px",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.1)",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "18px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "7px",
  },

  textarea: {
    width: "100%",
    height: "100px",
    padding: "12px",
    marginTop: "7px",
    marginBottom: "18px",
    boxSizing: "border-box",
    border: "1px solid #ccc",
    borderRadius: "7px",
  },

  button: {
    width: "100%",
    padding: "13px",
    backgroundColor: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontSize: "16px",
    cursor: "pointer",
  },

  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "7px",
    marginBottom: "15px",
  },
};

export default AddProducts;