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


function Products() {

  const navigate = useNavigate();


  // ==========================================
  // API URL
  // ==========================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ==========================================
  // STATES
  // ==========================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cartLoading, setCartLoading] =
    useState(null);

  const [user, setUser] =
    useState(null);


  // ==========================================
  // GET LOGGED-IN USER
  // ==========================================

  useEffect(() => {

    const userData =
      localStorage.getItem("user");


    if (userData) {

      try {

        const parsedUser =
          JSON.parse(userData);

        setUser(parsedUser);

      } catch (error) {

        console.error(
          "USER PARSE ERROR:",
          error
        );

      }

    }

  }, []);


  // ==========================================
  // CHECK ADMIN
  // ==========================================

  const isAdmin =
    user?.role === "admin";


  // ==========================================
  // FIX PRODUCT IMAGE URL
  // ==========================================

  const getImageUrl = useCallback(
    (image) => {

      // No image available

      if (!image) {

        return null;

      }


      const imageUrl =
        String(image).trim();


      // Empty image

      if (!imageUrl) {

        return null;

      }


      // Base64 image

      if (
        imageUrl.startsWith("data:image/")
      ) {

        return imageUrl;

      }


      // Full URL

      if (
        imageUrl.startsWith("http://") ||
        imageUrl.startsWith("https://")
      ) {

        return imageUrl;

      }


      // /uploads/image.jpg

      if (
        imageUrl.startsWith("/uploads/")
      ) {

        return `${API_URL}${imageUrl}`;

      }


      // uploads/image.jpg

      if (
        imageUrl.startsWith("uploads/")
      ) {

        return `${API_URL}/${imageUrl}`;

      }


      // /images/image.jpg

      if (
        imageUrl.startsWith("/images/")
      ) {

        return imageUrl;

      }


      // images/image.jpg

      if (
        imageUrl.startsWith("images/")
      ) {

        return `/${imageUrl}`;

      }


      // Only filename
      // Example: milk.jpg

      return `${API_URL}/uploads/${imageUrl}`;

    },
    [API_URL]
  );


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

  const fetchProducts = useCallback(
    async () => {

      try {

        setLoading(true);

        setError("");


        console.log(
          "Fetching products from:",
          `${API_URL}/api/products`
        );


        const response =
          await axios.get(
            `${API_URL}/api/products`
          );


        console.log(
          "PRODUCTS:",
          response.data
        );


        if (
          Array.isArray(response.data)
        ) {

          setProducts(
            response.data
          );

        } else {

          setProducts([]);

        }


      } catch (error) {

        console.error(
          "PRODUCT ERROR:",
          error
        );


        setError(
          error.response?.data?.message ||
          "Failed to load products"
        );


      } finally {

        setLoading(false);

      }

    },
    [API_URL]
  );


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  useEffect(() => {

    fetchProducts();

  }, [fetchProducts]);


  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart =
    async (productId) => {

      try {

        const token =
          localStorage.getItem("token");

        const userData =
          localStorage.getItem("user");


        if (!token || !userData) {

          alert(
            "Please login first."
          );

          navigate("/login");

          return;

        }


        const currentUser =
          JSON.parse(userData);


        setCartLoading(productId);


        await axios.post(

          `${API_URL}/api/cart`,

          {
            userId: currentUser.id,
            productId: productId,
            quantity: 1,
          },

          {
            headers: {

              Authorization:
                `Bearer ${token}`,

            },
          }

        );


        alert(
          "Product added to cart successfully!"
        );


      } catch (error) {

        console.error(
          "CART ERROR:",
          error
        );


        alert(
          error.response?.data?.message ||
          "Failed to add product"
        );


      } finally {

        setCartLoading(null);

      }

    };


  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (loading) {

    return (

      <div style={styles.loading}>

        Loading products...

      </div>

    );

  }


  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error) {

    return (

      <div style={styles.loading}>

        <div>

          <h2>
            Unable to load products
          </h2>

          <p>
            {error}
          </p>

          <button
            onClick={fetchProducts}
          >

            Try Again

          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // MAIN UI
  // ==========================================

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


          {!isAdmin && (

            <Link
              to="/cart"
              style={styles.navLink}
            >

              Cart 🛒

            </Link>

          )}


          {isAdmin && (

            <Link
              to="/admin/dashboard"
              style={styles.adminLink}
            >

              👑 Admin Dashboard

            </Link>

          )}


        </div>

      </nav>


      {/* HEADER */}

      <section style={styles.header}>

        <h1>
          🥛 Our Dairy Products
        </h1>

        <p>
          Fresh and healthy products
          directly from HARI FARMS
        </p>


        {isAdmin && (

          <p style={styles.adminMode}>

            👑 Admin Mode –
            You can edit products

          </p>

        )}

      </section>


      {/* PRODUCTS */}

      <div style={styles.productsGrid}>


        {products.length === 0 ? (

          <div style={styles.noProducts}>

            <h2>
              No Products Available
            </h2>

          </div>

        ) : (

          products.map(
            (product) => {

              const imageUrl =
                getImageUrl(
                  product.image
                );


              return (

                <div
                  key={product.id}
                  style={styles.productCard}
                >


                  {/* =============================
                      PRODUCT IMAGE
                  ============================== */}

                  <div style={styles.imageContainer}>


                    {imageUrl ? (

                      <img

                        src={imageUrl}

                        alt={product.name}

                        style={styles.productImage}

                        onError={(event) => {

                          console.error(
                            "IMAGE FAILED:",
                            imageUrl
                          );


                          event.currentTarget.style.display =
                            "none";


                          const fallback =
                            event.currentTarget
                              .parentElement
                              .querySelector(
                                ".emoji-fallback"
                              );


                          if (fallback) {

                            fallback.style.display =
                              "flex";

                          }

                        }}

                      />

                    ) : null}


                    {/* EMOJI FALLBACK */}

                    <div

                      className="emoji-fallback"

                      style={{

                        ...styles.emojiFallback,

                        display:
                          imageUrl
                            ? "none"
                            : "flex",

                      }}

                    >

                      {
                        product.emoji ||
                        "🥛"
                      }

                    </div>


                  </div>


                  {/* PRODUCT DETAILS */}

                  <div style={styles.productContent}>


                    <h2 style={styles.productName}>

                      {product.name}

                    </h2>


                    <p style={styles.description}>

                      {
                        product.description ||
                        "Fresh dairy product"
                      }

                    </p>


                    <p style={styles.unit}>

                      📦 {product.unit}

                    </p>


                    <h3 style={styles.price}>

                      ₹{
                        Number(
                          product.price || 0
                        ).toFixed(2)
                      }

                    </h3>


                    <p style={styles.stock}>

                      Stock:

                      <strong>

                        {" "}
                        {product.stock || 0}

                      </strong>

                    </p>


                    {/* ADMIN */}

                    {isAdmin ? (

                      <button

                        onClick={() =>
                          navigate(
                            `/admin/products/edit/${product.id}`
                          )
                        }

                        style={styles.editButton}

                      >

                        ✏️ Edit Product

                      </button>

                    ) : (

                      /* CUSTOMER */

                      <button

                        onClick={() =>
                          addToCart(
                            product.id
                          )
                        }

                        disabled={
                          Number(
                            product.stock
                          ) <= 0 ||

                          cartLoading ===
                            product.id
                        }

                        style={{

                          ...styles.cartButton,

                          background:

                            Number(
                              product.stock
                            ) <= 0

                              ? "#9e9e9e"

                              : "#2e7d32",

                          cursor:

                            Number(
                              product.stock
                            ) <= 0

                              ? "not-allowed"

                              : "pointer",

                        }}

                      >

                        {
                          cartLoading ===
                          product.id

                            ? "Adding..."

                            : Number(
                                product.stock
                              ) <= 0

                            ? "Out of Stock"

                            : "Add to Cart 🛒"
                        }

                      </button>

                    )}


                  </div>

                </div>

              );

            }

          )

        )}


      </div>

    </div>

  );

}


