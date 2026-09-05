import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";


// ==================================================
// API URL
// ==================================================

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://diary-88q0.onrender.com";


// ==================================================
// PRODUCTS
// ==================================================

function Products() {

  const navigate =
    useNavigate();


  // ==================================================
  // STATES
  // ==================================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");


  // ==================================================
  // PRODUCT IMAGES
  // ==================================================

  const productImages = useMemo(
    () => ({

      milk:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",

      cowmilk:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

      curd:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",

      yogurt:
        "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",

      butter:
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",

      cheese:
        "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&w=800&q=80",

      paneer:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",

      ghee:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",

    }),
    []
  );


  // ==================================================
  // GET TOKEN
  // ==================================================

  const getToken = () => {

    return (
      localStorage.getItem("token") ||
      ""
    );

  };


  // ==================================================
  // GET IMAGE
  // ==================================================

  const getProductImage =
    useCallback(
      (product) => {

        // ----------------------------------------------
        // DATABASE IMAGE
        // ----------------------------------------------

        if (
          product.image &&
          product.image.trim() !== ""
        ) {

          // Full URL

          if (
            product.image.startsWith("http://") ||
            product.image.startsWith("https://")
          ) {

            return product.image;

          }


          // Uploaded backend image

          return `${API_URL}/uploads/${product.image}`;

        }


        // ----------------------------------------------
        // DEFAULT IMAGE BASED ON PRODUCT NAME
        // ----------------------------------------------

        const name =
          product.name
            .toLowerCase()
            .replace(/\s/g, "");


        if (name.includes("milk")) {
          return productImages.milk;
        }

        if (name.includes("curd")) {
          return productImages.curd;
        }

        if (name.includes("yogurt")) {
          return productImages.yogurt;
        }

        if (name.includes("butter")) {
          return productImages.butter;
        }

        if (name.includes("cheese")) {
          return productImages.cheese;
        }

        if (name.includes("paneer")) {
          return productImages.paneer;
        }

        if (name.includes("ghee")) {
          return productImages.ghee;
        }


        // Default dairy image

        return productImages.milk;

      },
      [
        productImages,
      ]
    );


  // ==================================================
  // FETCH PRODUCTS
  // ==================================================

  const fetchProducts =
    useCallback(
      async () => {

        try {

          setLoading(true);

          setError("");


          const response =
            await axios.get(
              `${API_URL}/api/products`
            );


          setProducts(
            Array.isArray(response.data)
              ? response.data
              : []
          );


        } catch (error) {

          console.error(
            "FETCH PRODUCTS ERROR:",
            error
          );


          setError(
            "Failed to load products"
          );


        } finally {

          setLoading(false);

        }

      },
      []
    );


  // ==================================================
  // LOAD PRODUCTS
  // ==================================================

  useEffect(
    () => {

      fetchProducts();

    },
    [
      fetchProducts,
    ]
  );


  // ==================================================
  // ADD TO CART
  // ==================================================

  const handleAddToCart =
    async (product) => {

      try {

        setMessage("");

        setError("");


        const token =
          getToken();


        // ----------------------------------------------
        // CHECK LOGIN
        // ----------------------------------------------

        if (!token) {

          alert(
            "Please login before adding products to cart"
          );

          navigate("/login");

          return;

        }


        // ----------------------------------------------
        // ADD TO CART
        // ----------------------------------------------

        const response =
          await axios.post(

            `${API_URL}/api/cart`,

            {
              productId:
                product.id,

              quantity:
                1,
            },

            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }

          );


        console.log(
          "ADD CART RESPONSE:",
          response.data
        );


        setMessage(
          `${product.name} added to cart successfully!`
        );


        setTimeout(
          () => {

            setMessage("");

          },
          3000
        );


      } catch (error) {

        console.error(
          "ADD TO CART ERROR:",
          error
        );


        console.error(
          "SERVER RESPONSE:",
          error.response?.data
        );


        // ----------------------------------------------
        // TOKEN EXPIRED
        // ----------------------------------------------

        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem("token");

          localStorage.removeItem("user");


          alert(
            "Your login session has expired. Please login again."
          );


          navigate("/login");

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to add product to cart"

        );

      }

    };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );


      navigate("/login");

    };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div style={styles.loading}>

        Loading products...

      </div>

    );

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div style={styles.page}>


      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}

      <nav style={styles.navbar}>


        <Link
          to="/home"
          style={styles.logo}
        >

          🥛 HARI FARMS

        </Link>


        <div style={styles.navLinks}>


          <Link
            to="/home"
            style={styles.navLink}
          >

            Home

          </Link>


          <Link
            to="/products"
            style={styles.navLink}
          >

            Products

          </Link>


          <Link
            to="/cart"
            style={styles.navLink}
          >

            🛒 Cart

          </Link>


          <Link
            to="/my-orders"
            style={styles.navLink}
          >

            📦 My Orders

          </Link>


          <button
            onClick={handleLogout}
            style={styles.logout}
          >

            Logout

          </button>


        </div>

      </nav>


      {/* ============================================ */}
      {/* MAIN */}
      {/* ============================================ */}

      <main style={styles.main}>


        <div style={styles.header}>


          <h1>

            🥛 Our Fresh Products

          </h1>


          <p>

            Fresh dairy products directly from HARI FARMS

          </p>


        </div>


        {/* MESSAGE */}

        {message && (

          <div style={styles.success}>

            {message}

          </div>

        )}


        {/* ERROR */}

        {error && (

          <div style={styles.error}>

            {error}

          </div>

        )}


        {/* ============================================ */}
        {/* PRODUCTS */}
        {/* ============================================ */}

        {products.length === 0 ? (

          <div style={styles.empty}>

            No products available.

          </div>

        ) : (

          <div style={styles.grid}>


            {products.map(
              (product) => (

                <div
                  key={product.id}
                  style={styles.card}
                >


                  {/* IMAGE */}

                  <div
                    style={styles.imageContainer}
                  >

                    <img
                      src={
                        getProductImage(product)
                      }

                      alt={
                        product.name
                      }

                      style={styles.image}

                      onError={(event) => {

                        event.currentTarget.src =
                          productImages.milk;

                      }}

                    />

                  </div>


                  {/* CONTENT */}

                  <div style={styles.content}>


                    <div style={styles.titleRow}>


                      <h2 style={styles.productName}>

                        {product.emoji}{" "}

                        {product.name}

                      </h2>


                    </div>


                    <p style={styles.description}>

                      {product.description ||
                        "Fresh dairy product from HARI FARMS"}

                    </p>


                    <div style={styles.details}>


                      <span style={styles.price}>

                        ₹{product.price}

                      </span>


                      {product.unit && (

                        <span style={styles.unit}>

                          / {product.unit}

                        </span>

                      )}


                    </div>


                    <p style={styles.stock}>


                      Available Stock:{" "}

                      {product.stock ?? 0}


                    </p>


                    <button

                      onClick={() =>
                        handleAddToCart(product)
                      }

                      style={styles.cartButton}

                    >

                      🛒 Add to Cart

                    </button>


                  </div>

                </div>

              )
            )}


          </div>

        )}

      </main>


      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}

      <footer style={styles.footer}>

        <h3>

          🥛 HARI FARMS

        </h3>


        <p>

          Fresh From Farm • Pure For Family

        </p>


        <small>

          © 2026 HARI FARMS

        </small>

      </footer>

    </div>

  );

}


// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {
    minHeight: "100vh",
    background: "#f5faf5",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
  },


  navbar: {
    background: "#2e7d32",
    padding: "18px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },


  logo: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "800",
    fontSize: "22px",
  },


  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },


  navLink: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "600",
  },


  logout: {
    background: "#e53935",
    border: "none",
    color: "#fff",
    padding: "9px 18px",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "700",
  },


  main: {
    maxWidth: "1200px",
    margin: "auto",
    padding: "40px 20px 70px",
  },


  header: {
    textAlign: "center",
    marginBottom: "35px",
  },


  success: {
    background: "#dff5e1",
    color: "#1b5e20",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
    fontWeight: "600",
  },


  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    textAlign: "center",
  },


  grid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px",
  },


  card: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.10)",
  },


  imageContainer: {
    width: "100%",
    height: "210px",
    overflow: "hidden",
  },


  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },


  content: {
    padding: "20px",
  },


  titleRow: {
    minHeight: "55px",
  },


  productName: {
    margin: 0,
    color: "#205b26",
    fontSize: "21px",
  },


  description: {
    color: "#666",
    minHeight: "45px",
  },


  details: {
    marginTop: "15px",
  },


  price: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#2e7d32",
  },


  unit: {
    color: "#777",
    marginLeft: "5px",
  },


  stock: {
    color: "#666",
    fontSize: "14px",
  },


  cartButton: {
    width: "100%",
    border: "none",
    background: "#2e7d32",
    color: "#fff",
    padding: "13px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },


  empty: {
    textAlign: "center",
    padding: "60px",
    background: "#fff",
    borderRadius: "15px",
  },


  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "22px",
  },


  footer: {
    background: "#173d1b",
    color: "#fff",
    textAlign: "center",
    padding: "35px",
  },

};


export default Products;