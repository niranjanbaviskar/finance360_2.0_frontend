"use client";
import React, { useState } from "react";
import axios from "axios";

// Existing
import Portfolio from "./components/Portfolio";
import Orders from "./components/Orders";
import Positions from "./components/Positions";
import MarketFeed from "./components/MarketFeed";

// New
import Funds from "./components/Funds";
// import Margins from "./components/MarginCalculator";
import OrderStatus from "./components/OrderStatus";
import Trades from "./components/Trades";


const apiClient = axios.create({ baseURL: "http://localhost:5000/api" });

export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post("/auth/login", { otp });
      if (res.data.success) setIsLoggedIn(true);
      else setError(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div style={loginContainer}>
        <div style={loginCard}>
          <h2 style={loginTitle}>Connect Angel One</h2>
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            style={loginInput}
          />
          <button style={loginButton} onClick={handleLogin} disabled={loading}>
            {loading ? "Connecting..." : "Connect"}
          </button>
          {error && <p style={errorText}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={dashboardContainer}>
      {/* Left: MarketFeed */}
       <div style={leftPane}>
        
          <MarketFeed />
       
       
          <OrderStatus apiClient={apiClient} />
          <Trades apiClient={apiClient} />
       
      </div>
      {/* Right: Trading Data */}
      <div style={rightPane}>
        <Funds apiClient={apiClient} />
        <Portfolio apiClient={apiClient} />
        <Orders apiClient={apiClient} />
        
        <Positions apiClient={apiClient} />
        
        {/* <Margins apiClient={apiClient} /> */}
      </div>
    </div>
  );
}

/* --- Styles --- */
const loginContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  background: "#f0f4ff",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const loginCard = {
  background: "#ffffff",
  padding: "50px 40px",
  borderRadius: "20px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  textAlign: "center",
  width: "350px",
};

const loginTitle = {
  fontSize: "2.2rem",
  fontWeight: "800",
  marginBottom: "30px",
  color: "#1a3b8b",
};

const loginInput = {
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginBottom: "20px",
  fontSize: "1.1rem",
  textAlign: "center",
};

const loginButton = {
  width: "100%",
  padding: "15px",
  borderRadius: "10px",
  border: "none",
  background: "#1a3b8b",
  color: "#fff",
  fontSize: "1.2rem",
  cursor: "pointer",
  fontWeight: "700",
  transition: "0.3s",
};

const errorText = {
  color: "red",
  marginTop: "15px",
  fontWeight: "600",
  fontSize: "0.95rem",
};

const dashboardContainer = {
  display: "flex",
  gap: "20px",
  padding: "20px",
  boxSizing: "border-box",
  background: "#f5f7fa",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  height: "100vh",
  overflow: "auto",
  flexWrap: "wrap", // allows responsive wrapping
};

const leftPane = {
  flex: "1 1 35%", // smaller portion
  maxWidth: "600px",
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "20px", // ✅ adds spacing between MarketFeed & OrderStatus
  height: "100%",
};

// const card = {
//   background: "#fff",
//   padding: "20px",
//   borderRadius: "15px",
//   boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
// };

const rightPane = {
  flex: "2 1 60%", // wider portion
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  minWidth: "300px",
  height: "100%",
};

/* Responsive adjustments using media queries (inline) */
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media (max-width: 1024px) {
      .dashboardContainer {
        flex-direction: column;
      }
      .leftPane, .rightPane {
        flex: 1 1 100%;
        max-width: 100%;
      }
    }
  `;
  document.head.appendChild(style);
}
