import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";


function Products() {

  // ================================================
  // NAVIGATION
  // ================================================

  const navigate =
    useNavigate();


  // ================================================
  // API URL
  // ================================================

  const API_URL =
    process.env.REACT_APP_API_URL ||
    "http://localhost:5000";


  // ================================================
  // STATE
  // ================================================

  const [products, setProducts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [user, setUser] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [formLoading, setFormLoading] =
    useState(false);


  // ================================================
  // PRODUCT FORM
  // ================================================

  const [formData, setFormData] =
    useState({

      name: "",

      description: "",

      price: "",

      quantity: "",

      stock: "",

      image_url: "",

    });


  // ================================================
  // GET LOGGED IN USER
  // ================================================

  useEffect(() => {

    try {

      const storedUser =
        localStorage.getItem("user");


      if (storedUser) {

        setUser(
          JSON.parse(storedUser)
        );

      }

    } catch (error) {

      console.error(
        "USER PARSE ERROR:",
        error
      );

    }

  }, []);


  // ================================================
  // CHECK ADMIN
  // ================================================

  const isAdmin =
    user?.role?.toLowerCase() === "admin";


  // ================================================
  // PRODUCT FALLBACK IMAGES
  // ================================================

  const productImages =
    useMemo(() => ({

      milk:
        "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",

      paneer:
        "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=800&q=80",

      cheese:
        "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",

      butter:
        "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",

      curd:
        "https://images.unsplash.com/photo-1571212515416-fca88f6b4a49?auto=format&fit=crop&w=800&q=80",

      yogurt:
        "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80",

      ghee:
        "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",

      lassi:
        "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80",

      milkshake:
        "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",

      kulfi:
        "https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=800&q=80",

      rabri:
        "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=800&q=80",

      khoa:
        "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80",

      default:
        "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",

    }), []);


  // ================================================
  // GET PRODUCT IMAGE
  // ================================================

  const getProductImage =
    useCallback((product) => {

      // --------------------------------------------
      // DATABASE IMAGE URL
      // --------------------------------------------

      if (
        product.image_url &&
        product.image_url.trim() !== ""
      ) {

        const image =
          product.image_url.trim();


        // Full URL

        if (
          image.startsWith("http://") ||
          image.startsWith("https://")
        ) {

          return image;

        }


        // Uploaded image

        if (
          image.startsWith("/uploads/")
        ) {

          return `${API_URL}${image}`;

        }


        // Upload filename

        if (
          !image.includes("/")
        ) {

          return `${API_URL}/uploads/${image}`;

        }


        return image;

      }


      // --------------------------------------------
      // FIND IMAGE USING PRODUCT NAME
      // --------------------------------------------

      const productName =
        String(
          product.name || ""
        ).toLowerCase();


      if (
        productName.includes("milkshake")
      ) {

        return productImages.milkshake;

      }


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
        productName.includes("curd")
      ) {

        return productImages.curd;

      }


      if (
        productName.includes("yogurt") ||
        productName.includes("yoghurt")
      ) {

        return productImages.yogurt;

      }


      if (
        productName.includes("ghee")
      ) {

        return productImages.ghee;

      }


      if (
        productName.includes("lassi")
      ) {

        return productImages.lassi;

      }


      if (
        productName.includes("kulfi")
      ) {

        return productImages.kulfi;

      }


      if (
        productName.includes("rabri")
      ) {

        return productImages.rabri;

      }


      if (
        productName.includes("khoa") ||
        productName.includes("khoya")
      ) {

        return productImages.khoa;

      }


      return productImages.default;

    }, [
      API_URL,
      productImages,
    ]);


  // ================================================
  // FETCH PRODUCTS
  // ================================================

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


        let productData = [];


        if (
          Array.isArray(
            response.data
          )
        ) {

          productData =
            response.data;

        }

        else if (
          Array.isArray(
            response.data.products
          )
        ) {

          productData =
            response.data.products;

        }

        else if (
          response.data.success &&
          Array.isArray(
            response.data.data
          )
        ) {

          productData =
            response.data.data;

        }


        setProducts(
          productData
        );


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


  // ================================================
  // LOAD PRODUCTS
  // ================================================

  useEffect(() => {

    fetchProducts();

  }, [
    fetchProducts,
  ]);


  // ================================================
  // ADD TO CART
  // ================================================

  const handleAddToCart =
    async (productId) => {

      try {

        setError("");

        setMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        if (!token) {

          navigate(
            "/login"
          );

          return;

        }


        console.log(
          "ADDING PRODUCT:",
          productId
        );


        const response =
          await axios.post(

            `${API_URL}/api/cart/add`,

            {
              product_id:
                productId,

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
          "ADD TO CART RESPONSE:",
          response.data
        );


        if (
          response.data.success
        ) {

          setMessage(
            "Product added to cart successfully!"
          );

        }

        else {

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


        if (
          error.response?.status === 401
        ) {

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );


          navigate(
            "/login"
          );

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to add product to cart"

        );

      }

    };


  // ================================================
  // OPEN ADD PRODUCT
  // ================================================

  const handleAddProduct =
    () => {

      if (!isAdmin) {

        setError(
          "Only admin can add products"
        );

        return;

      }


      setEditingProduct(
        null
      );


      setFormData({

        name: "",

        description: "",

        price: "",

        quantity: "",

        stock: "",

        image_url: "",

      });


      setShowForm(
        true
      );

    };


  // ================================================
  // OPEN EDIT PRODUCT
  // ================================================

  const handleEditProduct =
    (product) => {

      if (!isAdmin) {

        setError(
          "Only admin can edit products"
        );

        return;

      }


      setEditingProduct(
        product
      );


      setFormData({

        name:
          product.name || "",

        description:
          product.description || "",

        price:
          product.price || "",

        quantity:
          product.quantity || "",

        stock:
          product.stock ?? "",

        image_url:
          product.image_url || "",

      });


      setShowForm(
        true
      );

    };


  // ================================================
  // INPUT CHANGE
  // ================================================

  const handleChange =
    (event) => {

      const {
        name,
        value,
      } = event.target;


      setFormData(
        (previous) => ({

          ...previous,

          [name]: value,

        })
      );

    };


  // ================================================
  // SAVE PRODUCT
  // ================================================

  const handleSubmit =
    async (event) => {

      event.preventDefault();


      if (!isAdmin) {

        setError(
          "Only admin can manage products"
        );

        return;

      }


      try {

        setFormLoading(
          true
        );

        setError("");

        setMessage("");


        const token =
          localStorage.getItem(
            "token"
          );


        const headers = {

          Authorization:
            `Bearer ${token}`,

        };


        let response;


        // --------------------------------------------
        // EDIT PRODUCT
        // --------------------------------------------

        if (
          editingProduct
        ) {

          response =
            await axios.put(

              `${API_URL}/api/products/${editingProduct.id}`,

              formData,

              {
                headers,
              }

            );

        }

        // --------------------------------------------
        // ADD PRODUCT
        // --------------------------------------------

        else {

          response =
            await axios.post(

              `${API_URL}/api/products`,

              formData,

              {
                headers,
              }

            );

        }


        console.log(
          "PRODUCT SAVE RESPONSE:",
          response.data
        );


        if (
          response.data.success !== false
        ) {

          setMessage(

            editingProduct

              ? "Product updated successfully!"

              : "Product added successfully!"

          );


          setShowForm(
            false
          );


          setEditingProduct(
            null
          );


          await fetchProducts();

        }

        else {

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

          "Failed to save product"

        );


      } finally {

        setFormLoading(
          false
        );

      }

    };


  // ================================================
  // DELETE PRODUCT
  // ================================================

  const handleDeleteProduct =
    async (productId) => {

      if (!isAdmin) {

        setError(
          "Only admin can delete products"
        );

        return;

      }


      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this product?"
        );


      if (!confirmDelete) {

        return;

      }


      try {

        const token =
          localStorage.getItem(
            "token"
          );


        const response =
          await axios.delete(

            `${API_URL}/api/products/${productId}`,

            {
              headers: {

                Authorization:
                  `Bearer ${token}`,

              },
            }

          );


        if (
          response.data.success !== false
        ) {

          setMessage(
            "Product deleted successfully!"
          );


          await fetchProducts();

        }

        else {

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

          "Failed to delete product"

        );

      }

    };


  // ================================================
  // FILTER PRODUCTS
  // ================================================

  const filteredProducts =
    products.filter(
      (product) => {

        const productName =
          String(
            product.name || ""
          ).toLowerCase();


        const searchText =
          search.toLowerCase();


        return productName.includes(
          searchText
        );

      }
    );


  // ================================================
  // LOGOUT
  // ================================================

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


  // ================================================
  // RENDER
  // ================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f7f4, #e9efea)",
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
          gap:
            "15px",
          background:
            "#ffffff",
          padding:
            "20px 25px",
          borderRadius:
            "15px",
          marginBottom:
            "30px",
          boxShadow:
            "0 8px 25px rgba(0,0,0,0.08)",
        }}
      >

        <div>

          <h2
            style={{
              margin: 0,
              color:
                "#254b32",
            }}
          >
            🌿 HARI FARMS
          </h2>


          <p
            style={{
              margin:
                "5px 0 0",
              color:
                "#777",
            }}
          >
            Fresh dairy products
          </p>

        </div>


        <div
          style={{
            display:
              "flex",
            flexWrap:
              "wrap",
            gap:
              "10px",
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
            style={navButtonStyle}
          >
            Dashboard
          </button>


          <button
            onClick={() =>
              navigate("/cart")
            }
            style={navButtonStyle}
          >
            🛒 Cart
          </button>


          <button
            onClick={() =>
              navigate("/orders")
            }
            style={navButtonStyle}
          >
            📦 Orders
          </button>


          <button
            onClick={handleLogout}
            style={{
              ...navButtonStyle,
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
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          flexWrap:
            "wrap",
          gap:
            "20px",
          marginBottom:
            "25px",
        }}
      >

        <div>

          <h1
            style={{
              margin:
                "0 0 8px",
              color:
                "#243b2a",
            }}
          >
            🥛 Our Products
          </h1>


          <p
            style={{
              margin: 0,
              color:
                "#666",
            }}
          >
            Fresh and quality dairy products from HARI FARMS
          </p>

        </div>


        {/* ADMIN ADD PRODUCT */}

        {
          isAdmin && (

            <button
              onClick={
                handleAddProduct
              }
              style={{
                background:
                  "#2f6241",
                color:
                  "#ffffff",
                border:
                  "none",
                padding:
                  "14px 22px",
                borderRadius:
                  "8px",
                fontSize:
                  "16px",
                fontWeight:
                  "bold",
                cursor:
                  "pointer",
              }}
            >
              ➕ Add Product
            </button>

          )
        }

      </div>


      {/* ============================================ */}
      {/* SEARCH */}
      {/* ============================================ */}

      <input

        type="text"

        placeholder="🔍 Search products..."

        value={search}

        onChange={(event) =>
          setSearch(
            event.target.value
          )
        }

        style={{
          width:
            "100%",
          maxWidth:
            "500px",
          padding:
            "15px",
          borderRadius:
            "10px",
          border:
            "1px solid #ddd",
          marginBottom:
            "25px",
          fontSize:
            "16px",
          boxSizing:
            "border-box",
        }}

      />


      {/* ============================================ */}
      {/* SUCCESS MESSAGE */}
      {/* ============================================ */}

      {
        message && (

          <div
            style={{
              background:
                "#e8f5e9",
              color:
                "#2e7d32",
              padding:
                "15px",
              borderRadius:
                "10px",
              marginBottom:
                "20px",
            }}
          >
            ✅ {message}
          </div>

        )
      }


      {/* ============================================ */}
      {/* ERROR */}
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
                "18px",
            }}
          >
            Loading products...
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
                "repeat(auto-fit, minmax(260px, 1fr))",

              gap:
                "22px",
            }}
          >

            {
              filteredProducts.map(
                (product) => (

                  <div

                    key={product.id}

                    style={{
                      background:
                        "#ffffff",

                      borderRadius:
                        "16px",

                      overflow:
                        "hidden",

                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.12)",

                      transition:
                        "0.3s",

                      display:
                        "flex",

                      flexDirection:
                        "column",
                    }}

                  >


                    {/* PRODUCT IMAGE */}

                    <img

                      src={
                        getProductImage(
                          product
                        )
                      }

                      alt={
                        product.name
                      }

                      onError={(event) => {

                        event.currentTarget.src =
                          productImages.default;

                      }}

                      style={{
                        width:
                          "100%",

                        height:
                          "220px",

                        objectFit:
                          "cover",

                        display:
                          "block",
                      }}

                    />


                    {/* PRODUCT CONTENT */}

                    <div
                      style={{
                        padding:
                          "20px",
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        flexGrow:
                          1,
                      }}
                    >

                      <h2
                        style={{
                          margin:
                            "0 0 10px",
                          color:
                            "#263238",
                        }}
                      >
                        {product.name}
                      </h2>


                      <p
                        style={{
                          color:
                            "#666",
                          lineHeight:
                            "1.5",
                          minHeight:
                            "48px",
                        }}
                      >
                        {
                          product.description ||
                          "Fresh quality dairy product."
                        }
                      </p>


                      <h2
                        style={{
                          color:
                            "#263238",
                          margin:
                            "10px 0",
                        }}
                      >
                        ₹{
                          Number(
                            product.price || 0
                          ).toFixed(2)
                        }
                      </h2>


                      {
                        product.quantity && (

                          <p
                            style={{
                              color:
                                "#777",
                            }}
                          >
                            {product.quantity}
                          </p>

                        )
                      }


                      <p
                        style={{
                          fontWeight:
                            "bold",
                          color:
                            "#355d40",
                        }}
                      >
                        Stock: {
                          product.stock ??
                          0
                        }
                      </p>


                      {/* USER ADD TO CART */}

                      <button

                        onClick={() =>
                          handleAddToCart(
                            product.id
                          )
                        }

                        style={{
                          width:
                            "100%",

                          padding:
                            "14px",

                          background:
                            "#2f6241",

                          color:
                            "#ffffff",

                          border:
                            "none",

                          borderRadius:
                            "10px",

                          fontSize:
                            "16px",

                          fontWeight:
                            "bold",

                          cursor:
                            "pointer",

                          marginTop:
                            "10px",
                        }}

                      >
                        🛒 Add to Cart
                      </button>


                      {/* ADMIN OPTIONS */}

                      {
                        isAdmin && (

                          <div
                            style={{
                              display:
                                "flex",

                              gap:
                                "10px",

                              marginTop:
                                "12px",
                            }}
                          >

                            <button

                              onClick={() =>
                                handleEditProduct(
                                  product
                                )
                              }

                              style={{
                                flex: 1,

                                padding:
                                  "12px",

                                background:
                                  "#f39c12",

                                color:
                                  "#ffffff",

                                border:
                                  "none",

                                borderRadius:
                                  "8px",

                                fontWeight:
                                  "bold",

                                cursor:
                                  "pointer",
                              }}

                            >
                              ✏️ Edit
                            </button>


                            <button

                              onClick={() =>
                                handleDeleteProduct(
                                  product.id
                                )
                              }

                              style={{
                                flex: 1,

                                padding:
                                  "12px",

                                background:
                                  "#d32f2f",

                                color:
                                  "#ffffff",

                                border:
                                  "none",

                                borderRadius:
                                  "8px",

                                fontWeight:
                                  "bold",

                                cursor:
                                  "pointer",
                              }}

                            >
                              🗑 Delete
                            </button>

                          </div>

                        )
                      }

                    </div>

                  </div>

                )
              )
            }


            {
              filteredProducts.length === 0 && (

                <div
                  style={{
                    gridColumn:
                      "1 / -1",

                    background:
                      "#ffffff",

                    padding:
                      "50px",

                    borderRadius:
                      "15px",

                    textAlign:
                      "center",
                  }}
                >

                  <h2>
                    No products found
                  </h2>

                </div>

              )
            }

          </div>

        )
      }


      {/* ============================================ */}
      {/* ADMIN ADD / EDIT MODAL */}
      {/* ============================================ */}

      {
        showForm &&
        isAdmin && (

          <div
            style={{
              position:
                "fixed",

              top: 0,

              left: 0,

              right: 0,

              bottom: 0,

              background:
                "rgba(0,0,0,0.55)",

              display:
                "flex",

              justifyContent:
                "center",

              alignItems:
                "center",

              padding:
                "20px",

              zIndex:
                9999,

              overflowY:
                "auto",
            }}
          >

            <form

              onSubmit={
                handleSubmit
              }

              style={{
                background:
                  "#ffffff",

                padding:
                  "30px",

                borderRadius:
                  "18px",

                width:
                  "100%",

                maxWidth:
                  "600px",

                boxShadow:
                  "0 10px 40px rgba(0,0,0,0.3)",
              }}

            >

              <h2>

                {
                  editingProduct

                    ? "✏️ Edit Product"

                    : "➕ Add New Product"
                }

              </h2>


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
                  resize:
                    "vertical",
                }}

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

                type="text"

                name="quantity"

                placeholder="Quantity (Example: 1 Litre)"

                value={
                  formData.quantity
                }

                onChange={
                  handleChange
                }

                style={inputStyle}

              />


              <input

                type="number"

                name="stock"

                placeholder="Stock"

                value={
                  formData.stock
                }

                onChange={
                  handleChange
                }

                required

                style={inputStyle}

              />


              <input

                type="url"

                name="image_url"

                placeholder="Product Image URL"

                value={
                  formData.image_url
                }

                onChange={
                  handleChange
                }

                style={inputStyle}

              />


              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "12px",

                  marginTop:
                    "20px",
                }}
              >

                <button

                  type="submit"

                  disabled={
                    formLoading
                  }

                  style={{
                    flex: 1,

                    padding:
                      "14px",

                    background:
                      "#2f6241",

                    color:
                      "#ffffff",

                    border:
                      "none",

                    borderRadius:
                      "8px",

                    fontWeight:
                      "bold",

                    cursor:
                      "pointer",
                  }}

                >

                  {
                    formLoading

                      ? "Saving..."

                      : editingProduct

                        ? "Update Product"

                        : "Add Product"
                  }

                </button>


                <button

                  type="button"

                  onClick={() => {

                    setShowForm(
                      false
                    );

                    setEditingProduct(
                      null
                    );

                  }}

                  style={{
                    flex: 1,

                    padding:
                      "14px",

                    background:
                      "#777",

                    color:
                      "#ffffff",

                    border:
                      "none",

                    borderRadius:
                      "8px",

                    fontWeight:
                      "bold",

                    cursor:
                      "pointer",
                  }}

                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        )
      }

    </div>

  );

}


// ================================================
// NAV BUTTON STYLE
// ================================================

const navButtonStyle = {

  background:
    "#2f6241",

  color:
    "#ffffff",

  border:
    "none",

  padding:
    "10px 16px",

  borderRadius:
    "8px",

  cursor:
    "pointer",

  fontWeight:
    "bold",

};


// ================================================
// INPUT STYLE
// ================================================

const inputStyle = {

  width:
    "100%",

  padding:
    "13px",

  marginTop:
    "12px",

  border:
    "1px solid #ddd",

  borderRadius:
    "8px",

  boxSizing:
    "border-box",

  fontSize:
    "15px",

};


export default Products;