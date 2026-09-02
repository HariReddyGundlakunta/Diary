import React, {
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";

function AddProduct() {

  const navigate =
    useNavigate();

  // ==================================================
  // API
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  // ==================================================
  // FORM
  // ==================================================

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

  // ==================================================
  // CHANGE
  // ==================================================

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData(
        (previous) => ({
          ...previous,
          [name]:
            value,
        })
      );

    };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        // ------------------------------------------
        // CHECK LOGIN
        // ------------------------------------------

        const token =
          localStorage.getItem(
            "token"
          );

        const userData =
          localStorage.getItem(
            "user"
          );

        if (!token || !userData) {

          alert(
            "Please login first."
          );

          navigate("/login");

          return;

        }

        const user =
          JSON.parse(userData);

        // ------------------------------------------
        // CHECK ADMIN
        // ------------------------------------------

        if (
          String(
            user?.role || ""
          ).toLowerCase() !==
          "admin"
        ) {

          alert(
            "Only admin can add products."
          );

          navigate("/home");

          return;

        }

        // ------------------------------------------
        // VALIDATION
        // ------------------------------------------

        if (
          !formData.name.trim()
        ) {

          alert(
            "Enter product name."
          );

          return;

        }

        if (
          formData.price === ""
        ) {

          alert(
            "Enter product price."
          );

          return;

        }

        // ------------------------------------------
        // API
        // ------------------------------------------

        const response =
          await axios.post(

            `${API_URL}/api/products`,

            {
              name:
                formData.name.trim(),

              price:
                Number(
                  formData.price
                ),

              unit:
                formData.unit,

              description:
                formData.description,

              emoji:
                formData.emoji ||
                "🥛",

              image:
                formData.image,

              stock:
                formData.stock === ""
                  ? 0
                  : Number(
                      formData.stock
                    ),
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }

          );

        console.log(
          "ADD PRODUCT RESPONSE:",
          response.data
        );

        alert(
          "Product added successfully!"
        );

        // ------------------------------------------
        // GO PRODUCTS
        // ------------------------------------------

        navigate(
          "/products"
        );

      } catch (error) {

        console.error(
          "ADD PRODUCT ERROR:",
          error
        );

        alert(
          error.response?.data?.message ||
          "Failed to add product."
        );

      } finally {

        setLoading(false);

      }

    };

  // ==================================================
  // UI
  // ==================================================

  return (

    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#f5f7f5",
        paddingBottom:
          "50px",
      }}
    >

      {/* NAVBAR */}

      <nav
        style={{
          background:
            "#ffffff",
          padding:
            "18px 40px",
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          boxShadow:
            "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >

        <Link
          to="/admin-dashboard"
          style={{
            textDecoration:
              "none",
            fontSize:
              "24px",
            fontWeight:
              "bold",
            color:
              "#2e7d32",
          }}
        >
          HARI FARMS
        </Link>

        <div
          style={{
            display:
              "flex",
            gap:
              "20px",
          }}
        >

          <Link
            to="/admin-dashboard"
            style={{
              textDecoration:
                "none",
              color:
                "#333",
            }}
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            style={{
              textDecoration:
                "none",
              color:
                "#333",
            }}
          >
            Products
          </Link>

        </div>

      </nav>

      {/* FORM */}

      <div
        style={{
          maxWidth:
            "650px",
          margin:
            "40px auto",
          padding:
            "30px",
          background:
            "#ffffff",
          borderRadius:
            "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",
        }}
      >

        <h1>
          Add Product
        </h1>

        <form
          onSubmit={
            handleSubmit
          }
        >

          {/* NAME */}

          <label>
            Product Name
          </label>

          <input
            type="text"
            name="name"
            value={
              formData.name
            }
            onChange={
              handleChange
            }
            placeholder="Enter product name"
            required
            style={inputStyle}
          />

          {/* PRICE */}

          <label>
            Price
          </label>

          <input
            type="number"
            name="price"
            value={
              formData.price
            }
            onChange={
              handleChange
            }
            placeholder="Enter price"
            min="0"
            step="0.01"
            required
            style={inputStyle}
          />

          {/* UNIT */}

          <label>
            Unit
          </label>

          <input
            type="text"
            name="unit"
            value={
              formData.unit
            }
            onChange={
              handleChange
            }
            placeholder="Example: 1 litre"
            style={inputStyle}
          />

          {/* DESCRIPTION */}

          <label>
            Description
          </label>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            placeholder="Product description"
            rows="4"
            style={inputStyle}
          />

          {/* EMOJI */}

          <label>
            Emoji
          </label>

          <input
            type="text"
            name="emoji"
            value={
              formData.emoji
            }
            onChange={
              handleChange
            }
            placeholder="🥛"
            style={inputStyle}
          />

          {/* IMAGE */}

          <label>
            Image URL
          </label>

          <input
            type="text"
            name="image"
            value={
              formData.image
            }
            onChange={
              handleChange
            }
            placeholder="Enter image URL"
            style={inputStyle}
          />

          {/* STOCK */}

          <label>
            Stock
          </label>

          <input
            type="number"
            name="stock"
            value={
              formData.stock
            }
            onChange={
              handleChange
            }
            placeholder="Enter stock quantity"
            min="0"
            style={inputStyle}
          />

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            style={{
              width:
                "100%",
              padding:
                "13px",
              marginTop:
                "20px",
              border:
                "none",
              borderRadius:
                "8px",
              background:
                "#2e7d32",
              color:
                "#ffffff",
              fontSize:
                "16px",
              cursor:
                "pointer",
            }}
          >

            {loading
              ? "Adding Product..."
              : "Add Product"}

          </button>

        </form>

      </div>

    </div>

  );

}

// ==================================================
// INPUT STYLE
// ==================================================

const inputStyle = {

  width:
    "100%",

  padding:
    "12px",

  marginTop:
    "7px",

  marginBottom:
    "18px",

  border:
    "1px solid #ccc",

  borderRadius:
    "7px",

  boxSizing:
    "border-box",

  fontSize:
    "15px",

};

export default AddProduct;