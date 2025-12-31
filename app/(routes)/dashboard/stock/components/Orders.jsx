"use client";
import React, { useEffect, useState } from "react";

export default function Orders({ apiClient }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get("/data/orders");
        setOrders(res.data.data || []);
      } catch (err) {
        console.error("Orders fetch error:", err);
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [apiClient]);

  const getStatusColor = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complete") || s.includes("filled") || s.includes("done"))
      return "#0f9d58"; // green
    if (s.includes("pending") || s.includes("rejected") || s.includes("failed"))
      return "#db4437"; // red
    return "#555"; // neutral
  };

  const getBackground = (status) => {
    const s = status?.toLowerCase() || "";
    if (s.includes("complete") || s.includes("filled") || s.includes("done"))
      return "#e6f4ea"; // light green for completed
    if (s.includes("pending"))
      return "#fff8e1"; // light yellow for pending
    return "#f1f5ff"; // default
  };

  return (
    <div style={card}>
      <h3 style={title}>📑 Orders</h3>

      {loading && <p style={infoText}>Loading orders...</p>}
      {error && <p style={errorText}>{error}</p>}
      {!loading && orders.length === 0 && !error && <p style={infoText}>No orders available</p>}

      {!loading && orders.length > 0 && (
        <div style={orderContainer}>
          {orders.map((o, idx) => (
            <div key={idx} style={{ ...orderItem, background: getBackground(o.status) }}>
              <span style={symbol}>{o.tradingsymbol || o.name}</span>
              <span style={txnType}>{o.transactiontype}</span>
              <span style={{ ...status, color: getStatusColor(o.status) }}>{o.status}</span>
              <span style={qty}>Qty: {o.quantity}</span>
            </div>
          ))}
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

const infoText = {
  color: "#555",
  fontWeight: "500",
};

const errorText = {
  color: "red",
  fontWeight: "600",
};

const orderContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const orderItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 15px",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "1rem",
  flexWrap: "wrap",
};

const symbol = {
  flex: 2,
  color: "#333",
  fontWeight: "600",
};

const txnType = {
  flex: 1,
  color: "#1a3b8b",
  fontWeight: "600",
  textAlign: "center",
};

const status = {
  flex: 1,
  fontWeight: "700",
  textAlign: "center",
};

const qty = {
  flex: 1,
  color: "#555",
  fontWeight: "600",
  textAlign: "right",
};
