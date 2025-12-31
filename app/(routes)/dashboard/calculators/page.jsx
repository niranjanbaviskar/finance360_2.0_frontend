"use client";
import React, { useState } from "react";
import { Calculator, TrendingUp, FileText, CreditCard } from "lucide-react";
import SIPCalculator from "./SIPCalculator/SIPCalculator";
import TaxCalculator from "./components/TaxCalculator";
import CreditScoreChecker from "./components/CreditScoreChecker";
import LoanEMICalculator from "./components/LoanEMICalculator";

function CalculatorsScreen() {
  const [selectedCalculator, setSelectedCalculator] = useState(null);

  const calculators = [
    { id: 1, name: "SIP Calculator", icon: TrendingUp, component: <SIPCalculator /> },
    { id: 2, name: "Tax Calculator", icon: FileText, component: <TaxCalculator /> },
    { id: 3, name: "Credit Score Checker", icon: CreditCard, component: <CreditScoreChecker /> },
    { id: 4, name: "Loan EMI Calculator", icon: Calculator, component: <LoanEMICalculator /> },
  ];

  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl mb-5">Financial Calculators</h2>
      
      {/* Show calculator selection screen if none is selected */}
      {selectedCalculator === null ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {calculators.map((calc) => (
            <div
              key={calc.id}
              className="border p-5 rounded-lg shadow-sm flex items-center gap-4 
                          cursor-pointer hover:bg-blue-50 transition duration-200"
              onClick={() => setSelectedCalculator(calc.component)}
            >
              <calc.icon size={30} className="text-blue-600" />
              <span className="text-lg font-semibold">{calc.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedCalculator(null)}
            className="mb-5 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            ⬅ Back to Calculators
          </button>
          {selectedCalculator}
        </div>
      )}
    </div>
  );
}

export default CalculatorsScreen;
