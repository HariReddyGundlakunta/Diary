import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";


// =====================================================
// PRODUCT IMAGE URLS
// =====================================================

const productImages = {

  // ===================================================
  // MILK
  // ===================================================

  milk:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",

  cowmilk:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",

  buffalomilk:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",

  tonedmilk:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",

  fullcreammilk:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // PANEER
  // ===================================================

  paneer:
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",

  malaipaneer:
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",

  freshpaneer:
    "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // CURD / DAHI / YOGURT
  // ===================================================

  curd:
    "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=900&q=80",

  dahi:
    "https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=900&q=80",

  yogurt:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",

  greekyogurt:
    "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // GHEE
  // ===================================================

  ghee:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",

  desighee:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",

  cowghee:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // BUTTER
  // ===================================================

  butter:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",

  whitebutter:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",

  saltedbutter:
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // CHEESE
  // ===================================================

  cheese:
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=80",

  mozzarella:
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=80",

  cheddar:
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // MILKSHAKE
  // ===================================================

  milkshake:
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80",

  strawberrymilkshake:
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80",

  chocolatemilkshake:
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80",

  badammilkshake:
    "https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // LASSI
  // ===================================================

  lassi:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",

  sweetlassi:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",

  mangolassi:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",

  kesarlassi:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // BUTTERMILK
  // ===================================================

  buttermilk:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",

  chaas:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",

  masalabuttermilk:
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // RABRI
  // ===================================================

  rabri:
    "https://images.unsplash.com/photo-1605196560547-1f5d1e3f4e08?auto=format&fit=crop&w=900&q=80",

  rabdi:
    "https://images.unsplash.com/photo-1605196560547-1f5d1e3f4e08?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // KULFI
  // ===================================================

  kulfi:
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",

  malaiKulfi:
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // KHOA / MAWA
  // ===================================================

  khoa:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",

  mawa:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",

  khoya:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // CREAM
  // ===================================================

  cream:
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=80",

  freshcream:
    "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // ICE CREAM
  // ===================================================

  icecream:
    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // KHEER
  // ===================================================

  kheer:
    "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // BASUNDI
  // ===================================================

  basundi:
    "https://images.unsplash.com/photo-1605196560547-1f5d1e3f4e08?auto=format&fit=crop&w=900&q=80",


  // ===================================================
  // DEFAULT
  // ===================================================

  default:
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=900&q=80",
};


// =====================================================
// NORMALIZE PRODUCT NAME
// =====================================================

const normalizeProductName = (name = "") => {

  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

};


// =====================================================
// GET CORRECT IMAGE FOR PRODUCT
// =====================================================

