"use client";
import React, { useState } from "react";

function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const [finalAmount, setFinalAmount] = useState(null);

  const calculateSIP = () => {
    const months = years * 12;
    const monthlyRate = rate / 100 / 12;
    const maturity =
      (monthlyInvestment * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)) * (1 + monthlyRate);
    setFinalAmount(maturity.toFixed(2));
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">SIP Calculator</h2>

      <div className="flex flex-col gap-4">
        {/* Monthly Investment */}
        <label className="text-lg font-medium">Monthly Investment (₹)</label>
        <input
          type="number"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
          className="border p-3 rounded-md text-lg focus:ring-2 focus:ring-blue-400 transition"
          min="500"
        />

        {/* Years */}
        <label className="text-lg font-medium">Investment Duration (Years)</label>
        <input
          type="number"
          value={years}
          onChange={(e) => setYears(Number(e.target.value))}
          className="border p-3 rounded-md text-lg focus:ring-2 focus:ring-blue-400 transition"
          min="1"
        />

        {/* Expected Return */}
        <label className="text-lg font-medium">Expected Annual Return (%)</label>
        <input
          type="number"
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          className="border p-3 rounded-md text-lg focus:ring-2 focus:ring-blue-400 transition"
          min="1"
          max="30"
        />

        {/* Calculate Button */}
        <button
          onClick={calculateSIP}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-md transition mt-2"
        >
          Calculate
        </button>

        {/* Display Result */}
        {finalAmount !== null && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg text-green-800 text-lg text-center">
            <p>💰 Estimated Maturity Amount:</p>
            <p className="text-2xl font-bold text-green-700">₹{finalAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SIPCalculator;
