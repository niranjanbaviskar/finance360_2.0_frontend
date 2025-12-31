"use client";
import React, { useEffect, useState } from "react";

export default function Trades({ apiClient }) {
  const [trades, setTrades] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await apiClient.get("/data/trades");
        setTrades(res.data.data || []);
      } catch (err) {
        setError("Failed to fetch trades");
      }
    };
    fetchTrades();
  }, []);

  return (
    <div style={card}>
      <h3 style={title}>💹 Trades (Today)</h3>
      {error && <p style={errorText}>{error}</p>}
      <ul>
        {trades.map((t, idx) => (
          <li key={idx} style={listItem}>
            {t.tradingsymbol} – {t.transactiontype} – Qty: {t.quantity} @ {t.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

const card = { background: "#fff", padding: "20px", borderRadius: "15px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" };
const title = { fontSize: "1.4rem", fontWeight: "700", marginBottom: "10px" };
const errorText = { color: "red" };
const listItem = { margin: "8px 0" };
