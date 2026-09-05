import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
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


  const [message, setMessage] =
    useState("");


  const [user, setUser] =
    useState(null);


  const [addingProduct, setAddingProduct] =
    useState(null);


  // ==================================================
  // ADMIN PRODUCT FORM
  // ==================================================

  const [showForm, setShowForm] =
    useState(false);


  const [editingProduct, setEditingProduct] =
    useState(null);


  const [formData, setFormData] =
    useState({
      name: "",
      price: "",
      description: "",
      image: "",
      stock: "",
    });


  // ==================================================
  // DEFAULT PRODUCT IMAGES
  // ==================================================

  const productImages = {

    milk:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

    paneer:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",

    cheese:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",

    butter:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",

    ghee:
      "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",

    curd:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",

    yogurt:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",

    cream:
      "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80",

    default:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",

  };


  // ==================================================
  // GET CURRENT USER
  // ==================================================

  useEffect(() => {

    try {

      const savedUser =
        localStorage.getItem("user");


      if (savedUser) {

        setUser(
          JSON.parse(savedUser)
        );

      }

    } catch (error) {

      console.error(
        "USER PARSE ERROR:",
        error
      );

    }

  }, []);


  // ==================================================
  // GET PRODUCT IMAGE
  // ==================================================

  const getProductImage =
    useCallback(
      (product) => {

        // ----------------------------------------------
        // IMAGE FROM DATABASE
        // ----------------------------------------------

        if (
          product.image
        ) {

          if (
            product.image.startsWith("http")
          ) {

            return product.image;

          }


          if (
            product.image.startsWith("/uploads")
          ) {

            return `${API_URL}${product.image}`;

          }


          if (
            product.image.startsWith("uploads/")
          ) {

            return `${API_URL}/${product.image}`;

          }


          return product.image;

        }


        // ----------------------------------------------
        // IMAGE_URL FROM DATABASE
        // ----------------------------------------------

        if (
          product.image_url
        ) {

          if (
            product.image_url.startsWith("http")
          ) {

            return product.image_url;

          }


          if (
            product.image_url.startsWith("/")
          ) {

            return `${API_URL}${product.image_url}`;

          }


          return product.image_url;

        }


        // ----------------------------------------------
        // CATEGORY / NAME FALLBACK IMAGE
        // ----------------------------------------------

        const productName =
          (
            product.name ||
            product.category ||
            ""
          )
            .toLowerCase();


        if (
          productName.includes("milk")
        ) {

          return productImages.milk;

        }


        if (
          productName.includes("paneer")
        ) {

          return productImages.paneer;

        }


        if (
          productName.includes("cheese")
        ) {

          return productImages.cheese;

        }


        if (
          productName.includes("butter")
        ) {

          return productImages.butter;

        }


        if (
          productName.includes("ghee")
        ) {

          return productImages.ghee;

        }


        if (
          productName.includes("curd")
        ) {

          return productImages.curd;

        }


        if (
          productName.includes("yogurt")
        ) {

          return productImages.yogurt;

        }


        if (
          productName.includes("cream")
        ) {

          return productImages.cream;

        }


        return productImages.default;

      },

      [
        API_URL,
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


          console.log(
            "PRODUCT RESPONSE:",
            response.data
          );


          if (
            response.data.success
          ) {

            setProducts(

              Array.isArray(
                response.data.products
              )

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

            "Unable to load products"

          );

        } finally {

          setLoading(false);

        }

      },

      [
        API_URL,
      ]
    );


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
    async (product) => {

      try {

        setMessage("");

        setError("");


        const token =
          localStorage.getItem("token");


        if (
          !token
        ) {

          navigate("/login");

          return;

        }


        setAddingProduct(
          product.id
        );


        console.log(
          "ADDING PRODUCT:",
          product.id
        );


        // ==============================================
        // IMPORTANT
        //
        // Send BOTH commonly-used product field names.
        //
        // Your backend should use:
        // req.body.product_id
        // ==============================================

        const response =
          await axios.post(

            `${API_URL}/api/cart/add`,

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


        if (
          response.data.success
        ) {

          setMessage(
            `${product.name} added to cart successfully!`
          );


          setTimeout(() => {

            setMessage("");

          }, 3000);

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
          "ADD TO CART SERVER RESPONSE:",
          error.response?.data
        );


        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          navigate("/login");

          return;

        }


        setError(

          error.response?.data?.message ||

          "Unable to add product to cart"

        );

      } finally {

        setAddingProduct(
          null
        );

      }

    };


  // ==================================================
  // DELETE PRODUCT
  // ==================================================

  const deleteProduct =
    async (product) => {

      const confirmed =
        window.confirm(

          `Are you sure you want to delete ${product.name}?`

        );


      if (!confirmed) {

        return;

      }


      try {

        const token =
          localStorage.getItem("token");


        const response =
          await axios.delete(

            `${API_URL}/api/products/${product.id}`,

            {

              headers: {

                Authorization:
                  `Bearer ${token}`,

              },

            }

          );


        if (
          response.data.success
        ) {

          setMessage(
            "Product deleted successfully"
          );


          fetchProducts();

        } else {

          setError(
            response.data.message ||
            "Failed to delete product"
          );

        }

      } catch (error) {

        console.error(
          "DELETE PRODUCT ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Unable to delete product"

        );

      }

    };


  // ==================================================
  // OPEN ADD PRODUCT FORM
  // ==================================================

  const openAddForm =
    () => {

      setEditingProduct(null);


      setFormData({

        name: "",

        price: "",

        description: "",

        image: "",

        stock: "",

      });


      setShowForm(true);

    };


  // ==================================================
  // OPEN EDIT PRODUCT FORM
  // ==================================================

  const openEditForm =
    (product) => {

      setEditingProduct(
        product
      );


      setFormData({

        name:
          product.name || "",

        price:
          product.price || "",

        description:
          product.description || "",

        image:
          product.image ||
          product.image_url ||
          "",

        stock:
          product.stock || "",

      });


      setShowForm(true);

    };


  // ==================================================
  // HANDLE FORM CHANGE
  // ==================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(
        (previous) => ({

          ...previous,

          [name]:
            value,

        })
      );

    };


  // ==================================================
  // SAVE PRODUCT
  // ==================================================

  const saveProduct =
    async (event) => {

      event.preventDefault();


      try {

        const token =
          localStorage.getItem("token");


        const productData = {

          name:
            formData.name,

          price:
            Number(formData.price),

          description:
            formData.description,

          image:
            formData.image,

          stock:
            Number(formData.stock || 0),

        };


        let response;


        // ----------------------------------------------

        if (
          editingProduct
        ) {

          response =
            await axios.put(

              `${API_URL}/api/products/${editingProduct.id}`,

              productData,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",

                },

              }

            );

        }

        // ----------------------------------------------

        else {

          response =
            await axios.post(

              `${API_URL}/api/products`,

              productData,

              {

                headers: {

                  Authorization:
                    `Bearer ${token}`,

                  "Content-Type":
                    "application/json",

                },

              }

            );

        }


        if (
          response.data.success
        ) {

          setMessage(

            editingProduct

              ? "Product updated successfully"

              : "Product added successfully"

          );


          setShowForm(false);


          fetchProducts();

        } else {

          setError(

            response.data.message ||

            "Failed to save product"

          );

        }

      } catch (error) {

        console.error(
          "SAVE PRODUCT ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Unable to save product"

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


      navigate(
        "/login",
        {
          replace: true,
        }
      );

    };


  // ==================================================
  // CHECK ADMIN
  // ==================================================

  const isAdmin =
    user?.role === "admin";


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f9f4, #e8f5e9)",
        padding: "30px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >


      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          flexWrap:
            "wrap",
          gap: "15px",
          background:
            "#ffffff",
          padding:
            "20px 30px",
          borderRadius:
            "15px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
          marginBottom:
            "30px",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,
              color: "#2e7d32",
            }}
          >
            🌿 HARI FARMS
          </h2>

          <small
            style={{
              color: "#777",
            }}
          >
            Fresh Dairy Products
          </small>

        </div>


        <div
          style={{
            display:
              "flex",
            gap:
              "10px",
            flexWrap:
              "wrap",
          }}
        >

          <button
            onClick={() =>
              navigate(

                isAdmin

                  ? "/admin-dashboard"

                  : "/user-dashboard"

              )
            }
            style={buttonStyle}
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/cart")
            }
            style={buttonStyle}
          >
            🛒 Cart
          </button>


          {
            !isAdmin && (

              <button
                onClick={() =>
                  navigate("/orders")
                }
                style={buttonStyle}
              >
                📦 My Orders
              </button>

            )
          }


          {
            isAdmin && (

              <button
                onClick={() =>
                  navigate("/admin-orders")
                }
                style={buttonStyle}
              >
                📋 Manage Orders
              </button>

            )
          }


          <button
            onClick={
              handleLogout
            }
            style={{
              ...buttonStyle,
              background:
                "#d32f2f",
            }}
          >
            Logout
          </button>

        </div>

      </div>


      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          flexWrap:
            "wrap",
          gap:
            "15px",
          marginBottom:
            "25px",
        }}
      >

        <div>

          <h1
            style={{
              marginBottom:
                "5px",
              color:
                "#1b5e20",
            }}
          >
            🥛 Our Dairy Products
          </h1>

          <p
            style={{
              color:
                "#666",
            }}
          >
            Fresh and healthy products directly from HARI FARMS
          </p>

        </div>


        {
          isAdmin && (

            <button
              onClick={
                openAddForm
              }
              style={{
                ...buttonStyle,
                background:
                  "#2e7d32",
                padding:
                  "12px 20px",
              }}
            >
              ➕ Add Product
            </button>

          )
        }

      </div>


      {/* ============================================ */}
      {/* SUCCESS MESSAGE */}
      {/* ============================================ */}

      {
        message && (

          <div
            style={{
              background:
                "#dff5e1",
              color:
                "#1b5e20",
              padding:
                "15px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
              fontWeight:
                "bold",
            }}
          >
            ✅ {message}
          </div>

        )
      }


      {/* ============================================ */}
      {/* ERROR MESSAGE */}
      {/* ============================================ */}

      {
        error && (

          <div
            style={{
              background:
                "#ffebee",
              color:
                "#c62828",
              padding:
                "15px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            ❌ {error}
          </div>

        )
      }


      {/* ============================================ */}
      {/* PRODUCT FORM */}
      {/* ============================================ */}

      {
        isAdmin &&
        showForm && (

          <div
            style={{
              background:
                "#ffffff",
              padding:
                "25px",
              borderRadius:
                "15px",
              marginBottom:
                "30px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.1)",
            }}
          >

            <h2>

              {
                editingProduct

                  ? "✏️ Edit Product"

                  : "➕ Add New Product"

              }

            </h2>


            <form
              onSubmit={
                saveProduct
              }
            >

              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
                style={inputStyle}
              />


              <input
                type="number"
                name="price"
                placeholder="Price"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                required
                style={inputStyle}
              />


              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={
                  formData.stock
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
              />


              <input
                type="text"
                name="image"
                placeholder="Product Image URL"
                value={
                  formData.image
                }
                onChange={
                  handleChange
                }
                style={inputStyle}
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
                style={{
                  ...inputStyle,
                  minHeight:
                    "100px",
                }}
              />


              <button
                type="submit"
                style={{
                  ...buttonStyle,
                  background:
                    "#2e7d32",
                  marginRight:
                    "10px",
                }}
              >
                💾 Save Product
              </button>


              <button
                type="button"
                onClick={() =>
                  setShowForm(false)
                }
                style={{
                  ...buttonStyle,
                  background:
                    "#777",
                }}
              >
                Cancel
              </button>

            </form>

          </div>

        )
      }


      {/* ============================================ */}
      {/* LOADING */}
      {/* ============================================ */}

      {
        loading && (

          <div
            style={{
              textAlign:
                "center",
              padding:
                "50px",
              fontSize:
                "20px",
            }}
          >
            🥛 Loading products...
          </div>

        )
      }


      {/* ============================================ */}
      {/* PRODUCTS */}
      {/* ============================================ */}

      {
        !loading && (

          <div
            style={{
              display:
                "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(250px, 1fr))",

              gap:
                "25px",
            }}
          >

            {
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
                        "18px",

                      overflow:
                        "hidden",

                      boxShadow:
                        "0 5px 18px rgba(0,0,0,0.1)",

                      transition:
                        "transform 0.2s",

                    }}
                  >

                    {/* IMAGE */}

                    <img
                      src={
                        getProductImage(
                          product
                        )
                      }

                      alt={
                        product.name
                      }

                      onError={
                        (event) => {

                          event.target.src =
                            productImages.default;

                        }
                      }

                      style={{
                        width:
                          "100%",

                        height:
                          "200px",

                        objectFit:
                          "cover",

                      }}
                    />


                    {/* PRODUCT DETAILS */}

                    <div
                      style={{
                        padding:
                          "20px",
                      }}
                    >

                      <h3
                        style={{
                          marginTop:
                            0,

                          color:
                            "#1b5e20",
                        }}
                      >
                        {product.name}
                      </h3>


                      <p
                        style={{
                          color:
                            "#666",

                          minHeight:
                            "40px",
                        }}
                      >
                        {
                          product.description ||
                          "Fresh and healthy dairy product from HARI FARMS."
                        }
                      </p>


                      <h2
                        style={{
                          color:
                            "#2e7d32",
                        }}
                      >
                        ₹{
                          Number(
                            product.price || 0
                          ).toFixed(2)
                        }
                      </h2>


                      {
                        product.stock !== undefined && (

                          <p
                            style={{
                              color:
                                product.stock > 0

                                  ? "#2e7d32"

                                  : "#d32f2f",
                            }}
                          >

                            <strong>
                              Stock:
                            </strong>

                            {" "}

                            {product.stock}

                          </p>

                        )
                      }


                      {/* ================================= */}
                      {/* ADMIN BUTTONS */}
                      {/* ================================= */}

                      {
                        isAdmin ? (

                          <div
                            style={{
                              display:
                                "flex",

                              gap:
                                "10px",
                            }}
                          >

                            <button
                              onClick={() =>
                                openEditForm(
                                  product
                                )
                              }
                              style={{
                                ...buttonStyle,

                                background:
                                  "#1976d2",

                                flex:
                                  1,
                              }}
                            >
                              ✏️ Edit
                            </button>


                            <button
                              onClick={() =>
                                deleteProduct(
                                  product
                                )
                              }
                              style={{
                                ...buttonStyle,

                                background:
                                  "#d32f2f",

                                flex:
                                  1,
                              }}
                            >
                              🗑 Delete
                            </button>

                          </div>

                        ) : (

                          /* ================================= */
                          /* USER ADD TO CART */
                          /* ================================= */

                          <button
                            onClick={() =>
                              addToCart(
                                product
                              )
                            }

                            disabled={
                              addingProduct ===
                              product.id
                            }

                            style={{
                              ...buttonStyle,

                              background:
                                "#2e7d32",

                              width:
                                "100%",

                              padding:
                                "12px",

                              opacity:

                                addingProduct ===
                                product.id

                                  ? 0.7

                                  : 1,
                            }}
                          >

                            {
                              addingProduct ===
                              product.id

                                ? "Adding..."

                                : "🛒 Add to Cart"
                            }

                          </button>

                        )
                      }

                    </div>

                  </div>

                )
              )
            }

          </div>

        )
      }


      {/* ============================================ */}
      {/* NO PRODUCTS */}
      {/* ============================================ */}

      {
        !loading &&
        products.length === 0 && (

          <div
            style={{
              background:
                "#ffffff",

              padding:
                "40px",

              textAlign:
                "center",

              borderRadius:
                "15px",
            }}
          >

            <h2>
              No products available
            </h2>

          </div>

        )
      }

    </div>

  );

}


// ==================================================
// BUTTON STYLE
// ==================================================

const buttonStyle = {

  border:
    "none",

  padding:
    "10px 15px",

  borderRadius:
    "8px",

  background:
    "#388e3c",

  color:
    "#ffffff",

  cursor:
    "pointer",

  fontWeight:
    "bold",

};


// ==================================================
// INPUT STYLE
// ==================================================

const inputStyle = {

  width:
    "100%",

  padding:
    "12px",

  marginBottom:
    "15px",

  border:
    "1px solid #ddd",

  borderRadius:
    "8px",

  boxSizing:
    "border-box",

  fontSize:
    "15px",

};


// ==================================================
// EXPORT
// ==================================================

export default Products;