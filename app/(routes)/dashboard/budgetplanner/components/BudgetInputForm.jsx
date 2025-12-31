'use client';
import React from 'react';
import { IndianRupee  } from 'lucide-react';

const BudgetInputForm = ({
  monthlyIncome,
  setMonthlyIncome,
  expenses,
  setExpenses,
  goals,
  setGoals,
  language,
  setLanguage,
  error,
  loading,
  isInitialized,
  generateBudgetPlan,
  apiKey,
}) => {
  const handleIncomeChange = (e) => {
    setMonthlyIncome(e.target.value);
  };

  const handleExpensesChange = (e) => {
    setExpenses(e.target.value);
  };

  const handleGoalsChange = (e) => {
    setGoals(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Create Your Budget Plan</h2>
      <form onSubmit={(e) => { e.preventDefault(); generateBudgetPlan(); }}>
        <div className="space-y-6">
          {/* Income Input */}
          <div>
            <label htmlFor="monthlyIncome" className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Income (After Tax)
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="w-5 h-5 text-gray-400" aria-hidden="true" />
              </span>
              <input
                type="number"
                id="monthlyIncome"
                value={monthlyIncome}
                onChange={handleIncomeChange}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="e.g., 3000"
                required
                aria-required="true"
                min="0"
                step="any"
              />
            </div>
          </div>
          {/* Expenses Input */}
          <div>
            <label htmlFor="expenses" className="block text-sm font-medium text-gray-700 mb-1">
              Essential Monthly Expenses
            </label>
            <textarea
              id="expenses"
              value={expenses}
              onChange={handleExpensesChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}
              placeholder="List expenses like: Rent/Mortgage: ₹1200, Groceries: ₹400, Utilities: ₹150, Car Payment: ₹300, Gas: ₹100, etc."
              required
              aria-required="true"
            />
            <p className="mt-1 text-xs text-gray-500">Tip: Be specific for a better analysis.</p>
          </div>
          {/* Goals Input */}
          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
              Financial Goals
            </label>
            <textarea
              id="goals"
              value={goals}
              onChange={handleGoalsChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              rows={4}
              placeholder="e.g., Build a ₹5000 emergency fund in 6 months, Save ₹10000 for a house down payment in 2 years, Pay off ₹3000 credit card debt, Start investing for retirement."
              required
              aria-required="true"
            />
          </div>
          {/* Language Input */}
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language for Analysis
            </label>
            <select
              id="language"
              value={language}
              onChange={handleLanguageChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="en-IN">English (India)</option>
              <option value="hi-IN">Hindi (India)</option>
              <option value="mr-IN">Marathi (India)</option>
              <option value="gu-IN">Gujarati (India)</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ru">Russian</option>
              <option value="ar">Arabic</option>
              <option value="pt">Portuguese</option>
              <option value="ko">Korean</option>
            </select>
          </div>
          {/* Error Display */}
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}
          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !isInitialized}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate Budget Plan'}
          </button>
          {/* Initialization Message */}
          {!isInitialized && !apiKey && !error && ( // Only show if no API key AND no other error
            <p className="text-center text-sm text-yellow-600 mt-2">Waiting for API key configuration...</p>
          )}
        </div>
      </form>
    </div>
  );
};

export default BudgetInputForm;