const styles = {


  page: {

    minHeight: "100vh",

    background: "#f5f8f5",

    fontFamily:
      "'Segoe UI', Arial, sans-serif",

  },


  loading: {

    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    textAlign: "center",

    fontSize: "20px",

  },


  navbar: {

    background: "#2e7d32",

    padding: "18px 45px",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

  },


  logo: {

    color: "#ffffff",

    fontSize: "24px",

    fontWeight: "bold",

    textDecoration: "none",

  },


  navLinks: {

    display: "flex",

    alignItems: "center",

    gap: "25px",

  },


  navLink: {

    color: "#ffffff",

    textDecoration: "none",

    fontWeight: "600",

  },


  adminLink: {

    color: "#ffffff",

    textDecoration: "none",

    fontWeight: "bold",

    background: "#1b5e20",

    padding: "10px 16px",

    borderRadius: "20px",

  },


  header: {

    textAlign: "center",

    padding: "50px 20px 30px",

  },


  adminMode: {

    color: "#2e7d32",

    fontWeight: "bold",

  },


  productsGrid: {

    maxWidth: "1200px",

    margin: "0 auto",

    padding: "20px 25px 60px",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",

    gap: "25px",

  },


  productCard: {

    background: "#ffffff",

    borderRadius: "18px",

    overflow: "hidden",

    boxShadow:
      "0 6px 20px rgba(0,0,0,0.10)",

    display: "flex",

    flexDirection: "column",

  },


  imageContainer: {

    height: "220px",

    width: "100%",

    background: "#eaf5ea",

    position: "relative",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",

  },


  productImage: {

    width: "100%",

    height: "100%",

    objectFit: "cover",

  },


  emojiFallback: {

    width: "100%",

    height: "100%",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "90px",

  },


  productContent: {

    padding: "20px",

    display: "flex",

    flexDirection: "column",

    flexGrow: 1,

  },


  productName: {

    color: "#1b5e20",

    marginTop: "0",

  },


  description: {

    color: "#666",

    lineHeight: "1.6",

    minHeight: "50px",

  },


  unit: {

    color: "#555",

  },


  price: {

    color: "#2e7d32",

    fontSize: "22px",

  },


  stock: {

    color: "#444",

  },


  editButton: {

    width: "100%",

    padding: "13px",

    border: "none",

    borderRadius: "8px",

    background: "#1565c0",

    color: "#ffffff",

    fontSize: "16px",

    fontWeight: "bold",

    cursor: "pointer",

    marginTop: "auto",

  },


  cartButton: {

    width: "100%",

    padding: "13px",

    border: "none",

    borderRadius: "8px",

    color: "#ffffff",

    fontSize: "16px",

    fontWeight: "bold",

    marginTop: "auto",

  },


  noProducts: {

    gridColumn: "1 / -1",

    textAlign: "center",

    padding: "50px",

  },

};


export default Products;
