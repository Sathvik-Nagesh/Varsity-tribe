'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IconArrowLeft, IconTarget, IconCheck, IconAlertTriangle, IconDownload, IconBulb, IconTrendingUp } from '@tabler/icons-react';
import Link from 'next/link';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { PageLayout } from "@/components/layout/PageLayout";
import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

export default function RetirementPlannerPage() {
  const { currency } = useUserStore();
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(60);
  const [monthlyInvestment, setMonthlyInvestment] = useState(20000);
  const [expectedReturn, setExpectedReturn] = useState(12);
  const [targetCorpus, setTargetCorpus] = useState(50000000); // 5Cr

  const { chartData, projectedCorpus, shortfall, isOnTrack } = useMemo(() => {
    const years = Math.max(1, retirementAge - currentAge);
    const data = [];
    const monthlyRate = expectedReturn / 100 / 12;

    let fvAtYear = 0;
    
    // Calculate for each year until retirement
    for (let y = 1; y <= years; y++) {
      const m = y * 12;
      const invAtYear = monthlyInvestment * m;
      
      if (monthlyRate === 0) {
        fvAtYear = invAtYear;
      } else {
        fvAtYear = monthlyInvestment * (Math.pow(1 + monthlyRate, m) - 1) / monthlyRate * (1 + monthlyRate);
      }

      data.push({
        age: currentAge + y,
        projected: fvAtYear,
        target: targetCorpus,
      });
    }

    const finalCorpus = data.length > 0 ? data[data.length - 1].projected : 0;
    const isTrack = finalCorpus >= targetCorpus;
    const diff = targetCorpus - finalCorpus;

    return {
      chartData: data,
      projectedCorpus: finalCorpus,
      shortfall: isTrack ? 0 : diff,
      isOnTrack: isTrack,
    };
  }, [currentAge, retirementAge, monthlyInvestment, expectedReturn, targetCorpus]);

  return (
    <PageLayout>
        <Container >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-6 min-w-0"
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4 min-w-0">
                <Link href="/tools" className="flex-shrink-0 flex items-center justify-center rounded-full w-10 h-10 bg-brand-surface-elevated hover:bg-brand-primary/10 transition-colors text-brand-text-secondary">
                  <IconArrowLeft size={20} />
                </Link>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight truncate">Retirement Planner</h1>
                  <p className="text-sm text-brand-text-secondary truncate">Find out if you are on track for a comfortable retirement.</p>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="hidden sm:flex flex-shrink-0">
                <IconDownload size={16} className="mr-2" />
                Download Report
              </Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 min-w-0">
              {/* Input Controls */}
              <Card variant="elevated" className="xl:col-span-4 glass-strong space-y-6 max-h-[85vh] overflow-y-auto min-w-0">
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center min-w-0">
                    <label className="text-sm font-medium truncate pr-2">Current Age</label>
                    <span className="text-brand-text-primary font-semibold bg-brand-surface px-3 py-1 rounded-full text-sm border border-brand-border flex-shrink-0">
                      {currentAge} yrs
                    </span>
                  </div>
                  <input 
                    type="range" min="18" max="70" step="1"
                    value={currentAge} 
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className="w-full accent-brand-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center min-w-0">
                    <label className="text-sm font-medium truncate pr-2">Retirement Age</label>
                    <span className="text-brand-text-primary font-semibold bg-brand-surface px-3 py-1 rounded-full text-sm border border-brand-border flex-shrink-0">
                      {retirementAge} yrs
                    </span>
                  </div>
                  <input 
                    type="range" min={Math.min(currentAge + 1, 75)} max="75" step="1"
                    value={retirementAge} 
                    onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Number(e.target.value)))}
                    className="w-full accent-brand-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center min-w-0">
                    <label className="text-sm font-medium truncate pr-2">Target Corpus</label>
                    <span className="text-brand-warning font-semibold bg-brand-warning/10 px-3 py-1 rounded-full text-sm flex-shrink-0">
                      {formatCurrency(targetCorpus, currency)}
                    </span>
                  </div>
                  <input 
                    type="range" min="1000000" max="500000000" step="1000000"
                    value={targetCorpus} 
                    onChange={(e) => setTargetCorpus(Number(e.target.value))}
                    className="w-full accent-brand-warning"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center min-w-0">
                    <label className="text-sm font-medium truncate pr-2">Monthly Investment</label>
                    <span className="text-brand-primary font-semibold bg-brand-primary/10 px-3 py-1 rounded-full text-sm flex-shrink-0">
                      {formatCurrency(monthlyInvestment, currency)}
                    </span>
                  </div>
                  <input 
                    type="range" min="1000" max="500000" step="1000"
                    value={monthlyInvestment} 
                    onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    className="w-full accent-brand-primary"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center min-w-0">
                    <label className="text-sm font-medium truncate pr-2">Expected Return (p.a)</label>
                    <span className="text-brand-success font-semibold bg-brand-success/10 px-3 py-1 rounded-full text-sm flex-shrink-0">
                      {expectedReturn}%
                    </span>
                  </div>
                  <input 
                    type="range" min="1" max="25" step="1"
                    value={expectedReturn} 
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className="w-full accent-brand-success"
                  />
                </div>

              </Card>

              {/* Results & Chart */}
              <div className="xl:col-span-8 space-y-6 flex flex-col min-w-0">
                {/* Gap Analysis */}
                <Card className={`glass-strong border min-w-0 ${isOnTrack ? 'bg-brand-success-bg/20 border-brand-success' : 'bg-brand-warning-bg/20 border-brand-warning'} flex flex-col sm:flex-row items-center justify-between gap-4 p-6`}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={`p-3 rounded-full flex-shrink-0 ${isOnTrack ? 'bg-brand-success/20 text-brand-success' : 'bg-brand-warning/20 text-brand-warning'}`}>
                      {isOnTrack ? <IconCheck size={32} /> : <IconAlertTriangle size={32} />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold truncate">
                        {isOnTrack ? 'You are on track!' : 'Action Required!'}
                      </h3>
                      <p className="text-sm text-brand-text-secondary mt-1 max-w-md line-clamp-2">
                        {isOnTrack 
                          ? `Your projected corpus exceeds your target. Keep up the good work!` 
                          : `You are falling short of your target by ${formatCurrency(shortfall, currency)}. Consider increasing your monthly investment or retirement age.`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-brand-text-secondary">Projected Corpus</p>
                    <p className={`text-2xl font-black ${isOnTrack ? 'text-brand-success' : 'text-brand-warning'}`}>
                      {formatCurrency(projectedCorpus, currency)}
                    </p>
                  </div>
                </Card>

                <Card variant="elevated" className="glass-strong flex-1 min-h-[400px] p-6 min-w-0">
                  <div className="flex justify-between items-center mb-6 min-w-0">
                    <h3 className="text-sm font-medium truncate">Corpus Growth vs Target</h3>
                    <Badge variant="neutral" size="sm" icon={<IconTarget size={14} />} className="flex-shrink-0">
                      Target: {formatCurrency(targetCorpus, currency)}
                    </Badge>
                  </div>
                  <div className="w-full h-full min-h-[400px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="var(--color-primary, #6366f1)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--brand-border)" opacity={0.5} />
                        <XAxis 
                          dataKey="age" 
                          tickFormatter={(val) => `Age ${val}`}
                          tick={{ fontSize: 12, fill: 'var(--brand-text-tertiary)' }}
                          axisLine={false}
                          tickLine={false}
                          minTickGap={30}
                        />
                        <YAxis 
                          tickFormatter={(val) => `${(val/10000000).toFixed(1)}Cr`}
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
                          labelFormatter={(label) => `Age: ${label}`}
                          formatter={(value: any, name: any) => [formatCurrency(value, currency), name]}
                        />
                        <ReferenceLine y={targetCorpus} stroke="var(--color-warning, #f59e0b)" strokeDasharray="5 5" label={{ position: 'top', value: 'Target', fill: 'var(--color-warning, #f59e0b)', fontSize: 12 }} />
                        <Area 
                          type="monotone" 
                          dataKey="projected" 
                          name="projected" 
                          stroke="var(--color-primary, #6366f1)" 
                          fillOpacity={1} 
                          fill="url(#colorProjected)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* New Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-w-0">
                  {/* Insights & Recommendations */}
                  <Card className="glass-strong p-5 min-w-0">
                    <div className="flex items-center gap-2 mb-4 min-w-0">
                      <IconBulb className="text-brand-primary flex-shrink-0" size={20} />
                      <h3 className="font-semibold truncate">Insights & Recommendations</h3>
                    </div>
                    <ul className="space-y-3 text-sm text-brand-text-secondary">
                      <li className="flex items-start gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0"></span>
                        <span className="min-w-0">Consider stepping up your SIP by 10% annually to reach your goal faster.</span>
                      </li>
                      <li className="flex items-start gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0"></span>
                        <span className="min-w-0">Your expected return of {expectedReturn}% assumes an aggressive portfolio. Ensure you rebalance as you age.</span>
                      </li>
                      <li className="flex items-start gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-1.5 flex-shrink-0"></span>
                        <span className="min-w-0">Review your target corpus periodically to adjust for lifestyle changes.</span>
                      </li>
                    </ul>
                  </Card>

                  {/* Inflation Analysis */}
                  <Card className="glass-strong p-5 min-w-0">
                    <div className="flex items-center gap-2 mb-4 min-w-0">
                      <IconTrendingUp className="text-brand-warning flex-shrink-0" size={20} />
                      <h3 className="font-semibold truncate">Inflation Analysis</h3>
                    </div>
                    <div className="space-y-4 min-w-0">
                      <div className="bg-brand-surface rounded-lg p-3 border border-brand-border min-w-0">
                        <p className="text-xs text-brand-text-tertiary mb-1 truncate">Current Monthly Expenses (Estimated)</p>
                        <p className="font-medium truncate">{formatCurrency(50000, currency)}</p>
                      </div>
                      <div className="bg-brand-surface rounded-lg p-3 border border-brand-border min-w-0">
                        <p className="text-xs text-brand-text-tertiary mb-1 truncate">Expenses at Retirement (6% inflation)</p>
                        <p className="font-medium text-brand-warning truncate">
                          {formatCurrency(50000 * Math.pow(1.06, retirementAge - currentAge), currency)}
                        </p>
                      </div>
                      <p className="text-xs text-brand-text-secondary mt-2">
                        *Assuming a 6% average inflation rate until retirement.
                      </p>
                    </div>
                  </Card>
                </div>

              </div>
            </div>
          </motion.div>
        </Container>
      </PageLayout>
    );
}
