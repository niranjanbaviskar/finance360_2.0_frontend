"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const cardStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minWidth: "400px",
  maxWidth: "500px",
};

const headerStyle = {
  fontSize: "1.4rem",
  fontWeight: "600",
  marginBottom: "10px",
  color: "#333",
};

const inputStyle = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  marginBottom: "12px",
  width: "100%",
};

const suggestionStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  maxHeight: "200px",
  overflowY: "auto",
  marginBottom: "12px",
};

const suggestionItemStyle = {
  padding: "8px",
  cursor: "pointer",
  borderBottom: "1px solid #f0f0f0",
};

const tickerStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "6px 0",
  fontSize: "1rem",
  fontWeight: "500",
  borderBottom: "1px solid #f0f0f0",
};

const MarketFeed = () => {
  const [stockSymbol, setStockSymbol] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Replace with real Indian symbols if Finnhub supports NSE/BSE, e.g., INFY, RELIANCE
  const topStocks = ["INFY", "META", "AMZN", "NVDA", "AAPL", "GOOGL", "JPM", "NFLX" ];

  const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;

  // Fetch stock price by symbol
  const fetchStockPrice = async (symbol) => {
    if (!symbol) return;
    setLoading(true);
    setError("");
    setStockData(null);

    try {
      const res = await axios.get(`https://finnhub.io/api/v1/quote`, {
        params: { symbol, token: apiKey },
      });

      if (res.data) {
        setStockData({
          symbol,
          currentPrice: res.data.c,
          change: res.data.d,
          changePercent: res.data.dp,
          high: res.data.h,
          low: res.data.l,
          open: res.data.o,
        });
      } else {
        setError("Stock not found or API limit reached.");
      }
    } catch (err) {
      console.error("Error fetching stock data:", err);
      setError("Error fetching stock data.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch suggestions while typing
  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await axios.get(`https://finnhub.io/api/v1/search`, {
        params: { q: query, token: apiKey },
      });
      if (res.data.result) {
        setSuggestions(res.data.result.slice(0, 5));
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toUpperCase();
    setStockSymbol(value);
    fetchSuggestions(value);
  };

  const handleSelectSuggestion = (symbol) => {
    setStockSymbol(symbol);
    setSuggestions([]);
    fetchStockPrice(symbol);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStockPrice(stockSymbol);
    setSuggestions([]);
  };

  return (
    <div style={cardStyle}>
      <h3 style={headerStyle}>Market Watch</h3>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Stock (e.g. INFY)"
          value={stockSymbol}
          onChange={handleSearchChange}
          style={inputStyle}
        />
      </form>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div style={suggestionStyle}>
          {suggestions.map((item) => (
            <div
              key={item.symbol}
              style={suggestionItemStyle}
              onClick={() => handleSelectSuggestion(item.symbol)}
            >
              {item.symbol} - {item.description}
            </div>
          ))}
        </div>
      )}

      {/* Selected Stock Info */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {stockData && (
        <div>
          <div style={tickerStyle}>
            <span>Symbol:</span>
            <span>{stockData.symbol}</span>
          </div>
          <div style={tickerStyle}>
            <span>Price:</span>
            <span>₹{stockData.currentPrice?.toFixed(2)}</span>
          </div>
          <div style={tickerStyle}>
            <span>Change:</span>
            <span style={{ color: stockData.change >= 0 ? "green" : "red" }}>
              {stockData.change?.toFixed(2)}
            </span>
          </div>
          <div style={tickerStyle}>
            <span>Change %:</span>
            <span style={{ color: stockData.changePercent >= 0 ? "green" : "red" }}>
              {stockData.changePercent?.toFixed(2)}%
            </span>
          </div>
        </div>
      )}

      {/* Today's Top Stocks */}
      <h4 style={{ marginTop: "12px", fontWeight: "600" }}>
        Today's Top Stocks
      </h4>
      {topStocks.map((sym) => (
        <TopStockItem
          key={sym}
          symbol={sym}
          apiKey={apiKey}
          onSelect={handleSelectSuggestion}
        />
      ))}
    </div>
  );
};

// Component for each top stock
const TopStockItem = ({ symbol, apiKey, onSelect }) => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.get(`https://finnhub.io/api/v1/quote`, {
          params: { symbol, token: apiKey },
        });
        if (res.data) {
          setPrice(res.data.c);
        }
      } catch (err) {
        console.error("Error fetching top stock price:", err);
      }
    };
    fetchPrice();
  }, [symbol, apiKey]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "6px 0",
        cursor: "pointer",
      }}
      onClick={() => onSelect(symbol)}
    >
      <span>{symbol}</span>
      <span>₹{price ? price.toFixed(2) : "N/A"}</span>
    </div>
  );
};

export default MarketFeed;
