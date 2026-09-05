import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router-dom";


// ==================================================
// PRODUCT FALLBACK IMAGES
// ==================================================

const productImages = {

  "fresh cow milk":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

  "buffalo milk":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

  "a2 cow milk":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

  "fresh curd":
    "https://images.unsplash.com/photo-1571212515416-fca3251f4f2d?auto=format&fit=crop&w=800&q=80",

  "buttermilk":
    "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80",

  "paneer":
    "https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?auto=format&fit=crop&w=800&q=80",

  "fresh cheese":
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",

  "butter":
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",

  "pure cow ghee":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",

  "buffalo ghee":
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",

  "fresh cream":
    "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",

  "flavored milk":
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

  "mango lassi":
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",

  "sweet lassi":
    "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=800&q=80",

  "khoa":
    "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?auto=format&fit=crop&w=800&q=80",

  "kulfi":
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",

  "rabri":
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80",

  "milkshake":
    "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",

};


// ==================================================
// COMPONENT
// ==================================================

function Products() {

  const navigate = useNavigate();


  // ==================================================
  // API URL
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ==================================================
  // STATES
  // ==================================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const [addingProductId, setAddingProductId] =
    useState(null);


  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  const getLoggedInUser = () => {

    try {

      const user =
        localStorage.getItem("user");

      if (!user) {
        return null;
      }

      return JSON.parse(user);

    } catch (error) {

      console.error(
        "User parsing error:",
        error
      );

      return null;

    }

  };


  // ==================================================
  // GET TOKEN
  // ==================================================

  const getToken = () => {

    return localStorage.getItem("token");

  };


  // ==================================================
  // FETCH PRODUCTS
  // ==================================================

  const fetchProducts =
    useCallback(async () => {

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
          "GET PRODUCTS ERROR:",
          error
        );

        setError(

          error.response?.data?.message ||
          "Failed to load products"

        );

      } finally {

        setLoading(false);

      }

    }, [API_URL]);


  // ==================================================
  // LOAD PRODUCTS
  // ==================================================

  useEffect(() => {

    fetchProducts();

  }, [fetchProducts]);


  // ==================================================
  // GET PRODUCT IMAGE
  // ==================================================

  const getProductImage =
    (product) => {

      // ----------------------------------------------
      // 1. DATABASE IMAGE
      // ----------------------------------------------

      if (
        product.image &&
        String(product.image).trim() !== ""
      ) {

        const image =
          String(product.image).trim();


        // Full external URL

        if (
          image.startsWith("http://") ||
          image.startsWith("https://")
        ) {

          return image;

        }


        // Uploaded backend image

        if (
          image.startsWith("/")
        ) {

          return `${API_URL}${image}`;

        }


        return `${API_URL}/uploads/${image}`;

      }


      // ----------------------------------------------
      // 2. FALLBACK IMAGE BY PRODUCT NAME
      // ----------------------------------------------

      const productName =
        String(product.name || "")
          .toLowerCase()
          .trim();


      if (
        productImages[productName]
      ) {

        return productImages[productName];

      }


      // ----------------------------------------------
      // 3. GENERIC DAIRY IMAGE
      // ----------------------------------------------

      return "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80";

    };


  // ==================================================
  // ADD TO CART
  // ==================================================

  const handleAddToCart =
    async (product) => {

      try {

        setMessage("");

        setError("");


        // ----------------------------------------------
        // CHECK LOGIN
        // ----------------------------------------------

        const token =
          getToken();

        const user =
          getLoggedInUser();


        if (!token || !user) {

          setError(
            "Please login to add products to your cart."
          );


          setTimeout(() => {

            navigate("/login");

          }, 1200);


          return;

        }


        // ----------------------------------------------
        // LOADING BUTTON
        // ----------------------------------------------

        setAddingProductId(
          product.id
        );


        // ----------------------------------------------
        // ADD PRODUCT TO CART
        // ----------------------------------------------

        const response =
          await axios.post(

            `${API_URL}/api/cart`,

            {
              product_id:
                product.id,

              quantity:
                1,
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
          "ADD TO CART RESPONSE:",
          response.data
        );


        setMessage(
          `${product.name} added to cart successfully! 🛒`
        );


        setTimeout(() => {

          setMessage("");

        }, 2500);


      } catch (error) {

        console.error(
          "ADD TO CART ERROR:",
          error
        );


        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          setError(
            "Your login session expired. Please login again."
          );


          setTimeout(() => {

            navigate("/login");

          }, 1500);


          return;

        }


        setError(

          error.response?.data?.message ||

          "Unable to add product to cart"

        );


      } finally {

        setAddingProductId(
          null
        );

      }

    };


  // ==================================================
  // IMAGE ERROR HANDLER
  // ==================================================

  const handleImageError =
    (event, product) => {

      const fallbackImage =
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80";


      // Prevent infinite image error loop

      if (
        event.currentTarget.src !==
        fallbackImage
      ) {

        event.currentTarget.src =
          fallbackImage;

      }

    };


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div style={styles.loading}>

        Loading products... 🥛

      </div>

    );

  }


  // ==================================================
  // PAGE
  // ==================================================

  return (

    <div style={styles.page}>


      {/* NAVBAR */}

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
            to="/orders"
            style={styles.navLink}
          >
            📦 My Orders
          </Link>


        </div>

      </nav>


      {/* MAIN */}

      <main style={styles.main}>


        {/* HEADER */}

        <div style={styles.header}>


          <div>

            <p style={styles.subtitle}>
              Fresh From Our Farm
            </p>


            <h1 style={styles.title}>
              Our Dairy Products 🥛
            </h1>


            <p style={styles.description}>

              Fresh, healthy and high-quality
              dairy products directly from
              HARI FARMS.

            </p>

          </div>


          <Link
            to="/cart"
            style={styles.cartButton}
          >

            🛒 View Cart

          </Link>


        </div>


        {/* SUCCESS */}

        {message && (

          <div style={styles.success}>

            ✅ {message}

          </div>

        )}


        {/* ERROR */}

        {error && (

          <div style={styles.error}>

            ❌ {error}

          </div>

        )}


        {/* PRODUCTS */}

        {products.length === 0 ? (

          <div style={styles.empty}>

            <h2>
              No Products Available
            </h2>

            <p>
              Products will appear here soon.
            </p>

          </div>

        ) : (

          <div style={styles.productsGrid}>


            {products.map((product) => {

              const imageUrl =
                getProductImage(product);


              return (

                <div
                  key={product.id}
                  style={styles.productCard}
                >


                  {/* PRODUCT IMAGE */}

                  <div
                    style={styles.imageContainer}
                  >

                    <img

                      src={imageUrl}

                      alt={product.name}

                      style={styles.productImage}

                      onError={(event) =>
                        handleImageError(
                          event,
                          product
                        )
                      }

                    />

                  </div>


                  {/* PRODUCT DETAILS */}

                  <div style={styles.cardContent}>


                    <h2
                      style={styles.productName}
                    >

                      {product.name}

                    </h2>


                    <p
                      style={
                        styles.productDescription
                      }
                    >

                      {
                        product.description ||
                        "Fresh dairy product from HARI FARMS."
                      }

                    </p>


                    <div style={styles.productInfo}>


                      <span
                        style={styles.price}
                      >

                        ₹{
                          Number(
                            product.price
                          ).toFixed(2)
                        }

                      </span>


                      <span
                        style={styles.unit}
                      >

                        {product.unit || "Fresh"}

                      </span>


                    </div>


                    <p style={styles.stock}>

                      📦 Stock:{" "}

                      {product.stock ?? 0}

                    </p>


                    <button

                      style={

                        addingProductId === product.id

                          ? {
                              ...styles.addButton,
                              ...styles.disabledButton,
                            }

                          : styles.addButton

                      }

                      disabled={
                        addingProductId === product.id
                      }

                      onClick={() =>
                        handleAddToCart(product)
                      }

                    >

                      {

                        addingProductId === product.id

                          ? "Adding..."

                          : "🛒 Add to Cart"

                      }

                    </button>


                  </div>

                </div>

              );

            })}


          </div>

        )}


      </main>


      {/* FOOTER */}

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
    minHeight: "68px",
    background: "#2e7d32",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    gap: "20px",
    flexWrap: "wrap",
  },


  logo: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: "800",
  },


  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },


  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "600",
  },


  main: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 25px 70px",
  },


  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },


  subtitle: {
    color: "#43a047",
    fontWeight: "700",
    marginBottom: "5px",
  },


  title: {
    fontSize: "38px",
    color: "#205b26",
    margin: "5px 0",
  },


  description: {
    color: "#607066",
    fontSize: "16px",
  },


  cartButton: {
    background: "#2e7d32",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "25px",
    textDecoration: "none",
    fontWeight: "700",
  },


  success: {
    background: "#dff5e1",
    color: "#1b5e20",
    padding: "15px 20px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontWeight: "600",
  },


  error: {
    background: "#ffebee",
    color: "#c62828",
    padding: "15px 20px",
    borderRadius: "12px",
    marginBottom: "25px",
    fontWeight: "600",
  },


  productsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px",
  },


  productCard: {
    background: "#ffffff",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.08)",
  },


  imageContainer: {
    height: "200px",
    background: "#edf7ee",
    overflow: "hidden",
  },


  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    display: "block",
  },


  cardContent: {
    padding: "20px",
  },


  productName: {
    color: "#205b26",
    margin: "0 0 10px",
    fontSize: "21px",
  },


  productDescription: {
    color: "#68756d",
    minHeight: "45px",
    lineHeight: "1.5",
  },


  productInfo: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "15px",
  },


  price: {
    color: "#2e7d32",
    fontSize: "22px",
    fontWeight: "800",
  },


  unit: {
    background: "#edf7ee",
    color: "#2e7d32",
    padding: "5px 10px",
    borderRadius: "12px",
    fontSize: "13px",
  },


  stock: {
    color: "#68756d",
  },


  addButton: {
    width: "100%",
    border: "none",
    background: "#2e7d32",
    color: "#ffffff",
    padding: "13px",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
  },


  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },


  empty: {
    background: "#ffffff",
    textAlign: "center",
    padding: "60px",
    borderRadius: "20px",
  },


  loading: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },


  footer: {
    background: "#173d1b",
    color: "#ffffff",
    textAlign: "center",
    padding: "35px",
  },

};


export default Products;