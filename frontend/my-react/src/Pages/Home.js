import React from "react";
import { Link } from "react-router-dom";


function Home() {

  return (

    <div style={styles.page}>

      {/* ================================
          NAVBAR
      ================================= */}

      <nav style={styles.navbar}>

        <Link
          to="/home"
          style={styles.logo}
        >

          <span style={styles.logoIcon}>
            🥛
          </span>

          <span>
            HARI FARMS
          </span>

        </Link>


        <div style={styles.navLinks}>

          <Link
            to="/home"
            style={styles.navLink}
          >
            Home
          </Link>


          <Link
            to="/login"
            style={styles.navLink}
          >
            Login
          </Link>


          <Link
            to="/register"
            style={styles.registerButton}
          >
            Register
          </Link>

        </div>

      </nav>


      {/* ================================
          HERO
      ================================= */}

      <section style={styles.hero}>

        <div style={styles.heroContent}>

          <div style={styles.badge}>
            🌿 Fresh From Our Farm
          </div>


          <h1 style={styles.heroTitle}>

            Fresh Milk &

            <br />

            <span style={styles.greenText}>
              Dairy Products
            </span>

          </h1>


          <p style={styles.heroDescription}>

            Fresh, healthy and quality dairy
            products delivered directly from
            HARI FARMS to your doorstep.

          </p>


          {/* SHOP NOW → ADMIN DASHBOARD */}

          <Link
            to="/admin-dashboard"
            style={styles.shopButton}
          >

            <span>
              Shop Now
            </span>

            <span style={styles.arrow}>
              →
            </span>

          </Link>


          <div style={styles.trustText}>

            ✓ Fresh
            &nbsp;&nbsp;&nbsp;

            ✓ Natural
            &nbsp;&nbsp;&nbsp;

            ✓ Trusted

          </div>

        </div>


        {/* ================================
            HERO IMAGE AREA
        ================================= */}

        <div style={styles.heroVisual}>

          <div style={styles.glow}></div>


          <div style={styles.milkCircle}>

            <div style={styles.milkBottle}>
              🥛
            </div>

          </div>


          <div style={styles.floatingCard}>

            <div style={styles.floatingIcon}>
              🐄
            </div>

            <div>

              <strong>
                HARI FARMS
              </strong>

              <p style={styles.floatingText}>
                Pure & Fresh
              </p>

            </div>

          </div>


          <div style={styles.leafOne}>
            🌿
          </div>

          <div style={styles.leafTwo}>
            🍃
          </div>

        </div>

      </section>


      {/* ================================
          WHY CHOOSE US
      ================================= */}

      <section style={styles.whySection}>

        <div style={styles.sectionHeader}>

          <p style={styles.sectionSmallTitle}>
            WHY HARI FARMS?
          </p>

          <h2 style={styles.sectionTitle}>
            Why Choose HARI FARMS?
          </h2>

          <p style={styles.sectionDescription}>
            We bring quality dairy products
            from our farm directly to your family.
          </p>

        </div>


        <div style={styles.features}>

          <div style={styles.featureCard}>

            <div style={styles.featureIcon}>
              🥛
            </div>

            <h3 style={styles.featureTitle}>
              Fresh Milk
            </h3>

            <p style={styles.featureText}>
              Enjoy fresh and nutritious milk
              produced with care every day.
            </p>

          </div>


          <div style={styles.featureCard}>

            <div style={styles.featureIcon}>
              🌱
            </div>

            <h3 style={styles.featureTitle}>
              100% Natural
            </h3>

            <p style={styles.featureText}>
              Quality dairy products made with
              natural ingredients and care.
            </p>

          </div>


          <div style={styles.featureCard}>

            <div style={styles.featureIcon}>
              🚚
            </div>

            <h3 style={styles.featureTitle}>
              Fast Delivery
            </h3>

            <p style={styles.featureText}>
              Get your favorite dairy products
              delivered conveniently to your door.
            </p>

          </div>


          <div style={styles.featureCard}>

            <div style={styles.featureIcon}>
              ❤️
            </div>

            <h3 style={styles.featureTitle}>
              Trusted Quality
            </h3>

            <p style={styles.featureText}>
              We focus on quality, freshness
              and customer satisfaction.
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          PRODUCT PREVIEW
      ================================= */}

      <section style={styles.productSection}>

        <div style={styles.productHeader}>

          <div>

            <p style={styles.sectionSmallTitle}>
              OUR PRODUCTS
            </p>

            <h2 style={styles.productTitle}>
              Farm Fresh Favorites
            </h2>

          </div>


          <Link
            to="/products"
            style={styles.viewProducts}
          >
            View Products →
          </Link>

        </div>


        <div style={styles.productCards}>

          <div style={styles.productCard}>

            <div style={styles.productEmoji}>
              🥛
            </div>

            <h3>
              Fresh Milk
            </h3>

            <p>
              Pure farm fresh milk
            </p>

          </div>


          <div style={styles.productCard}>

            <div style={styles.productEmoji}>
              🧈
            </div>

            <h3>
              Fresh Butter
            </h3>

            <p>
              Creamy and delicious
            </p>

          </div>


          <div style={styles.productCard}>

            <div style={styles.productEmoji}>
              🧀
            </div>

            <h3>
              Cheese
            </h3>

            <p>
              Quality dairy cheese
            </p>

          </div>


          <div style={styles.productCard}>

            <div style={styles.productEmoji}>
              🍶
            </div>

            <h3>
              Curd
            </h3>

            <p>
              Fresh and healthy curd
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          CTA
      ================================= */}

      <section style={styles.cta}>

        <div>

          <h2 style={styles.ctaTitle}>
            Taste the Freshness of HARI FARMS
          </h2>

          <p style={styles.ctaText}>
            Quality dairy products made with
            care for your family.
          </p>

        </div>


        <Link
          to="/admin-dashboard"
          style={styles.ctaButton}
        >
          Get Started →
        </Link>

      </section>


      {/* ================================
          FOOTER
      ================================= */}

      <footer style={styles.footer}>

        <div style={styles.footerLogo}>
          🥛 HARI FARMS
        </div>

        <p style={styles.footerText}>
          Fresh From Farm • Pure For Family
        </p>

        <div style={styles.footerLinks}>

          <Link
            to="/home"
            style={styles.footerLink}
          >
            Home
          </Link>

          <Link
            to="/login"
            style={styles.footerLink}
          >
            Login
          </Link>

          <Link
            to="/register"
            style={styles.footerLink}
          >
            Register
          </Link>

        </div>

        <p style={styles.copyright}>
          © 2026 HARI FARMS. All rights reserved.
        </p>

      </footer>

    </div>
  );
}


