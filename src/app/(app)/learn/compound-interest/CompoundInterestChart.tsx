import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/formatCurrency';
import { useUserStore } from '@/stores/useUserStore';

interface CompoundInterestChartProps {
  monthlyInvestment: number;
  years: number;
  expectedReturn: number;
}

export default function CompoundInterestChart({ monthlyInvestment, years, expectedReturn }: CompoundInterestChartProps) {
  const currency = useUserStore((state) => state.currency);
  const monthlyRate = expectedReturn / 100 / 12;
  
  const data = [];
  for (let i = 1; i <= years; i++) {
    const monthsElapsed = i * 12;
    const principal = monthlyInvestment * monthsElapsed;
    const futureValueAtYear = monthlyRate === 0
      ? principal
      : monthlyInvestment * ((Math.pow(1 + monthlyRate, monthsElapsed) - 1) / monthlyRate);
    const interest = futureValueAtYear - principal;
    
    data.push({
      year: `Yr ${i}`,
      Principal: Math.round(principal),
      Interest: Math.round(interest),
    });
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const principal = payload[0].value;
      const interest = payload[1]?.value || 0;
      const total = principal + interest;
      
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl border border-brand-border shadow-xl">
          <p className="font-bold text-slate-900 mb-2">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-brand-secondary">
              <span className="font-semibold">Contributions:</span> {formatCurrency(principal, currency)}
            </p>
            <p className="text-brand-success">
              <span className="font-semibold">Interest Earned:</span> {formatCurrency(interest, currency)}
            </p>
            <div className="w-full h-px bg-slate-200 my-2" />
            <p className="text-slate-900 font-bold">
              <span>Total Value:</span> {formatCurrency(total, currency)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full p-6 bg-white rounded-2xl">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis 
            dataKey="year" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            tickFormatter={(value) => {
              if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
              if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
              if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
              return `₹${value}`;
            }}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Principal" stackId="a" fill="#387ED1" radius={[0, 0, 4, 4]} />
          <Bar dataKey="Interest" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
