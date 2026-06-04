'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
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
import { ChartSkeleton } from '@/components/ui/Skeleton';
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false, loading: () => <div className="w-full h-full"><ChartSkeleton /></div> });
import { PageLayout } from "@/components/layout/PageLayout";
import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

export default function SIPGrowthLab() {
  const { currency } = useUserStore();
  const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [years, setYears] = useState(10);
  const [adjustForInflation, setAdjustForInflation] = useState(false);
  const inflationRate = 6; // 6% assumed inflation

  const { chartData, totalInvested, futureValue, wealthGained, milestones } = useMemo(() => {
    const data = [];
    // Adjust return rate if inflation is considered
    const effectiveReturn = adjustForInflation 
      ? ((1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1) * 100 
      : expectedReturn;

    const monthlyRate = effectiveReturn / 100 / 12;

    let targetMilestones = [
      { amount: 1000000, label: "₹10 Lakhs", hit: false, year: 0 },
      { amount: 5000000, label: "₹50 Lakhs", hit: false, year: 0 },
      { amount: 10000000, label: "₹1 Crore", hit: false, year: 0 },
    ];

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

      // Check milestones
      targetMilestones.forEach((ms) => {
        if (!ms.hit && fvAtYear >= ms.amount) {
          ms.hit = true;
          ms.year = y;
        }
      });
    }

    const finalData = data[data.length - 1] || { invested: 0, returns: 0, total: 0 };
    const achievedMilestones = targetMilestones.filter(m => m.hit);

    return {
      chartData: data,
      totalInvested: finalData.invested,
      wealthGained: finalData.returns,
      futureValue: finalData.total,
      milestones: achievedMilestones
    };
  }, [monthlyInvestment, expectedReturn, years, adjustForInflation]);

  return (
    <PageLayout>
        <Container>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-6 pt-6"
          >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/learn" className="flex items-center justify-center rounded-full w-10 h-10 bg-brand-surface-elevated hover:bg-brand-primary/10 transition-colors text-brand-text-secondary">
              <IconArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-display text-brand-primary mb-1">SIP Growth Lab</h1>
              <p className="text-sm text-brand-text-secondary">Visualize your systematic investment growth.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Controls */}
            <Card variant="elevated" className="lg:col-span-4 glass-strong space-y-8 p-6 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl">
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Monthly SIP</label>
                  <span className="text-brand-primary font-bold bg-brand-primary/10 px-3 py-1 rounded-md text-sm border border-brand-primary/20">
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
                <div className="flex justify-between text-xs text-brand-text-tertiary font-medium">
                  <span>{formatCurrency(500, currency)}</span>
                  <span>{formatCurrency(100000, currency)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Expected Return (p.a)</label>
                  <span className="text-brand-success font-bold bg-brand-success/10 px-3 py-1 rounded-md text-sm border border-brand-success/20">
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
                <div className="flex justify-between text-xs text-brand-text-tertiary font-medium">
                  <span>1%</span>
                  <span>30%</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Time Horizon</label>
                  <span className="text-brand-warning font-bold bg-brand-warning/10 px-3 py-1 rounded-md text-sm border border-brand-warning/20">
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
                <div className="flex justify-between text-xs text-brand-text-tertiary font-medium">
                  <span>1 Yr</span>
                  <span>40 Yrs</span>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all">
                  <input
                    type="checkbox"
                    checked={adjustForInflation}
                    onChange={(e) => setAdjustForInflation(e.target.checked)}
                    className="w-5 h-5 accent-brand-primary rounded focus:ring-brand-primary/50"
                  />
                  <div>
                    <span className="text-sm font-semibold block text-slate-800">Adjust for Inflation</span>
                    <span className="text-xs text-slate-500 block mt-0.5">Assumes {inflationRate}% annual inflation</span>
                  </div>
                </label>
              </div>

              {milestones.length > 0 && (
                <div className="pt-4 border-t border-brand-border">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider text-xs">Growth Milestones</h4>
                  <div className="space-y-2">
                    {milestones.map((ms, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-brand-surface-elevated px-3 py-2 rounded-lg border border-slate-100">
                        <span className="text-sm font-medium text-brand-primary">{ms.label}</span>
                        <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded-md border border-slate-200">Year {ms.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </Card>

            {/* Results & Chart */}
            <div className="lg:col-span-8 space-y-6 flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="glass-strong bg-white/80 border border-slate-200 shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-text-secondary mb-1">Total Invested</p>
                  <p className="text-xl font-display text-slate-800">{formatCurrency(totalInvested, currency)}</p>
                </Card>
                <Card className="glass-strong bg-emerald-50/50 border border-emerald-100 shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-success mb-1">Wealth Gain</p>
                  <p className="text-xl font-display text-emerald-700">{formatCurrency(wealthGained, currency)}</p>
                </Card>
                <Card className="glass-strong bg-blue-50/50 border border-blue-100 shadow-sm p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-1">Future Value</p>
                  <p className="text-2xl font-display font-black text-blue-700">{formatCurrency(futureValue, currency)}</p>
                </Card>
              </div>

              <Card variant="elevated" className="glass-strong flex-1 min-h-[450px] p-6 bg-white shadow-xl border border-slate-200">
                <h3 className="text-lg font-semibold mb-6 text-slate-800">Wealth Projection</h3>
                <div className="w-full h-[350px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 40 }}>
                      <defs>
                        <linearGradient id="colorInvestedLab" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorReturnsLab" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.8} />
                      <XAxis 
                        dataKey="year" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        minTickGap={20}
                        dy={15}
                      />
                      <YAxis 
                        tickFormatter={(val) => {
                          if (val >= 10000000) return `₹${(val/10000000).toFixed(1)}Cr`;
                          if (val >= 100000) return `₹${(val/100000).toFixed(1)}L`;
                          if (val >= 1000) return `₹${(val/1000).toFixed(0)}k`;
                          return `₹${val}`;
                        }}
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        width={60}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '1px solid #e2e8f0',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: any, name: any) => [formatCurrency(value, currency), name]}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px' }} />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        name="Total Value" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorReturnsLab)" 
                        strokeWidth={3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="invested" 
                        name="Invested Amount" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorInvestedLab)" 
                        strokeWidth={3}
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
