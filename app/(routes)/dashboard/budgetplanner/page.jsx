'use client'
import React, { useState, useEffect } from 'react';
// import Header from '../components/layout/Navbar'; // Updated import path
// import Footer from '../components/layout/Footer'; // Updated import path
import BudgetInputForm from './components/BudgetInputForm';
import BudgetReport from './components/BudgetReport';
// import FeatureSection from './components/FeatureSection';
import { generateBudgetReport, isAIModelInitialized, getAIModelName, apiKey } from '../budgetplanner/components/aiService'; // Import AI service functions


const BudgetPlannerPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [goals, setGoals] = useState('');
  const [language, setLanguage] = useState('en-IN'); // Default language is English (India)
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [modelUsedForInit, setModelUsedForInit] = useState('');

  useEffect(() => {
    const initialized = isAIModelInitialized();
    setIsInitialized(initialized);
    if (initialized) {
      setModelUsedForInit(getAIModelName());
      console.log(`AI Model (${getAIModelName()}) initialized successfully on page load.`);
    } else if (!apiKey) {
        setError('Gemini API key not configured. Please add NEXT_GEMINI_API_KEY to your .env file and restart the development server.');
    }
    else {
      setError(`Failed to initialize AI Model (${getAIModelName()}). Check console logs, API key validity, Google Cloud project (ensure Gemini API is enabled & billing is configured if required), or network connection. You might need to try a different model name in the code.`);
    }
  }, []); // Run once on mount


  const generateBudgetPlan = async () => {
    const modelNameToDisplay = modelUsedForInit || getAIModelName();

    if (!isInitialized) {
      if (!apiKey) setError('Gemini API key not configured. Please add NEXT_GEMINI_API_KEY to your .env file and restart the server.');
      else setError(`AI Model (${modelNameToDisplay}) not initialized. Please check configuration, refresh the page, or see console logs.`);
      return;
    }
    if (!monthlyIncome || !expenses || !goals) {
      setError('Please fill in all fields before generating a budget plan.');
      return;
    }

    setError('');
    setLoading(true);
    setReport('');

    try {
      const incomeNumber = parseFloat(monthlyIncome);
      if (isNaN(incomeNumber) || incomeNumber < 0) {
        throw new Error("Invalid monthly income. Please enter a non-negative number.");
      }

      const prompt = `As a financial advisor, create a detailed and personalized budget plan based on the following information use only indian currency that is Rupee (₹) and do not US dollars:

Monthly Income: ₹${incomeNumber} (This is assumed to be after tax unless specified otherwise in expenses/goals)
Essential Expenses: ${expenses}
Financial Goals: ${goals}
Please provide the budget plan in ${language} language.

Please provide a comprehensive analysis and recommendations including:

1.  **Income Analysis:** Net income confirmation, tax considerations (general), potential additional income streams (if relevant).
2.  **Expense Breakdown:** Categorize provided expenses (Fixed vs. Variable). Suggest a budget framework (like 50/30/20) and provide specific dollar amount suggestions for categories based on the income. Identify potential saving areas.
3.  **Savings Strategy:** Emergency fund (target amount: typically 3-6 months of essential expenses, calculate this, suggest timeline). Short-term goals savings plan. Long-term goals (retirement/investment allocation ideas). Provide specific dollar amounts/percentages to allocate.
4.  **Investment Suggestions (General):** Based on goals (e.g., retirement, house down payment), suggest suitable account types (e.g., 401k, IRA, brokerage) and general investment types (e.g., index funds, ETFs). *Crucially, add a disclaimer: "This is for informational purposes only and does not constitute personalized financial or investment advice. Consult with a qualified professional before making investment decisions."*
5.  **Debt Management (If debt is mentioned):** Recommend a strategy (e.g., snowball, avalanche) with calculated examples if possible based on expense details. Discuss consolidation options if appropriate.
6.  **Actionable Steps:** Provide a clear, numbered list of 3-5 specific, achievable steps the user can take *this month* to start implementing the plan. Include suggestions for tracking progress (e.g., budgeting apps, spreadsheets).

 Format the output clearly using headings (Markdown H2 or H3), bullet points, and **bold text** for key figures and recommendations. Ensure advice is realistic for the provided income and expenses. Conclude with a brief, encouraging sentence.`;


      const aiReport = await generateBudgetReport(prompt);
      setReport(aiReport);

    } catch (err) {
      console.error('Error generating budget plan:', err);
      let message = 'An unexpected error occurred while generating the plan. Please try again.';

      if (err instanceof Error) {
        const errMsg = err.message.toLowerCase();
        const modelNameToDisplayError = modelUsedForInit || getAIModelName(); // Use model name from service

        if (errMsg.includes('api key not valid') || errMsg.includes('permission denied') || errMsg.includes('consumer project not found') || errMsg.includes('api target violates constraint') || errMsg.includes('billing account not found') || errMsg.includes('enable billing') || errMsg.includes('user location is not supported')) {
          message = `API Key/Permission/Billing Issue: ${err.message}. Please check your NEXT_GEMINI_API_KEY, ensure the Gemini API is enabled in your Google Cloud project, check billing status, and verify regional availability.`;
        } else if (errMsg.includes('quota') || errMsg.includes('resource exhausted')) {
          message = 'API quota exceeded. Please check your Google Cloud project usage limits or try again later.';
        } else if (errMsg.includes('invalid monthly income')) {
          message = err.message;
        } else if ((errMsg.includes('404') || errMsg.includes('not found')) && errMsg.includes('model')) {
          message = `Model "${modelNameToDisplayError}" not found or not accessible with your API key (${err.message}). Verify the model name in App.jsx, API key permissions, and Google Cloud project setup. Try switching to an alternative model name.`;
        } else if (errMsg.includes('request blocked due to') || errMsg.includes('safety filters') || (errMsg.includes('generation failed') && errMsg.includes('safety'))) {
          message = `Content Safety Error: ${err.message}. Your input might have triggered safety filters. Please revise expenses or goals.`;
        } else if (errMsg.includes('network error') || errMsg.includes('failed to fetch') || errMsg.includes('timeout')) {
          message = `Network Error: Failed to connect to the AI service. Please check your internet connection. (${err.message})`;
        }
        else {
          message = `Error: ${err.message}`;
        }
      } else {
        message = `An unexpected error occurred: ${String(err)}`;
      }
      setError(message);
      setReport('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <BudgetInputForm
            monthlyIncome={monthlyIncome}
            setMonthlyIncome={setMonthlyIncome}
            expenses={expenses}
            setExpenses={setExpenses}
            goals={goals}
            setGoals={setGoals}
            language={language}
            setLanguage={setLanguage}
            error={error}
            setError={setError}
            loading={loading}
            isInitialized={isInitialized}
            generateBudgetPlan={generateBudgetPlan}
            apiKey={apiKey}
          />
          <BudgetReport
            report={report}
            loading={loading}
            isInitialized={isInitialized}
            error={error}
            modelUsedForInit={modelUsedForInit}
          />
        </div>

        {/* <FeatureSection /> */}
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default BudgetPlannerPage;