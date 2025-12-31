"use client";
import React, { useEffect, useRef, useState } from "react";

const cardStyle = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  minWidth: "250px",
};

const headerStyle = {
  fontSize: "1.2rem",
  fontWeight: "600",
  marginBottom: "8px",
  color: "#333",
};

const HistoricalChart = ({ apiClient }) => {
  const chartContainerRef = useRef();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!chartContainerRef.current) return;

    let chart;
    let candleSeries;

    (async () => {
      try {
        const { createChart } = await import("lightweight-charts"); // dynamic import

        chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 300,
          layout: {
            backgroundColor: "#ffffff",
            textColor: "#333",
          },
          grid: {
            vertLines: { color: "#f0f0f0" },
            horzLines: { color: "#f0f0f0" },
          },
        });

        candleSeries = chart.addCandlestickSeries({
          upColor: "#26a69a",
          downColor: "#ef5350",
          borderVisible: false,
          wickUpColor: "#26a69a",
          wickDownColor: "#ef5350",
        });

        // Fetch historical data
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setFullYear(toDate.getFullYear() - 1);

        const params = {
          symboltoken: "3045", // INFY token
          interval: "ONE_DAY",
          fromdate: `${fromDate.toISOString().slice(0, 10)} 09:15`,
          todate: `${toDate.toISOString().slice(0, 10)} 15:30`,
        };

        const response = await apiClient.post("/data/historical", params);

        if (response.data.status && response.data.data) {
          const chartData = response.data.data.map((item) => ({
            time: item[0].split("T")[0],
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
          }));

          candleSeries.setData(chartData);
        } else {
          setError("No historical data found.");
        }
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load chart data.");
      } finally {
        setLoading(false);
      }

      // Handle window resize
      const handleResize = () => {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        chart?.remove();
      };
    })();
  }, [apiClient]);

  return (
    <div style={cardStyle}>
      <h3 style={headerStyle}>Historical Chart (INFY)</h3>
      {loading && <p>Loading chart data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div ref={chartContainerRef} style={{ width: "100%", height: "300px" }} />
    </div>
  );
};

export default HistoricalChart;