const styles = {

  page: {
    minHeight: "100vh",
    background: "#f8fcf8",
    fontFamily:
      "'Segoe UI', Arial, sans-serif",
    color: "#26352a",
  },

  navbar: {
    height: "68px",
    background: "#2e7d32",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 40px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100,
    boxShadow:
      "0 3px 15px rgba(0,0,0,0.12)",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "23px",
    fontWeight: "800",
    letterSpacing: "1px",
  },

  logoIcon: {
    fontSize: "25px",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "30px",
  },

  navLink: {
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
  },

  registerButton: {
    color: "#2e7d32",
    background: "#ffffff",
    textDecoration: "none",
    padding: "10px 20px",
    borderRadius: "22px",
    fontSize: "14px",
    fontWeight: "700",
  },

  hero: {
    minHeight: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "70px 8%",
    boxSizing: "border-box",
    background:
      "linear-gradient(120deg,#edf8ee,#ffffff)",
    overflow: "hidden",
  },

  heroContent: {
    maxWidth: "600px",
  },

  badge: {
    display: "inline-block",
    background: "#e0f2e3",
    color: "#2e7d32",
    padding: "9px 16px",
    borderRadius: "25px",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "20px",
  },

  heroTitle: {
    fontSize: "52px",
    lineHeight: "1.15",
    margin: "0 0 22px",
    color: "#245b29",
    fontWeight: "800",
  },

  greenText: {
    color: "#2e7d32",
  },

  heroDescription: {
    fontSize: "18px",
    lineHeight: "1.7",
    color: "#657268",
    maxWidth: "590px",
    marginBottom: "30px",
  },

  shopButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "15px",
    background:
      "linear-gradient(135deg,#2e7d32,#43a047)",
    color: "#ffffff",
    textDecoration: "none",
    padding: "15px 27px",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "700",
    boxShadow:
      "0 8px 20px rgba(46,125,50,0.25)",
  },

  arrow: {
    fontSize: "21px",
  },

  trustText: {
    marginTop: "20px",
    color: "#718078",
    fontSize: "13px",
    fontWeight: "600",
  },

  heroVisual: {
    width: "400px",
    height: "380px",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  glow: {
    position: "absolute",
    width: "320px",
    height: "320px",
    borderRadius: "50%",
    background:
      "rgba(165,214,167,0.28)",
  },

  milkCircle: {
    width: "250px",
    height: "250px",
    borderRadius: "50%",
    background:
      "linear-gradient(145deg,#ffffff,#e8f5e9)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow:
      "0 20px 50px rgba(46,125,50,0.15)",
    position: "relative",
    zIndex: 2,
  },

  milkBottle: {
    fontSize: "115px",
  },

  floatingCard: {
    position: "absolute",
    right: "0",
    bottom: "35px",
    background: "#ffffff",
    padding: "15px 20px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.12)",
    zIndex: 4,
  },

  floatingIcon: {
    fontSize: "32px",
  },

  floatingText: {
    margin: "4px 0 0",
    fontSize: "12px",
    color: "#78857b",
  },

  leafOne: {
    position: "absolute",
    top: "25px",
    left: "40px",
    fontSize: "35px",
  },

  leafTwo: {
    position: "absolute",
    bottom: "45px",
    left: "20px",
    fontSize: "28px",
  },

  whySection: {
    padding: "70px 8%",
    background: "#ffffff",
  },

  sectionHeader: {
    textAlign: "center",
    marginBottom: "40px",
  },

  sectionSmallTitle: {
    color: "#43a047",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "2px",
    margin: "0 0 8px",
  },

  sectionTitle: {
    fontSize: "32px",
    color: "#205b26",
    margin: "0 0 10px",
  },

  sectionDescription: {
    color: "#7a867e",
    fontSize: "15px",
  },

  features: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: "20px",
  },

  featureCard: {
    textAlign: "center",
    padding: "30px 22px",
    borderRadius: "18px",
    background: "#f8fcf8",
    border: "1px solid #e4eee5",
  },

  featureIcon: {
    width: "65px",
    height: "65px",
    margin: "0 auto 18px",
    borderRadius: "18px",
    background: "#e8f5e9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "31px",
  },

  featureTitle: {
    color: "#28672e",
    margin: "0 0 10px",
    fontSize: "18px",
  },

  featureText: {
    color: "#7a867e",
    lineHeight: "1.6",
    fontSize: "13px",
  },

  productSection: {
    padding: "65px 8%",
    background: "#f5faf5",
  },

  productHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  productTitle: {
    margin: 0,
    color: "#205b26",
    fontSize: "29px",
  },

  viewProducts: {
    color: "#2e7d32",
    textDecoration: "none",
    fontWeight: "700",
  },

  productCards: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4,1fr)",
    gap: "20px",
  },

  productCard: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "25px",
    textAlign: "center",
    boxShadow:
      "0 7px 25px rgba(0,0,0,0.06)",
  },

  productEmoji: {
    fontSize: "55px",
  },

  cta: {
    margin: "50px 8%",
    padding: "40px 45px",
    borderRadius: "22px",
    background:
      "linear-gradient(135deg,#1b5e20,#43a047)",
    color: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  ctaTitle: {
    margin: "0 0 8px",
    fontSize: "27px",
  },

  ctaText: {
    margin: 0,
    opacity: 0.85,
  },

  ctaButton: {
    background: "#ffffff",
    color: "#2e7d32",
    padding: "13px 23px",
    borderRadius: "10px",
    textDecoration: "none",
    fontWeight: "700",
  },

  footer: {
    background: "#173d1b",
    color: "#ffffff",
    textAlign: "center",
    padding: "40px 20px",
  },

  footerLogo: {
    fontSize: "23px",
    fontWeight: "800",
  },

  footerText: {
    color: "#b9cbbd",
  },

  footerLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "25px",
    margin: "20px 0",
  },

  footerLink: {
    color: "#ffffff",
    textDecoration: "none",
  },

  copyright: {
    color: "#91a595",
    fontSize: "12px",
  },

};

export default Home;