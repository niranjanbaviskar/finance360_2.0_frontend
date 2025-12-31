"use client";
import React, { useEffect, useState } from "react";

export default function Funds({ apiClient }) {
  const [funds, setFunds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const res = await apiClient.get("/data/funds");
        setFunds(res.data.data || {});
      } catch (err) {
        console.error("Funds fetch error:", err);
        setError("Failed to fetch funds");
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, []);

  return (
    <div style={card}>
      <h3 style={title}>💰 Funds & Margin</h3>

      {loading && <p style={infoText}>Loading funds...</p>}
      {error && <p style={errorText}>{error}</p>}

      {!loading && !error && (
        <div style={fundContainer}>
          <div style={fundItem}>
            <span style={label}>Available Cash:</span>
            <span style={value}>₹{funds.availablecash || 0}</span>
          </div>
          <div style={fundItem}>
            <span style={label}>Used Margin:</span>
            <span style={value}>₹{funds.usedmargin || 0}</span>
          </div>
          <div style={fundItem}>
            <span style={label}>Net Worth:</span>
            <span style={value}>₹{funds.net || 0}</span>
          </div>
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

const fundContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const fundItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 15px",
  background: "#f1f5ff",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "1rem",
};

const label = {
  color: "#333",
};

const value = {
  color: "#1a3b8b",
  fontWeight: "700",
};