const getProductImage = (product, API_URL) => {

  const databaseImage =
    product?.image;


  // ===================================================
  // USE DATABASE IMAGE FIRST
  // ===================================================

  if (
    databaseImage &&
    String(databaseImage).trim() !== "" &&
    String(databaseImage).trim() !== "null" &&
    String(databaseImage).trim() !== "undefined"
  ) {

    const image =
      String(databaseImage).trim();


    // Already a complete URL

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }


    // Backend upload path

    if (
      image.startsWith("/uploads/")
    ) {
      return `${API_URL}${image}`;
    }


    // uploads/image.jpg

    if (
      image.startsWith("uploads/")
    ) {
      return `${API_URL}/${image}`;
    }


    // Just filename

    return `${API_URL}/uploads/${image}`;
  }


  // ===================================================
  // PRODUCT NAME IMAGE MATCHING
  // ===================================================

  const productName =
    normalizeProductName(
      product?.name || ""
    );


  // Exact match

  if (
    productImages[productName]
  ) {
    return productImages[productName];
  }


  // ===================================================
  // KEYWORD MATCHING
  // ===================================================

  if (productName.includes("paneer")) {
    return productImages.paneer;
  }

  if (
    productName.includes("milkshake") ||
    productName.includes("shake")
  ) {
    return productImages.milkshake;
  }

  if (
    productName.includes("sweetlassi") ||
    productName.includes("lassi")
  ) {
    return productImages.lassi;
  }

  if (
    productName.includes("buttermilk") ||
    productName.includes("chaas")
  ) {
    return productImages.buttermilk;
  }

  if (
    productName.includes("rabri") ||
    productName.includes("rabdi")
  ) {
    return productImages.rabri;
  }

  if (productName.includes("kulfi")) {
    return productImages.kulfi;
  }

  if (
    productName.includes("khoa") ||
    productName.includes("khoya") ||
    productName.includes("mawa")
  ) {
    return productImages.khoa;
  }

  if (productName.includes("ghee")) {
    return productImages.ghee;
  }

  if (productName.includes("butter")) {
    return productImages.butter;
  }

  if (
    productName.includes("curd") ||
    productName.includes("dahi")
  ) {
    return productImages.curd;
  }

  if (productName.includes("yogurt")) {
    return productImages.yogurt;
  }

  if (
    productName.includes("cheese") ||
    productName.includes("mozzarella") ||
    productName.includes("cheddar")
  ) {
    return productImages.cheese;
  }

  if (productName.includes("cream")) {
    return productImages.cream;
  }

  if (productName.includes("icecream")) {
    return productImages.icecream;
  }

  if (productName.includes("kheer")) {
    return productImages.kheer;
  }

  if (productName.includes("basundi")) {
    return productImages.basundi;
  }

  if (productName.includes("milk")) {
    return productImages.milk;
  }


  return productImages.default;
};


// =====================================================
// PRODUCTS COMPONENT
// =====================================================

