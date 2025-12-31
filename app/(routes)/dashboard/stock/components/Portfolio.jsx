"use client";
import React, { useEffect, useState } from "react";

export default function Portfolio({ apiClient }) {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔹 Load from localStorage instantly (cached data)
    const cached = localStorage.getItem("holdings");
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) setHoldings(parsed);
      } catch {
        console.warn("Invalid holdings cache");
      }
    }

    const fetchHoldings = async () => {
      // 🔹 Prevent fetching if apiClient not ready
      if (!apiClient || !apiClient.get) return;

      setLoading(true);
      setError("");

      try {
        const res = await apiClient.get("/data/holdings");
        const apiData = res.data;

        const holdingsArray = Array.isArray(apiData?.data)
          ? apiData.data
          : [];

        if (holdingsArray.length > 0) {
          setHoldings(holdingsArray);
          localStorage.setItem("holdings", JSON.stringify(holdingsArray)); // ✅ cache
        } else {
          setError("No holdings available");
        }
      } catch (err) {
        console.error("Holdings fetch error:", err);
        setError("Failed to fetch holdings");
      } finally {
        setLoading(false);
      }
    };

    // 🔹 Add slight delay to ensure token/apiClient is ready
    const timer = setTimeout(fetchHoldings, 300);

    return () => clearTimeout(timer);
  }, [apiClient]);

  const getPriceColor = (buyPrice, currentPrice) => {
    if (currentPrice > buyPrice) return "#0f9d58";
    if (currentPrice < buyPrice) return "#db4437";
    return "#555";
  };

  const getPnl = (buyPrice, currentPrice, quantity) =>
    ((currentPrice - buyPrice) * quantity).toFixed(2);

  // 🔹 Portfolio summary
  const totalInvestment = holdings.reduce(
    (sum, h) => sum + (Number(h.averageprice) || 0) * (Number(h.quantity) || 0),
    0
  );
  const totalCurrentValue = holdings.reduce(
    (sum, h) =>
      sum +
      (Number(h.ltp) ||
        Number(h.lastprice) ||
        Number(h.close) ||
        0) *
        (Number(h.quantity) || 0),
    0
  );
  const totalPnl = (totalCurrentValue - totalInvestment).toFixed(2);
  const pnlColor = totalPnl >= 0 ? "#0f9d58" : "#db4437";

  return (
    <div style={pageWrapper}>
      <div style={card}>
        <h3 style={title}>📊 Portfolio (Holdings)</h3>

        {loading && holdings.length === 0 && (
          <p style={infoText}>Loading holdings...</p>
        )}

        {!loading && error && holdings.length === 0 && (
          <p style={errorText}>{error}</p>
        )}

        {holdings.length > 0 && (
          <>
            {/* 🔹 Summary Card */}
            <div style={summaryCard}>
              <div style={summaryItem}>
                <span style={summaryLabel}>💰 Investment</span>
                <span style={summaryValue}>
                  ₹ {totalInvestment.toFixed(2)}
                </span>
              </div>
              <div style={summaryItem}>
                <span style={summaryLabel}>📈 Current Value</span>
                <span style={summaryValue}>
                  ₹ {totalCurrentValue.toFixed(2)}
                </span>
              </div>
              <div style={summaryItem}>
                <span style={summaryLabel}>📊 Total P&L</span>
                <span style={{ ...summaryValue, color: pnlColor }}>
                  ₹ {totalPnl}
                </span>
              </div>
            </div>

            {/* 🔹 Holdings List */}
            <div style={holdingContainer}>
              {holdings.map((h, idx) => {
                const buyPrice = Number(h.averageprice) || 0;
                const currentPrice =
                  Number(h.ltp) || Number(h.lastprice) || Number(h.close) || 0;
                const quantity = Number(h.quantity) || 0;

                const priceColor = getPriceColor(buyPrice, currentPrice);
                const pnl = getPnl(buyPrice, currentPrice, quantity);
                const pnlColor = pnl >= 0 ? "#0f9d58" : "#db4437";

                return (
                  <div key={idx} style={holdingItem}>
                    <span style={name}>{h.tradingsymbol || h.name}</span>
                    <span style={qty}>Qty: {quantity}</span>
                    <span style={avgPrice}>Buy: ₹ {buyPrice.toFixed(2)}</span>
                    <span style={{ ...avgPrice, color: priceColor }}>
                      Now: ₹ {currentPrice.toFixed(2)}
                    </span>
                    <span style={{ ...avgPrice, color: pnlColor }}>
                      P&L: ₹ {pnl}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* --- Styles --- */
const pageWrapper = {
  display: "flex",
  justifyContent: "center",
  padding: "20px",
  background: "#f9f9f9",
};

const card = {
  background: "#fff",
  padding: "25px",
  borderRadius: "15px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  width: "100%",
  maxWidth: "700px",
};

const title = {
  fontSize: "1.5rem",
  fontWeight: "700",
  marginBottom: "15px",
  color: "#1a3b8b",
  textAlign: "center",
};

const infoText = { color: "#555", fontWeight: "500", textAlign: "center" };
const errorText = { color: "red", fontWeight: "600", textAlign: "center" };

const summaryCard = {
  display: "flex",
  justifyContent: "space-around",
  background: "#eef4ff",
  borderRadius: "12px",
  padding: "15px",
  fontWeight: "600",
  gap: "10px",
};

const summaryItem = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  minWidth: "100px",
};

const summaryLabel = { fontSize: "0.9rem", color: "#555" };
const summaryValue = { fontSize: "1.2rem", fontWeight: "700", color: "#1a3b8b" };

const holdingContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  width: "100%",
};

const holdingItem = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 18px",
  background: "#f1f5ff",
  borderRadius: "10px",
  fontWeight: "600",
  fontSize: "0.95rem",
  flexWrap: "wrap",
};

const qty = { color: "#1a3b8b", fontWeight: "700", marginLeft: "10px" };
const name = { color: "#333", fontWeight: "600", flex: 1 };
const avgPrice = { color: "#555", marginLeft: "10px" };
