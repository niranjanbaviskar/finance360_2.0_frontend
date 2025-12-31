import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  ShieldCheck,
  CircleDollarSign,
  TrendingUp,
  Calculator,
  FilePen,
  Archive,
  Bitcoin,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Link from "next/link";

function SideNav() {
  const menuList = [
    {
      id: 1,
      name: "Dashboard",
      icon: LayoutGrid,
      path: "/dashboard",
    },
    {
      id: 2,
      name: "Incomes",
      icon: CircleDollarSign,
      path: "/dashboard/incomes",
    },
    {
      id: 3,
      name: "Budgets",
      icon: PiggyBank,
      path: "/dashboard/budgets",
    },
    {
      id: 4,
      name: "Expenses",
      icon: ReceiptText,
      path: "/dashboard/expenses",
    },
    {
      id: 5,
      name: "Daily News",
      icon: TrendingUp,
      path: "/dashboard/news",
    },
    {
      id: 6,
      name: "Calculators",
      icon: Calculator,
      path: "/dashboard/calculators",
    },
    {
      id: 7,
      name: "AI Budget Planner",
      icon: FilePen,
      path: "/dashboard/budgetplanner",
    },
    {
      id: 8,
      name: "PDF Risk Analysis",
      icon: Archive,
      path: "/dashboard/pdfRiskAnalysis",
    },
    {
      id: 9,
      name: "Stock Tracker",
      icon: ShieldCheck,
      path: "/dashboard/stock",
    },
    // {
    //   id: 10,
    //   name: "SMS",
    //   icon: Bitcoin,
    //   path: "/dashboard/sms",
    // },
    {
      id: 11,
      name: "Upgrade",
      icon: Bitcoin,
      path: "/dashboard/upgrade",
    },
  ];

  const path = usePathname();

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen p-5 border shadow-sm relative">
      {/* Logo */}
      <div className="flex gap-3 items-center">
        <Image src={"/increase.png"} alt="logo" width={30} height={30} />
        <span className="text-blue-800 font-bold text-xl">Finance360</span>
      </div>

      {/* Menu */}
      <div className="mt-5 space-y-1">
        {menuList.map((menu, index) => (
          <Link href={menu.path} key={index}>
            <h2
              className={`flex gap-3 items-center
                text-gray-500 font-medium
                p-3 cursor-pointer rounded-full
                hover:text-primary hover:bg-blue-100
                ${path === menu.path ? "text-primary bg-blue-100" : ""}
              `}
            >
              <menu.icon />
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* Profile */}
      <div
        className="absolute bottom-3 left-5 p-2 flex gap-2 items-center"
      >
        <UserButton />
        <span className="text-gray-600">Profile</span>
      </div>
    </div>
  );
}

export default SideNav;