function Products() {


  const navigate =
    useNavigate();


  const API_URL =
    process.env.REACT_APP_API_URL ||
    "https://diary-88q0.onrender.com";


  // ===================================================
  // STATES
  // ===================================================

  const [products, setProducts] =
    useState([]);


  const [loading, setLoading] =
    useState(true);


  const [error, setError] =
    useState("");


  const [addingProductId, setAddingProductId] =
    useState(null);


  // ===================================================
  // FETCH PRODUCTS
  // ===================================================

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


        let productList = [];


        if (
          Array.isArray(response.data)
        ) {

          productList =
            response.data;

        } else if (
          Array.isArray(
            response.data?.products
          )
        ) {

          productList =
            response.data.products;

        }


        setProducts(
          productList
        );


      } catch (error) {

        console.error(
          "FETCH PRODUCTS ERROR:",
          error
        );


        setError(

          error.response?.data?.message ||

          "Failed to load products"

        );


      } finally {

        setLoading(false);

      }

    }, [
      API_URL,
    ]);


  // ===================================================
  // LOAD PRODUCTS
  // ===================================================

  useEffect(() => {

    fetchProducts();

  }, [
    fetchProducts,
  ]);


  // ===================================================
  // ADD TO CART
  // ===================================================

  const handleAddToCart =
    async (productId) => {

      try {

        const token =
          localStorage.getItem("token");


        if (!token) {

          alert(
            "Please login first"
          );

          navigate("/login");

          return;

        }


        setAddingProductId(
          productId
        );


        console.log(
          "ADDING PRODUCT:",
          productId
        );


        const response =
          await axios.post(

            `${API_URL}/api/cart`,

            {
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
          "ADD TO CART RESPONSE:",
          response.data
        );


        if (
          response.data?.success
        ) {

          alert(
            "Product added to cart successfully!"
          );

        } else {

          alert(

            response.data?.message ||

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

          alert(
            "Your login session has expired. Please login again."
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

        setAddingProductId(null);

      }

    };


  // ===================================================
  // LOGOUT
  // ===================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "token"
    );


    localStorage.removeItem(
      "user"
    );


    navigate(
      "/login"
    );

  };


  // ===================================================
  // IMAGE ERROR HANDLER
  // ===================================================

  const handleImageError =
    (event) => {

      event.currentTarget.src =
        productImages.default;

    };


  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (

      <div
        style={{
          minHeight: "100vh",
          background:
            "#f5f7f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >

        Loading products...

      </div>

    );

  }


  // ===================================================
  // MAIN UI
  // ===================================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f4f8f4, #eef3ee)",
        padding: "30px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >


      {/* ============================================= */}
      {/* NAVBAR */}
      {/* ============================================= */}

      <div
        style={{
          background:
            "#ffffff",

          padding:
            "18px 25px",

          borderRadius:
            "15px",

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
            "30px",

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.08)",
        }}
      >


        <div>

          <h2
            style={{
              margin: 0,
              color:
                "#2f5d3a",
            }}
          >

            🌿 HARI FARMS

          </h2>

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
                "/user-dashboard"
              )
            }
            style={navButtonStyle}
          >

            Dashboard

          </button>


          <button
            onClick={() =>
              navigate(
                "/orders"
              )
            }
            style={navButtonStyle}
          >

            📦 My Orders

          </button>


          <button
            onClick={() =>
              navigate(
                "/cart"
              )
            }
            style={cartButtonStyle}
          >

            🛒 Cart

          </button>


          <button
            onClick={
              handleLogout
            }
            style={logoutButtonStyle}
          >

            Logout

          </button>


        </div>


      </div>


      {/* ============================================= */}
      {/* HEADER */}
      {/* ============================================= */}

      <div
        style={{
          marginBottom:
            "30px",
        }}
      >

        <h1
          style={{
            color:
              "#263238",

            marginBottom:
              "8px",
          }}
        >

          🥛 Fresh Dairy Products

        </h1>


        <p
          style={{
            color:
              "#666",

            fontSize:
              "16px",
          }}
        >

          Fresh and quality dairy products from HARI FARMS.

        </p>

      </div>


      {/* ============================================= */}
      {/* ERROR */}
      {/* ============================================= */}

      {

        error && (

          <div
            style={{
              background:
                "#fff3f3",

              color:
                "#d32f2f",

              padding:
                "18px",

              borderRadius:
                "12px",

              marginBottom:
                "20px",
            }}
          >

            {error}

          </div>

        )

      }


      {/* ============================================= */}
      {/* EMPTY PRODUCTS */}
      {/* ============================================= */}

      {

        !error &&
        products.length === 0 && (

          <div
            style={{
              background:
                "#ffffff",

              padding:
                "40px",

              borderRadius:
                "15px",

              textAlign:
                "center",
            }}
          >

            <h3>
              No products available
            </h3>

          </div>

        )

      }


      {/* ============================================= */}
      {/* PRODUCT GRID */}
      {/* ============================================= */}

      <div
        style={{
          display:
            "grid",

          gridTemplateColumns:
            "repeat(auto-fill, minmax(260px, 1fr))",

          gap:
            "25px",
        }}
      >


        {

          products.map(
            (product) => {

              const imageUrl =
                getProductImage(
                  product,
                  API_URL
                );


              return (

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
                      "0 5px 18px rgba(0,0,0,0.12)",

                    transition:
                      "transform 0.2s ease",

                    display:
                      "flex",

                    flexDirection:
                      "column",
                  }}

                  onMouseEnter={
                    (event) => {

                      event.currentTarget.style.transform =
                        "translateY(-5px)";

                    }
                  }

                  onMouseLeave={
                    (event) => {

                      event.currentTarget.style.transform =
                        "translateY(0px)";

                    }
                  }

                >


                  {/* ================================= */}
                  {/* PRODUCT IMAGE */}
                  {/* ================================= */}

                  <div
                    style={{
                      width:
                        "100%",

                      height:
                        "210px",

                      overflow:
                        "hidden",

                      background:
                        "#f0f0f0",
                    }}
                  >

                    <img

                      src={
                        imageUrl
                      }

                      alt={
                        product.name ||
                        "Dairy Product"
                      }

                      onError={
                        handleImageError
                      }

                      style={{
                        width:
                          "100%",

                        height:
                          "100%",

                        objectFit:
                          "cover",

                        display:
                          "block",
                      }}

                    />

                  </div>


                  {/* ================================= */}
                  {/* PRODUCT DETAILS */}
                  {/* ================================= */}

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


                    <h3
                      style={{
                        margin:
                          "0 0 12px 0",

                        color:
                          "#263238",

                        fontSize:
                          "20px",
                      }}
                    >

                      {
                        product.name
                      }

                    </h3>


                    <p
                      style={{
                        color:
                          "#666",

                        minHeight:
                          "45px",

                        margin:
                          "0 0 15px 0",

                        lineHeight:
                          "1.5",
                      }}
                    >

                      {

                        product.description ||

                        "Fresh dairy product from HARI FARMS."

                      }

                    </p>


                    {/* PRICE */}

                    <h2
                      style={{
                        margin:
                          "5px 0",

                        color:
                          "#1f2937",

                        fontSize:
                          "24px",
                      }}
                    >

                      ₹{
                        Number(
                          product.price || 0
                        ).toFixed(2)
                      }

                    </h2>


                    {/* UNIT */}

                    <p
                      style={{
                        color:
                          "#777",

                        margin:
                          "8px 0",
                      }}
                    >

                      {
                        product.unit ||
                        ""
                      }

                    </p>


                    {/* STOCK */}

                    <p
                      style={{
                        fontWeight:
                          "600",

                        color:

                          Number(
                            product.stock
                          ) > 0

                            ? "#2f5d3a"

                            : "#d32f2f",

                        marginBottom:
                          "18px",
                      }}
                    >

                      Stock: {
                        product.stock ?? 0
                      }

                    </p>


                    {/* ADD TO CART */}

                    <button

                      disabled={

                        Number(
                          product.stock
                        ) <= 0 ||

                        addingProductId ===
                        product.id

                      }

                      onClick={() =>
                        handleAddToCart(
                          product.id
                        )
                      }

                      style={{
                        marginTop:
                          "auto",

                        width:
                          "100%",

                        padding:
                          "14px",

                        border:
                          "none",

                        borderRadius:
                          "10px",

                        fontSize:
                          "16px",

                        fontWeight:
                          "700",

                        cursor:

                          Number(
                            product.stock
                          ) <= 0

                            ? "not-allowed"

                            : "pointer",

                        background:

                          Number(
                            product.stock
                          ) <= 0

                            ? "#cccccc"

                            : "#2f5d3a",

                        color:
                          "#ffffff",

                        opacity:

                          addingProductId ===
                          product.id

                            ? 0.7

                            : 1,
                      }}
                    >

                      {

                        addingProductId ===
                        product.id

                          ? "Adding..."

                          : Number(
                              product.stock
                            ) <= 0

                            ? "Out of Stock"

                            : "🛒 Add to Cart"

                      }

                    </button>


                  </div>


                </div>

              );

            }

          )

        }


      </div>


    </div>

  );

}


// =====================================================
// BUTTON STYLES
// =====================================================

const navButtonStyle = {

  padding:
    "10px 16px",

  border:
    "none",

  borderRadius:
    "8px",

  background:
    "#e8f1e8",

  color:
    "#2f5d3a",

  fontWeight:
    "600",

  cursor:
    "pointer",

};


const cartButtonStyle = {

  padding:
    "10px 16px",

  border:
    "none",

  borderRadius:
    "8px",

  background:
    "#2f5d3a",

  color:
    "#ffffff",

  fontWeight:
    "600",

  cursor:
    "pointer",

};


const logoutButtonStyle = {

  padding:
    "10px 16px",

  border:
    "none",

  borderRadius:
    "8px",

  background:
    "#dc3545",

  color:
    "#ffffff",

  fontWeight:
    "600",

  cursor:
    "pointer",

};


export default Products;