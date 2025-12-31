"use client";
import React, { useState } from "react";

function LoanEMICalculator() {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(7);
  const [loanTenure, setLoanTenure] = useState(5);
  const [emi, setEmi] = useState(null);

  const calculateEMI = () => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTenure <= 0) {
      setEmi("Invalid input");
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const months = loanTenure * 12;
    const emiValue =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    
    setEmi(emiValue.toFixed(2));
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">Loan EMI Calculator</h2>

      <div className="flex flex-col gap-4">
        {/* Loan Amount */}
        <label className="text-lg font-medium">Loan Amount (₹)</label>
        <input
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="border p-3 rounded-md text-lg focus:ring-2 focus:ring-blue-400 transition"
          min="1"
        />

        {/* Interest Rate */}
        <label className="text-lg font-medium">Interest Rate (%)</label>
        <input
          type="number"
          value={interestRate}
          onChange={(e) => setInterestRate(Number(e.target.value))}
          className="border p-3 rounded-md text-lg focus:ring-2 focus:ring-blue-400 transition"
          min="1"
          max="30"
        />

        {/* Loan Tenure */}
        <label className="text-lg font-medium">Loan Tenure (Years)</label>
        <input
          type="number"
          value={loanTenure}
          onChange={(e) => setLoanTenure(Number(e.target.value))}
          className="border p-3 rounded-md text-lg focus:ring-2 focus:ring-blue-400 transition"
          min="1"
        />

        {/* Calculate Button */}
        <button
          onClick={calculateEMI}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-md transition mt-2"
        >
          Calculate EMI
        </button>

        {/* Display Result */}
        {emi !== null && (
          <div className={`mt-4 p-4 rounded-lg text-lg text-center ${emi === "Invalid input" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"}`}>
            {emi === "Invalid input" ? "⚠️ Please enter valid numbers" : `💰 Monthly EMI: ₹${emi}`}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoanEMICalculator;
