"use client";
import React, { useState } from "react";

export default function OrderStatus({ apiClient }) {
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const checkStatus = async () => {
    if (!orderId) return setError("Please enter an Order ID");
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await apiClient.get(`/data/order/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Order status fetch error:", err);
      setError("Failed to fetch order status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complete") || s.includes("filled") || s.includes("done")) return "#0f9d58"; // green
    if (s.includes("pending") || s.includes("rejected") || s.includes("failed")) return "#db4437"; // red
    return "#555"; // neutral
  };

  return (
    <div style={card}>
      <h3 style={title}>🔍 Order Status</h3>

      <div style={inputContainer}>
        <input
          type="text"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          placeholder="Enter Order ID"
          style={input}
        />
        <button style={button} onClick={checkStatus}>
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && <p style={errorText}>{error}</p>}

      {order && (
        <div style={orderCard}>
          <span style={orderSymbol}>{order.tradingsymbol || order.name}</span>
          <span style={{ ...orderStatus, color: getStatusColor(order.status) }}>
            {order.status}
          </span>
          <span style={orderQty}>Qty: {order.quantity}</span>
          <pre style={orderJson}>{JSON.stringify(order, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

/* --- Styles --- */
const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const title = {
  fontSize: "1.5rem",
  fontWeight: "700",
  marginBottom: "15px",
  color: "#1a3b8b",
};

const inputContainer = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const input = {
  flex: 1,
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const button = {
  padding: "10px 20px",
  background: "#1a3b8b",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "600",
};

const errorText = {
  color: "red",
  fontWeight: "600",
};

const orderCard = {
  background: "#f1f5ff",
  padding: "15px",
  borderRadius: "10px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  fontWeight: "600",
};

const orderSymbol = {
  color: "#333",
  fontSize: "1.1rem",
};

const orderStatus = {
  fontWeight: "700",
};

const orderQty = {
  color: "#1a3b8b",
};

const orderJson = {
  background: "#e5e5e5",
  padding: "10px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  overflowX: "auto",
};
