import React from 'react';
import { formatCurrency } from '@/lib/formatCurrency';
import { useUserStore } from '@/stores/useUserStore';

interface CompoundInterestTableProps {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
}

export default function CompoundInterestTable({ monthlyInvestment, years, expectedReturn }: CompoundInterestTableProps) {
  const currency = useUserStore((state) => state.currency);
  const monthlyRate = expectedReturn / 100 / 12;
  
  const rows = [];
  for (let i = 1; i <= years; i++) {
    const monthsElapsed = i * 12;
    const principal = monthlyInvestment * monthsElapsed;
    const futureValueAtYear = monthlyRate === 0
      ? principal
      : monthlyInvestment * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);
    const interest = futureValueAtYear - principal;
    
    rows.push({
      year: i,
      principal: Math.round(principal),
      interest: Math.round(interest),
      total: Math.round(futureValueAtYear),
    });
  }

  return (
    <div className="w-full h-full overflow-y-auto bg-white rounded-2xl p-6">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
          <tr>
            <th className="px-6 py-3 rounded-tl-lg">Year</th>
            <th className="px-6 py-3">Total Contributions</th>
            <th className="px-6 py-3">Total Interest</th>
            <th className="px-6 py-3 rounded-tr-lg">Final Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.year} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">Year {row.year}</td>
              <td className="px-6 py-4 text-brand-secondary">{formatCurrency(row.principal, currency)}</td>
              <td className="px-6 py-4 text-brand-success">{formatCurrency(row.interest, currency)}</td>
              <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(row.total, currency)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
