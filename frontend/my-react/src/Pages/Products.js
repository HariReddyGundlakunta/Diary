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

  const navigate =
    useNavigate();

  // ==================================================
  // API URL
  // ==================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";

  // ==================================================
  // STATE
  // ==================================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [cartLoading, setCartLoading] =
    useState(null);

  // ==================================================
  // GET PRODUCTS
  // ==================================================

  const fetchProducts =
    useCallback(async () => {

      try {

        setLoading(true);

        setError("");

        console.log(
          "Fetching products..."
        );

        const response =
          await axios.get(
            `${API_URL}/api/products`
          );

        console.log(
          "Products received:",
          response.data
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
  // ADD TO CART
  // ==================================================

  const addToCart =
    async (productId) => {

      try {

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
            "Please login to add products to cart."
          );

          navigate("/login");

          return;

        }

        let user;

        try {

          user =
            JSON.parse(userData);

        } catch (parseError) {

          console.error(
            "USER DATA ERROR:",
            parseError
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;

        }

        if (!user?.id) {

          alert(
            "User information is missing. Please login again."
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;

        }

        setCartLoading(
          productId
        );

        const response =
          await axios.post(

            `${API_URL}/api/cart`,

            {
              userId:
                user.id,

              productId:
                productId,

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
          "Cart response:",
          response.data
        );

        alert(
          "Product added to cart successfully!"
        );

      } catch (error) {

        console.error(
          "ADD TO CART ERROR:",
          error
        );

        if (
          error.response?.status === 401
        ) {

          alert(
            "Session expired. Please login again."
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          navigate("/login");

          return;

        }

        alert(
          error.response?.data?.message ||
          "Failed to add product to cart"
        );

      } finally {

        setCartLoading(null);

      }

    };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight:
            "100vh",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          fontSize:
            "22px",
        }}
      >

        Loading products...

      </div>

    );

  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {

    return (

      <div
        style={{
          minHeight:
            "100vh",

          padding:
            "40px",

          textAlign:
            "center",
        }}
      >

        <h2>
          Unable to load products
        </h2>

        <p>
          {error}
        </p>

        <button
          onClick={
            fetchProducts
          }
          style={{
            padding:
              "10px 20px",

            cursor:
              "pointer",
          }}
        >
          Try Again
        </button>

      </div>

    );

  }

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
      }}
    >

      {/* ============================================
          NAVBAR
      ============================================ */}

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
          to="/home"
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
            to="/home"
            style={{
              textDecoration:
                "none",

              color:
                "#333",
            }}
          >
            Home
          </Link>

          <Link
            to="/cart"
            style={{
              textDecoration:
                "none",

              color:
                "#333",
            }}
          >
            Cart 🛒
          </Link>

          <Link
            to="/orders"
            style={{
              textDecoration:
                "none",

              color:
                "#333",
            }}
          >
            My Orders
          </Link>

        </div>

      </nav>

      {/* ============================================
          HEADER
      ============================================ */}

      <div
        style={{
          textAlign:
            "center",

          padding:
            "45px 20px 25px",
        }}
      >

        <h1>
          Our Products
        </h1>

        <p>
          Fresh dairy products
          from HARI FARMS
        </p>

      </div>

      {/* ============================================
          PRODUCTS
      ============================================ */}

      <div
        style={{
          maxWidth:
            "1200px",

          margin:
            "0 auto",

          padding:
            "20px",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fit, minmax(250px, 1fr))",

          gap:
            "25px",
        }}
      >

        {products.length === 0 ? (

          <div
            style={{
              gridColumn:
                "1 / -1",

              textAlign:
                "center",

              padding:
                "50px",
            }}
          >

            <h2>
              No products available
            </h2>

            <p>
              Add products from
              the admin dashboard.
            </p>

          </div>

        ) : (

          products.map(
            (product) => (

              <div
                key={
                  product.id
                }

                style={{
                  background:
                    "#ffffff",

                  borderRadius:
                    "12px",

                  padding:
                    "20px",

                  boxShadow:
                    "0 3px 12px rgba(0,0,0,0.1)",
                }}
              >

                {/* IMAGE */}

                {product.image ? (

                  <img
                    src={
                      product.image
                    }

                    alt={
                      product.name
                    }

                    style={{
                      width:
                        "100%",

                      height:
                        "200px",

                      objectFit:
                        "cover",

                      borderRadius:
                        "10px",
                    }}

                    onError={
                      (e) => {

                        e.target.style.display =
                          "none";

                      }
                    }
                  />

                ) : (

                  <div
                    style={{
                      height:
                        "200px",

                      display:
                        "flex",

                      justifyContent:
                        "center",

                      alignItems:
                        "center",

                      fontSize:
                        "70px",

                      background:
                        "#f0f0f0",

                      borderRadius:
                        "10px",
                    }}
                  >

                    {
                      product.emoji ||
                      "🥛"
                    }

                  </div>

                )}

                {/* NAME */}

                <h2>
                  {
                    product.emoji
                  }{" "}
                  {
                    product.name
                  }
                </h2>

                {/* DESCRIPTION */}

                <p>
                  {
                    product.description ||
                    "Fresh dairy product"
                  }
                </p>

                {/* UNIT */}

                <p>
                  Unit:{" "}
                  {
                    product.unit ||
                    "N/A"
                  }
                </p>

                {/* PRICE */}

                <h3>
                  ₹
                  {Number(
                    product.price
                  ).toFixed(2)}
                </h3>

                {/* STOCK */}

                <p>
                  Stock:{" "}
                  {
                    product.stock
                  }
                </p>

                {/* BUTTON */}

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
                    width:
                      "100%",

                    padding:
                      "12px",

                    border:
                      "none",

                    borderRadius:
                      "8px",

                    background:
                      Number(
                        product.stock
                      ) <= 0
                        ? "#aaa"
                        : "#2e7d32",

                    color:
                      "#ffffff",

                    cursor:
                      Number(
                        product.stock
                      ) <= 0
                        ? "not-allowed"
                        : "pointer",

                    fontSize:
                      "16px",
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

              </div>

            )
          )

        )}

      </div>

    </div>

  );

}

export default Products;