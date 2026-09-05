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

  const navigate = useNavigate();


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

  const [addingProduct, setAddingProduct] =
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

  const productImages = useMemo(() => ({

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

    cream:
      "https://images.unsplash.com/photo-1571212515416-fca88f6b4a49?auto=format&fit=crop&w=800&q=80",

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

      if (
        product.image_url &&
        String(product.image_url).trim() !== ""
      ) {

        const image =
          String(product.image_url).trim();


        // FULL URL

        if (
          image.startsWith("http://") ||
          image.startsWith("https://")
        ) {

          return image;

        }


        // BACKEND UPLOAD URL

        if (
          image.startsWith("/uploads/")
        ) {

          return `${API_URL}${image}`;

        }


        // ONLY FILE NAME

        if (
          !image.includes("/")
        ) {

          return `${API_URL}/uploads/${image}`;

        }


        return image;

      }


      // FALLBACK IMAGE BASED ON PRODUCT NAME

      const productName =
        String(product.name || "")
          .toLowerCase();


      if (
        productName.includes("milkshake")
      ) {

        return productImages.milkshake;

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
        productName.includes("cream")
      ) {

        return productImages.cream;

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


      if (
        productName.includes("milk")
      ) {

        return productImages.milk;

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
          Array.isArray(response.data)
        ) {

          productData =
            response.data;

        }

        else if (
          Array.isArray(response.data?.products)
        ) {

          productData =
            response.data.products;

        }

        else if (
          Array.isArray(response.data?.data)
        ) {

          productData =
            response.data.data;

        }


        setProducts(productData);

      }

      catch (error) {

        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to fetch products"

        );

      }

      finally {

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
    async (product) => {

      try {

        setError("");

        setMessage("");


        const token =
          localStorage.getItem("token");


        if (!token) {

          alert(
            "Please login first."
          );

          navigate("/login");

          return;

        }


        if (
          !product ||
          !product.id
        ) {

          setError(
            "Invalid product selected"
          );

          return;

        }


        setAddingProduct(
          product.id
        );


        console.log(
          "ADDING PRODUCT:",
          product.id
        );


        // ============================================
        // ADD PRODUCT TO CART
        // ============================================

        const response =
          await axios.post(

            `${API_URL}/api/cart/add`,

            {

              product_id:
                Number(product.id),

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

        }

        else {

          setError(

            response.data.message ||

            "Failed to add product to cart"

          );

        }

      }

      catch (error) {

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

          navigate("/login");

          return;

        }


        setError(

          error.response?.data?.message ||

          "Failed to add product to cart"

        );

      }

      finally {

        setAddingProduct(null);

      }

    };


  // ================================================
  // OPEN ADD PRODUCT FORM
  // ================================================

  const handleAddProduct =
    () => {

      if (!isAdmin) {

        setError(
          "Only admin can add products"
        );

        return;

      }


      setEditingProduct(null);


      setFormData({

        name: "",

        description: "",

        price: "",

        quantity: "",

        stock: "",

        image_url: "",

      });


      setShowForm(true);

    };


  // ================================================
  // OPEN EDIT PRODUCT FORM
  // ================================================

  const handleEditProduct =
    (product) => {

      if (!isAdmin) {

        setError(
          "Only admin can edit products"
        );

        return;

      }


      setEditingProduct(product);


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


      setShowForm(true);

    };


  // ================================================
  // HANDLE INPUT CHANGE
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

        setFormLoading(true);

        setError("");

        setMessage("");


        const token =
          localStorage.getItem("token");


        if (!token) {

          navigate("/login");

          return;

        }


        const headers = {

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json",

        };


        let response;


        // ============================================
        // UPDATE PRODUCT
        // ============================================

        if (editingProduct) {

          response =
            await axios.put(

              `${API_URL}/api/products/${editingProduct.id}`,

              formData,

              {
                headers,
              }

            );

        }


        // ============================================
        // ADD PRODUCT
        // ============================================

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


        if (
          response.data.success !== false
        ) {

          setMessage(

            editingProduct

              ? "Product updated successfully!"

              : "Product added successfully!"

          );


          setShowForm(false);

          setEditingProduct(null);


          await fetchProducts();

        }

        else {

          setError(

            response.data.message ||

            "Failed to save product"

          );

        }

      }

      catch (error) {

        console.error(
          "SAVE PRODUCT ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to save product"

        );

      }

      finally {

        setFormLoading(false);

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


      const confirmed =
        window.confirm(
          "Are you sure you want to delete this product?"
        );


      if (!confirmed) {

        return;

      }


      try {

        const token =
          localStorage.getItem("token");


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

      }

      catch (error) {

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
      (product) =>

        String(product.name || "")
          .toLowerCase()
          .includes(
            search.toLowerCase()
          )

    );


  // ================================================
  // LOGOUT
  // ================================================

  const handleLogout =
    () => {

      localStorage.removeItem("token");

      localStorage.removeItem("user");

      navigate("/login");

    };


  // ================================================
  // PAGE
  // ================================================

  return (

    <div
      style={styles.page}
    >


      {/* ============================================ */}
      {/* NAVBAR */}
      {/* ============================================ */}

      <div
        style={styles.navbar}
      >

        <div>

          <h2
            style={styles.logo}
          >
            🌿 HARI FARMS
          </h2>

          <p
            style={styles.subtitle}
          >
            Fresh Dairy Products
          </p>

        </div>


        <div
          style={styles.navButtons}
        >

          <button
            style={styles.navButton}
            onClick={() => {

              navigate(
                isAdmin
                  ? "/admin-dashboard"
                  : "/user-dashboard"
              );

            }}
          >
            🏠 Dashboard
          </button>


          {!isAdmin && (

            <button
              style={styles.navButton}
              onClick={() =>
                navigate("/cart")
              }
            >
              🛒 Cart
            </button>

          )}


          {!isAdmin && (

            <button
              style={styles.navButton}
              onClick={() =>
                navigate("/orders")
              }
            >
              📦 My Orders
            </button>

          )}


          <button
            style={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </div>


      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}

      <div
        style={styles.header}
      >

        <div>

          <h1
            style={styles.title}
          >
            🥛 Our Dairy Products
          </h1>

          <p
            style={styles.description}
          >
            Fresh and high-quality dairy products from HARI FARMS
          </p>

        </div>


        {isAdmin && (

          <button
            style={styles.addButton}
            onClick={handleAddProduct}
          >
            ➕ Add Product
          </button>

        )}

      </div>


      {/* ============================================ */}
      {/* SEARCH */}
      {/* ============================================ */}

      <input
        type="text"
        placeholder="🔍 Search products..."
        value={search}
        onChange={(event) =>
          setSearch(event.target.value)
        }
        style={styles.search}
      />


      {/* ============================================ */}
      {/* SUCCESS MESSAGE */}
      {/* ============================================ */}

      {message && (

        <div
          style={styles.success}
        >
          ✅ {message}
        </div>

      )}


      {/* ============================================ */}
      {/* ERROR MESSAGE */}
      {/* ============================================ */}

      {error && (

        <div
          style={styles.error}
        >
          ❌ {error}
        </div>

      )}


      {/* ============================================ */}
      {/* ADD / EDIT FORM */}
      {/* ============================================ */}

      {showForm && isAdmin && (

        <div
          style={styles.modalOverlay}
        >

          <div
            style={styles.modal}
          >

            <h2>

              {editingProduct

                ? "✏️ Edit Product"

                : "➕ Add New Product"

              }

            </h2>


            <form
              onSubmit={handleSubmit}
            >

              <input
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
                required
              />


              <textarea
                name="description"
                placeholder="Product Description"
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
              />


              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                style={styles.input}
                required
              />


              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                style={styles.input}
              />


              <input
                name="image_url"
                placeholder="Product Image URL"
                value={formData.image_url}
                onChange={handleChange}
                style={styles.input}
              />


              <div
                style={styles.formButtons}
              >

                <button
                  type="submit"
                  style={styles.saveButton}
                  disabled={formLoading}
                >

                  {formLoading

                    ? "Saving..."

                    : "💾 Save Product"

                  }

                </button>


                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* ============================================ */}
      {/* LOADING */}
      {/* ============================================ */}

      {loading && (

        <div
          style={styles.loading}
        >
          Loading products...
        </div>

      )}


      {/* ============================================ */}
      {/* PRODUCTS */}
      {/* ============================================ */}

      {!loading && (

        <div
          style={styles.grid}
        >

          {filteredProducts.map(
            (product) => (

              <div
                key={product.id}
                style={styles.card}
              >

                {/* PRODUCT IMAGE */}

                <img

                  src={
                    getProductImage(product)
                  }

                  alt={
                    product.name
                  }

                  style={styles.image}

                  onError={(event) => {

                    event.currentTarget.onerror =
                      null;

                    event.currentTarget.src =
                      productImages.default;

                  }}

                />


                <div
                  style={styles.cardContent}
                >

                  <h3
                    style={styles.productName}
                  >
                    {product.name}
                  </h3>


                  <p
                    style={styles.productDescription}
                  >
                    {product.description ||
                      "Fresh dairy product from HARI FARMS"}
                  </p>


                  <h2
                    style={styles.price}
                  >
                    ₹{
                      Number(
                        product.price || 0
                      ).toFixed(2)
                    }
                  </h2>


                  <p
                    style={styles.stock}
                  >

                    📦 Stock: {

                      product.stock ??
                      product.quantity ??
                      "Available"

                    }

                  </p>


                  {/* USER BUTTON */}

                  {!isAdmin && (

                    <button

                      style={

                        addingProduct === product.id

                          ? styles.disabledButton

                          : styles.cartButton

                      }

                      disabled={
                        addingProduct === product.id
                      }

                      onClick={() =>
                        handleAddToCart(product)
                      }

                    >

                      {

                        addingProduct === product.id

                          ? "Adding..."

                          : "🛒 Add to Cart"

                      }

                    </button>

                  )}


                  {/* ADMIN BUTTONS */}

                  {isAdmin && (

                    <div
                      style={styles.adminButtons}
                    >

                      <button

                        style={styles.editButton}

                        onClick={() =>
                          handleEditProduct(product)
                        }

                      >
                        ✏️ Edit
                      </button>


                      <button

                        style={styles.deleteButton}

                        onClick={() =>
                          handleDeleteProduct(
                            product.id
                          )
                        }

                      >
                        🗑️ Delete
                      </button>

                    </div>

                  )}

                </div>

              </div>

            )
          )}


          {filteredProducts.length === 0 && (

            <div
              style={styles.empty}
            >

              <h3>
                No products found
              </h3>

              <p>
                Try searching for another product.
              </p>

            </div>

          )}

        </div>

      )}

    </div>

  );

}


// ==================================================
// STYLES
// ==================================================

const styles = {

  page: {

    minHeight: "100vh",

    background:
      "#f4f7f4",

    padding:
      "25px",

    fontFamily:
      "Arial, sans-serif",

  },


  navbar: {

    display:
      "flex",

    justifyContent:
      "space-between",

    alignItems:
      "center",

    flexWrap:
      "wrap",

    gap:
      "20px",

    background:
      "#ffffff",

    padding:
      "20px 30px",

    borderRadius:
      "15px",

    marginBottom:
      "30px",

    boxShadow:
      "0 4px 15px rgba(0,0,0,0.08)",

  },


  logo: {

    margin:
      0,

    color:
      "#246b3f",

  },


  subtitle: {

    margin:
      "5px 0 0",

    color:
      "#777",

  },


  navButtons: {

    display:
      "flex",

    gap:
      "10px",

    flexWrap:
      "wrap",

  },


  navButton: {

    padding:
      "10px 16px",

    border:
      "none",

    borderRadius:
      "8px",

    cursor:
      "pointer",

    background:
      "#e8f5e9",

    color:
      "#246b3f",

    fontWeight:
      "bold",

  },


  logoutButton: {

    padding:
      "10px 16px",

    border:
      "none",

    borderRadius:
      "8px",

    cursor:
      "pointer",

    background:
      "#dc3545",

    color:
      "white",

    fontWeight:
      "bold",

  },


  header: {

    display:
      "flex",

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

  },


  title: {

    margin:
      0,

    color:
      "#222",

  },


  description: {

    color:
      "#666",

  },


  addButton: {

    background:
      "#198754",

    color:
      "white",

    border:
      "none",

    padding:
      "13px 20px",

    borderRadius:
      "8px",

    fontSize:
      "16px",

    fontWeight:
      "bold",

    cursor:
      "pointer",

  },


  search: {

    width:
      "100%",

    boxSizing:
      "border-box",

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

  },


  success: {

    background:
      "#d1e7dd",

    color:
      "#0f5132",

    padding:
      "15px",

    borderRadius:
      "10px",

    marginBottom:
      "20px",

  },


  error: {

    background:
      "#f8d7da",

    color:
      "#842029",

    padding:
      "15px",

    borderRadius:
      "10px",

    marginBottom:
      "20px",

  },


  loading: {

    background:
      "white",

    padding:
      "30px",

    textAlign:
      "center",

    borderRadius:
      "12px",

  },


  grid: {

    display:
      "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",

    gap:
      "25px",

  },


  card: {

    background:
      "white",

    borderRadius:
      "15px",

    overflow:
      "hidden",

    boxShadow:
      "0 5px 18px rgba(0,0,0,0.10)",

    transition:
      "transform 0.2s",

  },


  image: {

    width:
      "100%",

    height:
      "210px",

    objectFit:
      "cover",

    display:
      "block",

  },


  cardContent: {

    padding:
      "20px",

  },


  productName: {

    marginTop:
      0,

    color:
      "#222",

  },


  productDescription: {

    color:
      "#777",

    minHeight:
      "40px",

  },


  price: {

    color:
      "#198754",

    margin:
      "15px 0",

  },


  stock: {

    color:
      "#555",

  },


  cartButton: {

    width:
      "100%",

    padding:
      "13px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#198754",

    color:
      "white",

    fontSize:
      "16px",

    fontWeight:
      "bold",

    cursor:
      "pointer",

  },


  disabledButton: {

    width:
      "100%",

    padding:
      "13px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#999",

    color:
      "white",

    fontSize:
      "16px",

  },


  adminButtons: {

    display:
      "flex",

    gap:
      "10px",

  },


  editButton: {

    flex:
      1,

    padding:
      "12px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#ffc107",

    cursor:
      "pointer",

    fontWeight:
      "bold",

  },


  deleteButton: {

    flex:
      1,

    padding:
      "12px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#dc3545",

    color:
      "white",

    cursor:
      "pointer",

    fontWeight:
      "bold",

  },


  empty: {

    background:
      "white",

    padding:
      "40px",

    borderRadius:
      "12px",

    textAlign:
      "center",

    gridColumn:
      "1 / -1",

  },


  modalOverlay: {

    position:
      "fixed",

    top:
      0,

    left:
      0,

    right:
      0,

    bottom:
      0,

    background:
      "rgba(0,0,0,0.5)",

    display:
      "flex",

    justifyContent:
      "center",

    alignItems:
      "center",

    zIndex:
      1000,

    padding:
      "20px",

  },


  modal: {

    width:
      "100%",

    maxWidth:
      "500px",

    maxHeight:
      "90vh",

    overflowY:
      "auto",

    background:
      "white",

    padding:
      "30px",

    borderRadius:
      "15px",

  },


  input: {

    width:
      "100%",

    boxSizing:
      "border-box",

    padding:
      "13px",

    marginBottom:
      "15px",

    border:
      "1px solid #ddd",

    borderRadius:
      "8px",

  },


  textarea: {

    width:
      "100%",

    boxSizing:
      "border-box",

    minHeight:
      "100px",

    padding:
      "13px",

    marginBottom:
      "15px",

    border:
      "1px solid #ddd",

    borderRadius:
      "8px",

  },


  formButtons: {

    display:
      "flex",

    gap:
      "10px",

  },


  saveButton: {

    flex:
      1,

    padding:
      "13px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#198754",

    color:
      "white",

    fontWeight:
      "bold",

    cursor:
      "pointer",

  },


  cancelButton: {

    flex:
      1,

    padding:
      "13px",

    border:
      "none",

    borderRadius:
      "8px",

    background:
      "#6c757d",

    color:
      "white",

    cursor:
      "pointer",

  },

};


export default Products;