"use client";
import React, { useState } from "react";

export default function MarginCalculator({ apiClient }) {
  const [positions, setPositions] = useState([
    { exchange: "NSE", tradingsymbol: "", transactiontype: "BUY", variety: "NORMAL", producttype: "CNC", quantity: 1 }
  ]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (index, field, value) => {
    const updated = [...positions];
    updated[index][field] = value;
    setPositions(updated);
  };

  // Add new position row
  const addPosition = () => {
    setPositions([...positions, { exchange: "NSE", tradingsymbol: "", transactiontype: "BUY", variety: "NORMAL", producttype: "CNC", quantity: 1 }]);
  };

  // Remove a position
  const removePosition = (index) => {
    setPositions(positions.filter((_, i) => i !== index));
  };

  // Call API
  const handleCalc = async () => {
    try {
      const res = await apiClient.post("/data/margin", { positions });
      setResult(res.data);
      setError("");
    } catch (err) {
      setError("Invalid input or API error");
      setResult(null);
    }
  };

  return (
    <div style={card}>
      <h3 style={title}>🧮 Margin Calculator</h3>

      {/* Positions form */}
      {positions.map((pos, idx) => (
        <div key={idx} style={formRow}>
          <select value={pos.exchange} onChange={(e) => handleChange(idx, "exchange", e.target.value)} style={input}>
            <option value="NSE">NSE</option>
            <option value="BSE">BSE</option>
          </select>

          <input
            type="text"
            placeholder="Symbol (e.g. INFY)"
            value={pos.tradingsymbol}
            onChange={(e) => handleChange(idx, "tradingsymbol", e.target.value)}
            style={input}
          />

          <select value={pos.transactiontype} onChange={(e) => handleChange(idx, "transactiontype", e.target.value)} style={input}>
            <option value="BUY">BUY</option>
            <option value="SELL">SELL</option>
          </select>

          <input
            type="number"
            min="1"
            value={pos.quantity}
            onChange={(e) => handleChange(idx, "quantity", e.target.value)}
            style={input}
          />

          <button style={removeBtn} onClick={() => removePosition(idx)}>✖</button>
        </div>
      ))}

      <button style={addBtn} onClick={addPosition}>➕ Add Position</button>
      <button style={button} onClick={handleCalc}>Calculate</button>

      {error && <p style={errorText}>{error}</p>}

      {result && (
        <div style={resultContainer}>
          <h4 style={resultTitle}>Margin Result:</h4>
          <pre style={resultBox}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

/* --- Styles --- */
const card = { background: "#fff", padding: "25px", borderRadius: "15px", boxShadow: "0 6px 18px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "15px" };
const title = { fontSize: "1.5rem", fontWeight: "700", marginBottom: "10px", color: "#1a3b8b" };
const formRow = { display: "flex", gap: "10px", alignItems: "center" };
const input = { padding: "8px", borderRadius: "8px", border: "1px solid #ccc", flex: "1" };
const button = { padding: "10px 20px", background: "#1a3b8b", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600" };
const addBtn = { ...button, background: "#4caf50" };
const removeBtn = { padding: "6px 10px", background: "#f44336", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" };
const errorText = { color: "red", fontWeight: "600" };
const resultContainer = { background: "#f1f5ff", padding: "15px", borderRadius: "10px", fontFamily: "monospace", overflowX: "auto" };
const resultTitle = { fontWeight: "700", marginBottom: "10px", color: "#333" };
const resultBox = { fontSize: "0.95rem", whiteSpace: "pre-wrap", wordWrap: "break-word" };
