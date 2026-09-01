"use client";

import { useState } from "react";
import { Calculator, IndianRupee, Percent, Clock } from "lucide-react";
import { calculateEMI, formatIndianCurrency } from "../../lib/formatters";

interface EMICalculatorProps {
  propertyPrice: number;
}

export default function EMICalculator({ propertyPrice }: EMICalculatorProps) {
  const [loanAmount, setLoanAmount] = useState<number>(Math.round(propertyPrice * 0.8));
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);

  const { monthlyEMI, totalInterest, totalPayment } = calculateEMI(
    loanAmount / 0.8,
    interestRate,
    tenureYears
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#0B192C] text-[#C5A059] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Home Loan EMI Calculator</h3>
            <p className="text-xs text-slate-500">Provided in partnership with Tulya Home Loans</p>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Interest from 8.35%
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Sliders Input */}
        <div className="space-y-4">
          {/* Loan Amount Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Loan Amount (80% of property)</span>
              <span className="font-bold text-[#0B192C]">{formatIndianCurrency(loanAmount)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={propertyPrice}
              step={50000}
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B192C]"
            />
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Interest Rate (% P.A.)</span>
              <span className="font-bold text-[#0B192C]">{interestRate}%</span>
            </div>
            <input
              type="range"
              min={7.5}
              max={12.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B192C]"
            />
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Loan Tenure</span>
              <span className="font-bold text-[#0B192C]">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={1}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0B192C]"
            />
          </div>
        </div>

        {/* EMI Result Output Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center space-y-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Estimated Monthly EMI
            </span>
            <div className="text-3xl font-black text-[#0B192C] tracking-tight mt-1">
              ₹{monthlyEMI.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-slate-500">/month</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 text-xs">
            <div className="p-2 bg-white rounded-xl border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Principal Loan</span>
              <span className="font-bold text-slate-800">{formatIndianCurrency(loanAmount)}</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-100">
              <span className="block text-slate-400 text-[10px] uppercase font-bold">Total Interest</span>
              <span className="font-bold text-slate-800">{formatIndianCurrency(totalInterest)}</span>
            </div>
          </div>

          <a
            href="tel:+919876543210"
            className="block w-full py-2.5 bg-[#0B192C] hover:bg-[#1E3E62] text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            Check Loan Eligibility with Tulya Finance
          </a>
        </div>
      </div>
    </div>
  );
}
