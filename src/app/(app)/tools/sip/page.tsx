'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import dynamic from 'next/dynamic';

const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
import { PageLayout } from "@/components/layout/PageLayout";
import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

export default function SIPCalculatorPage() {
  const { currency } = useUserStore();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);

  const { chartData, totalInvested, futureValue, wealthGained } = useMemo(() => {
    const data = [];
    const monthlyRate = expectedReturn / 100 / 12;
    const months = years * 12;

    let totalInv = 0;
    
    // For chart, we'll calculate end of each year
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const invAtYear = monthlyInvestment * m;
      let fvAtYear = 0;
      
      if (monthlyRate === 0) {
        fvAtYear = invAtYear;
      } else {
        fvAtYear = monthlyInvestment * (Math.pow(1 + monthlyRate, m) - 1) / monthlyRate * (1 + monthlyRate);
      }

      data.push({
        year: `Year ${y}`,
        invested: invAtYear,
        returns: fvAtYear - invAtYear,
        total: fvAtYear
      });
    }

    const finalData = data[data.length - 1] || { invested: 0, returns: 0, total: 0 };

    return {
      chartData: data,
      totalInvested: finalData.invested,
      wealthGained: finalData.returns,
      futureValue: finalData.total,
    };
  }, [monthlyInvestment, expectedReturn, years]);

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
              <h1 className="text-2xl font-bold tracking-tight">SIP Calculator</h1>
              <p className="text-sm text-brand-text-secondary">Estimate your mutual fund returns.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls */}
            <Card variant="elevated" className="lg:col-span-4 glass-strong space-y-8">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Monthly Investment</label>
                  <span className="text-brand-primary font-semibold bg-brand-primary/10 px-3 py-1 rounded-full text-sm">
                    {formatCurrency(monthlyInvestment, currency)}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="500" 
                  max="100000" 
                  step="500"
                  value={monthlyInvestment} 
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full accent-brand-primary"
                />
                <div className="flex justify-between text-xs text-brand-text-tertiary">
                  <span>{formatCurrency(500, currency)}</span>
                  <span>{formatCurrency(100000, currency)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Expected Return (p.a)</label>
                  <span className="text-brand-success font-semibold bg-brand-success/10 px-3 py-1 rounded-full text-sm">
                    {expectedReturn}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="30" 
                  step="1"
                  value={expectedReturn} 
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full accent-brand-success"
                />
                <div className="flex justify-between text-xs text-brand-text-tertiary">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Time Period</label>
                  <span className="text-brand-warning font-semibold bg-brand-warning/10 px-3 py-1 rounded-full text-sm">
                    {years} Yr{years > 1 ? 's' : ''}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="40" 
                  step="1"
                  value={years} 
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full accent-brand-warning"
                />
                <div className="flex justify-between text-xs text-brand-text-tertiary">
                  <span>1 Yr</span>
                  <span>40 Yrs</span>
                </div>
              </div>

            </Card>

            {/* Results & Chart */}
            <div className="lg:col-span-8 space-y-6 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="glass-strong bg-brand-surface/60 border-brand-primary/20">
                  <p className="text-sm text-brand-text-secondary mb-1">Total Invested</p>
                  <p className="text-xl font-bold">{formatCurrency(totalInvested, currency)}</p>
                </Card>
                <Card className="glass-strong bg-brand-surface/60 border-brand-success/20">
                  <p className="text-sm text-brand-text-secondary mb-1">Wealth Gained</p>
                  <p className="text-xl font-bold text-brand-success">{formatCurrency(wealthGained, currency)}</p>
                </Card>
                <Card className="glass-strong bg-brand-surface/60 border-brand-warning/20">
                  <p className="text-sm text-brand-text-secondary mb-1">Future Value</p>
                  <p className="text-2xl font-black text-brand-primary">{formatCurrency(futureValue, currency)}</p>
                </Card>
              </div>

              <Card variant="elevated" className="glass-strong flex-1 min-h-[350px] p-6">
                <h3 className="text-sm font-medium mb-6">Investment Growth Over Time</h3>
                <div className="w-full h-full min-h-[400px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--color-success, #10b981)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--color-success, #10b981)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--brand-border)" opacity={0.5} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12, fill: 'var(--brand-text-tertiary)' }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={20}
                      />
                      <YAxis 
                        tickFormatter={(val) => `${(val/100000).toFixed(1)}L`}
                        tick={{ fontSize: 12, fill: 'var(--brand-text-tertiary)' }}
                        axisLine={false}
                        tickLine={false}
                        width={50}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: '1px solid var(--brand-border)',
                          backgroundColor: 'var(--brand-surface)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: any, name: any) => [formatCurrency(value, currency), name]}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        name="Total Value" 
                        stroke="var(--color-success, #10b981)" 
                        fillOpacity={1} 
                        fill="url(#colorReturns)" 
                        strokeWidth={2}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="invested" 
                        name="Invested Amount" 
                        stroke="var(--color-primary, #6366f1)" 
                        fillOpacity={1} 
                        fill="url(#colorInvested)" 
                        strokeWidth={2}
                      />
                    </AreaChart>
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
