"use client";
import React, { useState } from "react";

function TaxCalculator() {
  const [income, setIncome] = useState(500000);
  const [tax, setTax] = useState(0);
  const [taxRegime, setTaxRegime] = useState("new"); // Default to new tax regime

  const calculateTax = () => {
    let calculatedTax = 0;

    if (taxRegime === "new") {
      // New Tax Regime (FY 2025-26)
      if (income <= 400000) {
        calculatedTax = 0;
      } else if (income <= 800000) {
        calculatedTax = (income - 400000) * 0.05;
      } else if (income <= 1200000) {
        calculatedTax = 20000 + (income - 800000) * 0.1;
      } else if (income <= 1500000) {
        calculatedTax = 60000 + (income - 1200000) * 0.2;
      } else {
        calculatedTax = 120000 + (income - 1500000) * 0.3;
      }
    } else {
      // Old Tax Regime
      if (income <= 250000) {
        calculatedTax = 0;
      } else if (income <= 500000) {
        calculatedTax = (income - 250000) * 0.05;
      } else if (income <= 1000000) {
        calculatedTax = 12500 + (income - 500000) * 0.2;
      } else {
        calculatedTax = 112500 + (income - 1000000) * 0.3;
      }
    }

    setTax(calculatedTax.toFixed(2));
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-lg shadow-lg border">
      <h2 className="text-3xl font-semibold mb-5 text-center text-blue-700">Income Tax Calculator</h2>

      {/* Toggle Between New & Old Tax Regime */}
      <div className="flex justify-center gap-4 mb-5">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            taxRegime === "new" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTaxRegime("new")}
        >
          New Regime (2025)
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            taxRegime === "old" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setTaxRegime("old")}
        >
          Old Regime
        </button>
      </div>

      {/* Income Input */}
      <div className="flex flex-col gap-4">
        <label className="font-semibold text-gray-700">Annual Income (₹)</label>
        <input
          type="number"
          value={income}
          onChange={(e) => setIncome(Number(e.target.value))}
          className="border p-3 rounded-md text-lg"
          min="0"
        />

        {/* Calculate Button */}
        <button
          onClick={calculateTax}
          className="bg-blue-700 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-800 transition duration-200"
        >
          Calculate Tax
        </button>

        {/* Result */}
        <div className="mt-4 p-4 rounded-lg text-lg font-semibold text-center">
          {tax > 0 ? (
            <div className="bg-green-100 text-green-800">
              Estimated Tax: <span className="text-green-900 font-bold">₹{tax}</span>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-800">
              No Tax Applicable (₹0)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaxCalculator;
