"use client";
import React, { useState } from "react";

function CreditScoreChecker() {
  const [creditHistory, setCreditHistory] = useState(5);
  const [missedPayments, setMissedPayments] = useState(0);
  const [creditUtilization, setCreditUtilization] = useState(30);
  const [creditScore, setCreditScore] = useState(null);
  const [scoreStatus, setScoreStatus] = useState("");

  const calculateCreditScore = () => {
    let score = 650; // Base score set to a reasonable average

    // Credit History (More years = Better Score)
    score += creditHistory * 5; // Reduced weightage to prevent excessive boost

    // Missed Payments (More penalties for frequent misses)
    if (missedPayments > 0) {
      score -= Math.min(150, missedPayments * 15); // Caps at -150 to avoid extreme drops
    }

    // Credit Utilization (Keeping it below 30% is ideal)
    if (creditUtilization <= 30) {
      score += 20; // Bonus for good utilization
    } else if (creditUtilization <= 50) {
      score -= 10; // Small penalty
    } else {
      score -= Math.min(100, (creditUtilization - 50) * 2); // Caps at -100
    }

    // Ensuring score is within the valid range (300 - 850)
    const finalScore = Math.max(300, Math.min(850, score));
    setCreditScore(finalScore);

    // Determine score status
    if (finalScore >= 750) {
      setScoreStatus("Excellent ✅ (Very Low Risk)");
    } else if (finalScore >= 700) {
      setScoreStatus("Good 👍 (Low Risk)");
    } else if (finalScore >= 650) {
      setScoreStatus("Fair ⚠️ (Moderate Risk)");
    } else {
      setScoreStatus("Poor ❌ (High Risk)");
    }
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-lg shadow-lg border">
      <h2 className="text-3xl font-semibold mb-5 text-center text-blue-700">Credit Score Checker</h2>

      <div className="flex flex-col gap-4">
        {/* Credit History */}
        <label className="font-medium text-gray-700">Credit History (Years)</label>
        <input
          type="number"
          value={creditHistory}
          onChange={(e) => setCreditHistory(Number(e.target.value))}
          className="border p-3 rounded-md text-lg"
          min="0"
        />

        {/* Missed Payments */}
        <label className="font-medium text-gray-700">Missed Payments</label>
        <input
          type="number"
          value={missedPayments}
          onChange={(e) => setMissedPayments(Number(e.target.value))}
          className="border p-3 rounded-md text-lg"
          min="0"
        />

        {/* Credit Utilization */}
        <label className="font-medium text-gray-700">Credit Utilization (%)</label>
        <input
          type="number"
          value={creditUtilization}
          onChange={(e) => setCreditUtilization(Number(e.target.value))}
          className="border p-3 rounded-md text-lg"
          min="0"
          max="100"
        />

        {/* Check Score Button */}
        <button
          onClick={calculateCreditScore}
          className="bg-blue-700 text-white p-3 rounded-md text-lg font-medium hover:bg-blue-800 transition duration-200"
        >
          Check Credit Score
        </button>

        {/* Display Score */}
        {creditScore !== null && (
          <div className="mt-4 p-4 rounded-lg text-lg font-semibold text-center bg-gray-100">
            <p className="text-gray-800">
              Estimated Credit Score:{" "}
              <span className={`text-2xl font-bold ${creditScore >= 700 ? "text-green-600" : creditScore >= 650 ? "text-yellow-500" : "text-red-600"}`}>
                {creditScore}
              </span>
            </p>
            <p className={`mt-2 font-medium ${creditScore >= 700 ? "text-green-700" : creditScore >= 650 ? "text-yellow-600" : "text-red-700"}`}>
              {scoreStatus}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CreditScoreChecker;
