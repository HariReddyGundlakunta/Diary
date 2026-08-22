import React from "react";

function MyOrders() {

  const orders =
    JSON.parse(
      localStorage.getItem("orders")
    ) || [];

  if (orders.length === 0) {
    return (
      <div style={styles.empty}>
        <h1>📦 My Orders</h1>
        <p>You haven't placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      <h1>📦 My Orders</h1>

      {orders
        .slice()
        .reverse()
        .map((order) => (

          <div
            key={order.id}
            style={styles.order}
          >

            <div style={styles.header}>

              <div>
                <h3>
                  Order #{order.id}
                </h3>

                <p>{order.date}</p>
              </div>

              <strong style={styles.status}>
                {order.status}
              </strong>

            </div>

            <hr />

            {order.products.map((product) => (

              <div
                key={product.id}
                style={styles.product}
              >

                <span>
                  {product.emoji}{" "}
                  {product.name}
                </span>

                <span>
                  × {product.quantity}
                </span>

                <span>
                  ₹
                  {product.price *
                    product.quantity}
                </span>

              </div>

            ))}

            <hr />

            <h3>
              Total: ₹{order.total}
            </h3>

            <p>
              Payment: {order.payment}
            </p>

            <p>
              Delivery:{" "}
              {order.address.address},{" "}
              {order.address.city} -{" "}
              {order.address.pincode}
            </p>

          </div>

        ))}

    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "auto",
    padding: "40px",
  },

  order: {
    background: "white",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow:
      "0 4px 15px rgba(0,0,0,0.1)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  status: {
    color: "#2e7d32",
  },

  product: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
  },

  empty: {
    textAlign: "center",
    padding: "100px",
  },
};

export default MyOrders;