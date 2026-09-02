import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  useParams,
  Link,
  useNavigate,
} from "react-router-dom";

function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // GET PRODUCT
  // ==========================================

  useEffect(() => {

    const getProduct = async () => {

      try {

        console.log(
          "Getting product:",
          id
        );

        const response =
          await axios.get(
            `${API_URL}/api/products/${id}`
          );

        if (response.data.success) {

          setProduct(
            response.data.product
          );

        } else {

          setError(
            response.data.message ||
            "Product not found"
          );

        }

      } catch (error) {

        console.error(
          "GET PRODUCT ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load product"
        );

      } finally {

        setLoading(false);

      }

    };

    getProduct();

  }, [id]);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async () => {

    try {

      setAdding(true);

      const user =
        JSON.parse(
          localStorage.getItem("user")
        );

      if (!user || !user.id) {

        alert("Please login first.");

        navigate("/login");

        return;
      }

      if (!product) {

        alert("Product not found.");

        return;
      }

      const response =
        await axios.post(
          `${API_URL}/api/cart`,
          {
            userId: user.id,
            productId: product.id,
            quantity: 1,
          }
        );

      console.log(
        "ADD CART RESPONSE:",
        response.data
      );

      if (response.data.success) {

        alert(
          "Product added to cart successfully!"
        );

        navigate("/cart");

      } else {

        alert(
          response.data.message ||
          "Failed to add product"
        );

      }

    } catch (error) {

      console.error(
        "ADD TO CART ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to add product to cart"
      );

    } finally {

      setAdding(false);

    }

  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div style={styles.center}>
        <h2>Loading product...</h2>
      </div>
    );

  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !product) {

    return (
      <div style={styles.center}>

        <h2>
          {error || "Product not found"}
        </h2>

        <Link to="/products">
          ← Back to Products
        </Link>

      </div>
    );

  }

  return (
    <div style={styles.container}>

      <div style={styles.product}>

        <div style={styles.imageContainer}>

          {product.image ? (

            <img
              src={product.image}
              alt={product.name}
              style={styles.productImage}
            />

          ) : (

            <span style={styles.emoji}>
              {product.emoji || "🥛"}
            </span>

          )}

        </div>

        <div style={styles.details}>

          <h1>
            {product.name}
          </h1>

          <h2 style={styles.price}>
            ₹{Number(product.price).toFixed(2)}
          </h2>

          <p>
            <strong>Unit:</strong>{" "}
            {product.unit || "N/A"}
          </p>

          <p>
            {product.description ||
              "Fresh dairy product."}
          </p>

          <p>
            <strong>Stock:</strong>{" "}
            {product.stock ?? 0}
          </p>

          <button
            onClick={addToCart}
            disabled={
              adding ||
              Number(product.stock) <= 0
            }
            style={styles.button}
          >
            {adding
              ? "Adding..."
              : Number(product.stock) <= 0
              ? "Out of Stock"
              : "🛒 Add to Cart"}
          </button>

          <Link
            to="/products"
            style={styles.link}
          >
            ← Back to Products
          </Link>

        </div>

      </div>

    </div>
  );
}

const styles = {

  container: {
    minHeight: "100vh",
    padding: "60px",
    background: "#f5faf5",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  product: {
    maxWidth: "900px",
    margin: "auto",
    display: "flex",
    gap: "60px",
    alignItems: "center",
    padding: "40px",
    background: "white",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.1)",
    borderRadius: "15px",
    flexWrap: "wrap",
  },

  imageContainer: {
    width: "300px",
    height: "300px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  productImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
    borderRadius: "15px",
  },

  emoji: {
    fontSize: "150px",
  },

  details: {
    flex: 1,
    minWidth: "280px",
  },

  price: {
    color: "#2e7d32",
  },

  button: {
    padding: "13px 25px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },

  link: {
    display: "inline-block",
    marginLeft: "20px",
    color: "#2e7d32",
    textDecoration: "none",
  },
};

export default ProductDetails;