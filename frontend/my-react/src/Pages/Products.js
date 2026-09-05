import React, {
  useState,
  useEffect,
  useCallback,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";


// ==================================================
// PRODUCT IMAGES
// IMPORTANT:
// This object is OUTSIDE the component.
// This prevents the React Hook dependency warning.
// ==================================================

const productImages = {

  milk:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80",

  curd:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80",

  paneer:
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=600&q=80",

  butter:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=600&q=80",

  cheese:
    "https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?auto=format&fit=crop&w=600&q=80",

  ghee:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",

  default:
    "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80",

};


function Products() {

  const navigate =
    useNavigate();


  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  const [products, setProducts] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [message, setMessage] =
    useState("");


  // ==================================================
  // GET PRODUCT IMAGE
  // ==================================================

  const getProductImage =
    useCallback((product) => {

      if (
        product?.image &&
        String(product.image).trim() !== ""
      ) {

        const image =
          String(product.image).trim();


        if (
          image.startsWith("http://") ||
          image.startsWith("https://")
        ) {

          return image;

        }


        // If database already stores /uploads/
        if (
          image.startsWith("/uploads/")
        ) {

          return `${API_URL}${image}`;

        }


        // Normal uploaded image filename
        return `${API_URL}/uploads/${image}`;

      }


      const productName =
        String(
          product?.name || ""
        )
          .toLowerCase()
          .trim();


      if (
        productName.includes("milk")
      ) {

        return productImages.milk;

      }


      if (
        productName.includes("curd") ||
        productName.includes("yogurt")
      ) {

        return productImages.curd;

      }


      if (
        productName.includes("paneer")
      ) {

        return productImages.paneer;

      }


      if (
        productName.includes("butter")
      ) {

        return productImages.butter;

      }


      if (
        productName.includes("cheese")
      ) {

        return productImages.cheese;

      }


      if (
        productName.includes("ghee")
      ) {

        return productImages.ghee;

      }


      return productImages.default;

    }, [
      API_URL,
    ]);


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


        console.log(
          "PRODUCT RESPONSE:",
          response.data
        );


        if (
          response.data.success
        ) {

          setProducts(
            Array.isArray(response.data.products)
              ? response.data.products
              : []
          );

        } else {

          setError(
            response.data.message ||
            "Failed to fetch products"
          );

        }

      } catch (error) {

        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to fetch products"

        );

      } finally {

        setLoading(false);

      }

    }, [
      API_URL,
    ]);


  // ==================================================
  // LOAD PRODUCTS
  // ==================================================

  useEffect(() => {

    fetchProducts();

  }, [
    fetchProducts,
  ]);


  // ==================================================
  // ADD TO CART
  // ==================================================

  const addToCart =
    async (productId) => {

      try {

        setMessage("");

        setError("");


        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;

        }


        console.log(
          "ADDING PRODUCT:",
          productId
        );


        const response =
          await axios.post(

            `${API_URL}/api/cart`,

            {
              productId,
              quantity: 1,
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


        if (
          response.data.success
        ) {

          setMessage(
            "Product added to cart successfully!"
          );

        } else {

          setError(
            response.data.message ||
            "Failed to add product to cart"
          );

        }


      } catch (error) {

        console.error(
          "ADD TO CART ERROR:",
          error
        );


        console.log(
          "SERVER RESPONSE:",
          error.response?.data
        );


        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem("token");

          localStorage.removeItem("user");


          navigate(
            "/login",
            {
              replace: true,
            }
          );

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

      localStorage.removeItem("token");

      localStorage.removeItem("user");


      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7f5",
        padding: "30px",
      }}
    >


      {/* NAVBAR */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px",
          background: "#ffffff",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "30px",
        }}
      >

        <h2
          style={{
            margin: 0,
          }}
        >
          🌿 HARI FARMS
        </h2>


        <div>

          <button
            onClick={() =>
              navigate("/user-dashboard")
            }
            style={{
              marginRight: "10px",
            }}
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/cart")
            }
            style={{
              marginRight: "10px",
            }}
          >
            🛒 Cart
          </button>


          <button
            onClick={() =>
              navigate("/orders")
            }
            style={{
              marginRight: "10px",
            }}
          >
            📦 My Orders
          </button>


          <button
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* TITLE */}

      <h1>
        🥛 Our Products
      </h1>


      {/* SUCCESS MESSAGE */}

      {
        message && (

          <div
            style={{
              background: "#e8f5e9",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {message}
          </div>

        )
      }


      {/* ERROR MESSAGE */}

      {
        error && (

          <div
            style={{
              background: "#ffebee",
              color: "#d32f2f",
              padding: "15px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>

        )
      }


      {/* LOADING */}

      {
        loading && (

          <p>
            Loading products...
          </p>

        )
      }


      {/* PRODUCTS */}

      {
        !loading && (

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "20px",
            }}
          >

            {
              products.map(
                (product) => (

                  <div

                    key={
                      product.id ||
                      product.product_id
                    }

                    style={{
                      background: "#ffffff",
                      borderRadius: "15px",
                      overflow: "hidden",
                      boxShadow:
                        "0 3px 15px rgba(0,0,0,0.1)",
                    }}

                  >


                    {/* PRODUCT IMAGE */}

                    <img

                      src={
                        getProductImage(product)
                      }

                      alt={
                        product.name ||
                        "Product"
                      }

                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                        display: "block",
                      }}

                      onError={(event) => {

                        event.currentTarget.src =
                          productImages.default;

                      }}

                    />


                    {/* PRODUCT DETAILS */}

                    <div
                      style={{
                        padding: "20px",
                      }}
                    >

                      <h3>
                        {product.name}
                      </h3>


                      <p>

                        {
                          product.description ||
                          "Fresh dairy product"
                        }

                      </p>


                      <h3>

                        ₹{
                          Number(
                            product.price || 0
                          ).toFixed(2)
                        }

                      </h3>


                      {
                        product.unit && (

                          <p>
                            {product.unit}
                          </p>

                        )
                      }


                      {
                        product.stock !== undefined && (

                          <p>

                            Stock:

                            {" "}

                            {product.stock}

                          </p>

                        )
                      }


                      <button

                        onClick={() =>
                          addToCart(product.id)
                        }

                        disabled={
                          Number(product.stock) <= 0
                        }

                        style={{
                          width: "100%",
                          padding: "12px",
                          cursor:
                            Number(product.stock) <= 0
                              ? "not-allowed"
                              : "pointer",
                        }}

                      >

                        {
                          Number(product.stock) <= 0

                            ? "Out of Stock"

                            : "Add to Cart"

                        }

                      </button>

                    </div>

                  </div>

                )

              )
            }

          </div>

        )
      }


    </div>

  );

}


export default Products;