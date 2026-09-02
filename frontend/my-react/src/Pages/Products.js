import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Products() {

  const navigate = useNavigate();

  const API_URL = "http://localhost:5000";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // GET PRODUCTS FROM MYSQL
  // ==========================================

  useEffect(() => {

    const getProducts = async () => {

      try {

        console.log("=================================");
        console.log("GETTING PRODUCTS FROM MYSQL");

        const response = await axios.get(
          `${API_URL}/api/products`
        );

        console.log(
          "PRODUCT RESPONSE:",
          response.data
        );

        if (response.data.success) {

          setProducts(
            response.data.products || []
          );

        } else {

          setError(
            response.data.message ||
            "Failed to load products"
          );
        }

      } catch (error) {

        console.error(
          "❌ GET PRODUCTS ERROR:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to connect to server"
        );

      } finally {

        setLoading(false);
      }
    };

    getProducts();

  }, []);


  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (product) => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user || !user.id) {

        alert("Please login first.");

        navigate("/login");

        return;
      }

      console.log("=================================");
      console.log("ADDING PRODUCT TO CART");
      console.log("User:", user.id);
      console.log("Product:", product.id);


      const response = await axios.post(
        `${API_URL}/api/cart`,
        {
          userId: user.id,
          productId: product.id,
          quantity: 1,
        }
      );


      if (response.data.success) {

        setMessage(
          `${product.name} added to cart!`
        );

        setTimeout(() => {
          setMessage("");
        }, 2000);

      } else {

        alert(
          response.data.message ||
          "Failed to add product"
        );
      }

    } catch (error) {

      console.error(
        "❌ ADD TO CART ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to add product to cart"
      );
    }
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <div style={styles.center}>
        <h2>Loading products...</h2>
      </div>
    );
  }


  // ==========================================
  // ERROR
  // ==========================================

  if (error) {

    return (
      <div style={styles.center}>

        <h2>❌ {error}</h2>

        <button
          onClick={() => window.location.reload()}
          style={styles.retry}
        >
          Retry
        </button>

      </div>
    );
  }


  // ==========================================
  // PRODUCTS PAGE
  // ==========================================

  return (
    <div style={styles.container}>

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <h1>🥛 Dairy Products</h1>

          <p>
            Fresh products directly from our farm
          </p>
        </div>

        <div>

          <Link
            to="/dashboard"
            style={styles.dashboard}
          >
            Dashboard
          </Link>

          <Link
            to="/cart"
            style={styles.cart}
          >
            🛒 Cart
          </Link>

        </div>

      </div>


      {/* SUCCESS MESSAGE */}

      {message && (
        <div style={styles.message}>
          ✅ {message}
        </div>
      )}


      {/* PRODUCTS */}

      {products.length === 0 ? (

        <div style={styles.empty}>

          <h2>
            No products available
          </h2>

          <p>
            Products will appear here once they
            are available in the database.
          </p>

        </div>

      ) : (

        <div style={styles.grid}>

          {products.map((product) => (

            <div
              key={product.id}
              style={styles.card}
            >

              {/* IMAGE / EMOJI */}

              <div style={styles.emoji}>

                {product.image ? (

                  <img
                    src={product.image}
                    alt={product.name}
                    style={styles.productImage}
                  />

                ) : (

                  product.emoji || "🥛"

                )}

              </div>


              <h2>
                {product.name}
              </h2>


              <p style={styles.unit}>
                {product.unit}
              </p>


              <p style={styles.description}>
                {product.description}
              </p>


              <h3 style={styles.price}>
                ₹
                {Number(product.price).toFixed(2)}
              </h3>


              <p>
                Stock:{" "}
                <strong>
                  {product.stock}
                </strong>
              </p>


              <div style={styles.buttons}>

                <Link
                  to={`/products/${product.id}`}
                  style={styles.view}
                >
                  View Details
                </Link>


                <button
                  onClick={() =>
                    addToCart(product)
                  }
                  disabled={
                    Number(product.stock) <= 0
                  }
                  style={{
                    ...styles.button,
                    opacity:
                      Number(product.stock) <= 0
                        ? 0.5
                        : 1,
                  }}
                >

                  {Number(product.stock) <= 0
                    ? "Out of Stock"
                    : "🛒 Add to Cart"}

                </button>

              </div>

            </div>

          ))}

        </div>

      )}


      <button
        onClick={() =>
          navigate("/dashboard")
        }
        style={styles.back}
      >
        ← Back to Dashboard
      </button>

    </div>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles = {

  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f6fbf7",
    boxSizing: "border-box",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "20px",
  },

  dashboard: {
    background: "#2e7d32",
    color: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
    marginRight: "10px",
  },

  cart: {
    background: "#f57c00",
    color: "white",
    padding: "12px 16px",
    borderRadius: "8px",
    textDecoration: "none",
  },

  message: {
    background: "#dff7e5",
    color: "#1b5e20",
    padding: "15px",
    marginTop: "20px",
    borderRadius: "10px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "25px",
    marginTop: "30px",
  },

  card: {
    background: "white",
    padding: "25px",
    borderRadius: "18px",
    textAlign: "center",
    boxShadow:
      "0 5px 20px rgba(0,0,0,0.08)",
  },

  emoji: {
    height: "130px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "75px",
  },

  productImage: {
    maxWidth: "120px",
    maxHeight: "120px",
    objectFit: "contain",
  },

  unit: {
    color: "#777",
    fontWeight: "bold",
  },

  description: {
    color: "#666",
    minHeight: "45px",
  },

  price: {
    color: "#2e7d32",
    fontSize: "22px",
  },

  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  view: {
    padding: "10px",
    borderRadius: "8px",
    background: "#eeeeee",
    color: "#333",
    textDecoration: "none",
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  empty: {
    marginTop: "40px",
    background: "white",
    padding: "50px",
    textAlign: "center",
    borderRadius: "15px",
  },

  retry: {
    padding: "12px 25px",
    background: "#2e7d32",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  back: {
    marginTop: "30px",
    padding: "12px 20px",
    border: "none",
    background: "#555",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Products;