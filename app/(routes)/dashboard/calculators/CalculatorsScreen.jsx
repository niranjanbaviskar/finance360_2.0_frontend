// "use client";
// import React from "react";
// import { useRouter } from "next/navigation";
// import { Calculator, TrendingUp, FileText, CreditCard } from "lucide-react";

// function CalculatorsScreen() {
//   const router = useRouter(); // Initialize router

//   const calculators = [
//     { id: 1, name: "SIP Calculator", icon: TrendingUp, path: "/calculators/SIPCalculator" },
//     { id: 2, name: "Tax Calculator", icon: FileText, path: "/calculators/TaxCalculator" },
//     { id: 3, name: "Credit Score Checker", icon: CreditCard, path: "/calculators/CreditScoreChecker" },
//     { id: 4, name: "Loan EMI Calculator", icon: Calculator, path: "/calculators/LoanEMICalculator" },
//   ];

//   return (
//     <div className="p-10">
//       <h2 className="font-bold text-3xl mb-5">Financial Calculators</h2>
//       <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
//         {calculators.map((calc) => (
//           <div
//             key={calc.id}
//             className="border p-5 rounded-lg shadow-sm flex items-center gap-4 
//                             cursor-pointer hover:bg-blue-50 transition duration-200"
//             onClick={() => router.push(calc.path)} // Navigate on click
//           >
//             <calc.icon size={30} className="text-blue-600" />
//             <span className="text-lg font-semibold">{calc.name}</span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default CalculatorsScreen;
