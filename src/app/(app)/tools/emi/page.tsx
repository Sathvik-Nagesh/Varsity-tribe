'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { PageLayout } from "@/components/layout/PageLayout";
import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

const COLORS = ['#6366f1', '#f43f5e']; // Primary and Danger/Warning roughly

export default function EMICalculatorPage() {
  const { currency } = useUserStore();
  const [loanAmount, setLoanAmount] = useState(5000000); // 50L
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(15);

  const { emi, totalInterest, totalPayment, chartData } = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 100 / 12;
    const n = tenureYears * 12;
    
    let calculatedEmi = 0;
    let tInterest = 0;
    let tPayment = P;

    if (r === 0) {
      calculatedEmi = P / n;
    } else {
      calculatedEmi = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      tPayment = calculatedEmi * n;
      tInterest = tPayment - P;
    }

    return {
      emi: calculatedEmi,
      totalInterest: tInterest,
      totalPayment: tPayment,
      chartData: [
        { name: 'Principal Amount', value: P },
        { name: 'Total Interest', value: tInterest },
      ]
    };
  }, [loanAmount, interestRate, tenureYears]);

  return (
    <PageLayout>
        <Container >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pb-6"
        >
          <div className="flex items-center gap-4">
            <Link href="/tools" className="flex items-center justify-center rounded-full w-10 h-10 bg-brand-surface-elevated hover:bg-brand-primary/10 transition-colors text-brand-text-secondary">
              <IconArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">EMI Calculator</h1>
              <p className="text-sm text-brand-text-secondary">Plan your loan repayment schedule.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <Card variant="elevated" className="lg:col-span-5 glass-strong space-y-8">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Loan Amount</label>
                  <span className="text-brand-primary font-semibold bg-brand-primary/10 px-3 py-1 rounded-full text-sm">
                    {formatCurrency(loanAmount, currency)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="100000" 
                  max="50000000" 
                  step="100000"
                  value={loanAmount} 
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-brand-text-tertiary">
                  <span>{formatCurrency(100000, currency)}</span>
                  <span>{formatCurrency(50000000, currency)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Interest Rate (p.a)</label>
                  <span className="text-brand-danger font-semibold bg-brand-danger/10 px-3 py-1 rounded-full text-sm">
                    {interestRate}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="25" 
                  step="0.1"
                  value={interestRate} 
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-brand-danger"
                />
                <div className="flex justify-between text-xs text-brand-text-tertiary">
                  <span>1%</span>
                  <span>25%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Loan Tenure</label>
                  <span className="text-brand-warning font-semibold bg-brand-warning/10 px-3 py-1 rounded-full text-sm">
                    {tenureYears} Yr{tenureYears > 1 ? 's' : ''}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={tenureYears} 
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-brand-warning"
                />
                <div className="flex justify-between text-xs text-brand-text-tertiary">
                  <span>1 Yr</span>
                  <span>30 Yrs</span>
                </div>
              </div>

            </Card>

            {/* Results & Chart */}
            <div className="lg:col-span-7 space-y-6 flex flex-col">
              <Card className="glass-strong bg-brand-surface/60 border-brand-primary/20 p-6 text-center">
                <p className="text-sm text-brand-text-secondary mb-2">Equated Monthly Installment (EMI)</p>
                <p className="text-4xl font-black text-brand-primary">{formatCurrency(emi, currency)}</p>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="glass-strong text-center">
                  <p className="text-sm text-brand-text-secondary mb-1">Total Interest</p>
                  <p className="text-xl font-bold text-brand-danger">{formatCurrency(totalInterest, currency)}</p>
                </Card>
                <Card className="glass-strong text-center">
                  <p className="text-sm text-brand-text-secondary mb-1">Total Payment</p>
                  <p className="text-xl font-bold">{formatCurrency(totalPayment, currency)}</p>
                </Card>
              </div>

              <Card variant="elevated" className="glass-strong flex-1 min-h-[300px] p-6 flex flex-col items-center justify-center">
                <h3 className="text-sm font-medium w-full mb-2">Breakup of Total Payment</h3>
                <div className="w-full h-full min-h-[400px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any) => formatCurrency(value, currency)}
                        contentStyle={{ borderRadius: '8px', border: '1px solid var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
        </Container>
      </PageLayout>
    );
}
