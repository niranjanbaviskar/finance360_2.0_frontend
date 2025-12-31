import { UserButton } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign,
  TrendingUp,
  Calculator,
  FilePen,
  Sun,
  Moon,
  Bitcoin,
  Archive,

} from "lucide-react";

function DashboardHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const menuList = [
    { id: 1, name: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
    { id: 2, name: "Incomes", icon: CircleDollarSign, path: "/dashboard/incomes" },
    { id: 3, name: "Budgets", icon: PiggyBank, path: "/dashboard/budgets" },
    { id: 4, name: "Expenses", icon: ReceiptText, path: "/dashboard/expenses" },
    { id: 5, name: "Daily News", icon: TrendingUp, path: "/dashboard/news" },
    { id: 6, name: "Calculators", icon: Calculator, path: "/dashboard/calculators" },
    { id: 7, name: "AI Budget Planner", icon: FilePen, path: "/dashboard/budgetplanner" },
    { id: 8, name: "PDF Risk Analysis", icon: Archive, path: "/dashboard/pdfRiskAnalysis" },
    { id: 9, name: "Stock Tracker", icon: Bitcoin, path: "/dashboard/stock" },
    { id: 10, name: "SMS", icon: ShieldCheck, path: "/dashboard/sms" },
    { id: 11, name: "Upgrade", icon: ShieldCheck, path: "/dashboard/upgrade" },
    
  ];

  return (
    <div className="p-3 shadow-sm border-b flex justify-between items-center relative bg-white dark:bg-gray-900 dark:text-white transition-all">
      {/* Left Side (Mobile Menu Button) */}
      <div className="sm:block md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <Image src={"/menu-bar.png"} alt="menu" width={35} height={35} />
        </button>
      </div>

      {/* Center Logo (Visible Only in Mobile) */}
      <div className="absolute left-1/2 transform -translate-x-1/2 sm:flex md:hidden items-center gap-2">
  <Image src="/chart-donut.svg" alt="logo" width={30} height={25} />
  <span className="text-blue-800 dark:text-blue-400 font-bold text-xl">
    Finance360
  </span>
</div>


      {/* Right Side (Dark Mode Toggle & User Button) */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          {darkMode ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-gray-900 dark:text-white" />}
        </button>

        {/* User Button */}
        <UserButton afterSignOutUrl="/" />
      </div>

      {/* Mobile Menu (Opens on Click) */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full bg-white dark:bg-gray-800 shadow-md border
          sm:flex sm:flex-col md:hidden p-5 z-50 transition-all"
        >
          {menuList.map((menu) => (
            <Link href={menu.path} key={menu.id} onClick={() => setMenuOpen(false)}>
              <h2
                className="flex gap-3 items-center p-4 cursor-pointer rounded-lg
                text-gray-600 dark:text-gray-200 font-medium mb-2 hover:text-primary hover:bg-blue-100 dark:hover:bg-gray-700"
              >
                <menu.icon size={24} />
                {menu.name}
              </h2>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardHeader;
