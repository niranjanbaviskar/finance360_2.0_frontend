"use client";
import React, { useEffect, useState } from "react";

export default function Positions({ apiClient }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiClient) return;

    const fetchPositions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get("/data/positions"); // ✅ correct endpoint
        if (res.data?.success) {
          setPositions(res.data.data || []);
        } else {
          setError(res.data?.error || "Unexpected response from server");
        }
      } catch (err) {
        console.error("Positions fetch error:", err);
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login first.");
        } else {
          setError("Failed to fetch positions");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, [apiClient]);

  const getPnlColor = (pnl) => {
    if (!pnl) return "#555";
    return pnl >= 0 ? "#0f9d58" : "#db4437"; // green for profit, red for loss
  };

  return (
    <div style={card}>
      <h3 style={title}>📌 Positions</h3>

      {loading && <p style={infoText}>Loading positions...</p>}
      {error && <p style={errorText}>{error}</p>}
      {!loading && positions.length === 0 && !error && (
        <p style={infoText}>No open positions available.</p>
      )}

      {!loading && positions.length > 0 && (
        <div style={positionContainer}>
          {positions.map((p, idx) => (
            <div key={idx} style={positionItem}>
              <span style={symbol}>{p.tradingsymbol || p.name}</span>
              <span style={netQty}>Net Qty: {p.netqty || p.quantity || 0}</span>
              <span style={{ ...pnl, color: getPnlColor(p.pnl) }}>
                PnL: {p.pnl || 0}
              </span>
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

const positionContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const positionItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 15px",
  background: "#f1f5ff",
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

const netQty = {
  flex: 1,
  color: "#1a3b8b",
  fontWeight: "600",
  textAlign: "center",
};

const pnl = {
  flex: 1,
  fontWeight: "700",
  textAlign: "right",
};
