'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { IconArrowLeft, IconAlertCircle } from '@tabler/icons-react';
import { Container } from '@/components/layout/Container';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const PieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then((mod) => mod.Pie), { ssr: false });
const Cell = dynamic(() => import('recharts').then((mod) => mod.Cell), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });
import { ProgressBar } from '@/components/ui/ProgressBar';
import { PageLayout } from "@/components/layout/PageLayout";

const ASSET_COLORS = {
  Equity: '#3b82f6', // blue
  Debt: '#10b981',   // emerald
  Gold: '#f59e0b',   // amber
  Cash: '#94a3b8',   // slate
};

export default function PortfolioAnalyzerPage() {
  const [equity, setEquity] = useState(60);
  const [debt, setDebt] = useState(25);
  const [gold, setGold] = useState(10);
  const [cash, setCash] = useState(5);

  const total = equity + debt + gold + cash;
  const isBalanced = total === 100;

  const { chartData, riskProfile, riskScore, diversificationScore } = useMemo(() => {
    // Normalize to 100% for chart and calculations if total is not 0
    const factor = total > 0 ? 100 / total : 0;
    const normEquity = equity * factor;
    const normDebt = debt * factor;
    const normGold = gold * factor;
    const normCash = cash * factor;

    const data = [
      { name: 'Equity', value: normEquity, color: ASSET_COLORS.Equity },
      { name: 'Debt', value: normDebt, color: ASSET_COLORS.Debt },
      { name: 'Gold', value: normGold, color: ASSET_COLORS.Gold },
      { name: 'Cash', value: normCash, color: ASSET_COLORS.Cash },
    ].filter(item => item.value > 0);

    // Risk Profile
    let profile = 'Moderate';
    let riskSc = 50;
    if (normEquity > 75) {
      profile = 'Very Aggressive';
      riskSc = 90;
    } else if (normEquity > 60) {
      profile = 'Aggressive';
      riskSc = 75;
    } else if (normEquity > 40) {
      profile = 'Moderate';
      riskSc = 50;
    } else if (normEquity > 20) {
      profile = 'Conservative';
      riskSc = 30;
    } else {
      profile = 'Very Conservative';
      riskSc = 15;
    }

    // Diversification Score (simple metric based on having multiple asset classes)
    let activeAssets = 0;
    if (normEquity > 5) activeAssets++;
    if (normDebt > 5) activeAssets++;
    if (normGold > 5) activeAssets++;
    if (normCash > 2) activeAssets++;

    let divScore = (activeAssets / 4) * 100;
    // Penalize if one asset is too high (poor diversification)
    if (normEquity > 80 || normDebt > 80) divScore -= 20;
    if (divScore < 0) divScore = 0;
    if (divScore > 100) divScore = 100;

    return {
      chartData: data,
      riskProfile: profile,
      riskScore: riskSc,
      diversificationScore: divScore
    };
  }, [equity, debt, gold, cash, total]);

  return (
    <PageLayout>
        <Container >
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-6 min-w-0"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <Link href="/tools" className="flex-shrink-0 flex items-center justify-center rounded-full w-10 h-10 bg-brand-surface-elevated hover:bg-brand-primary/10 transition-colors text-brand-text-secondary">
                  <IconArrowLeft size={20} />
                </Link>
                <div className="min-w-0">
                  <h1 className="text-2xl font-bold tracking-tight truncate">Portfolio Analyzer</h1>
                  <p className="text-sm text-brand-text-secondary truncate">Analyze asset allocation and risk profile.</p>
                </div>
              </div>
            </div>

            {!isBalanced && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="bg-brand-warning-bg border border-brand-warning text-brand-warning px-4 py-3 rounded-lg flex items-center gap-3">
                  <IconAlertCircle size={20} className="flex-shrink-0" />
                  <p className="text-sm font-medium min-w-0">Your total allocation is {total}%. It should ideally sum to 100%. The charts below are showing normalized percentages.</p>
                </div>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
              {/* Input Controls */}
              <Card variant="elevated" className="lg:col-span-5 glass-strong space-y-6 min-w-0">
                <div className="flex justify-between items-center mb-2 min-w-0">
                  <h3 className="font-semibold truncate">Asset Allocation</h3>
                  <Badge variant={isBalanced ? 'success' : 'warning'} className="flex-shrink-0">Total: {total}%</Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ASSET_COLORS.Equity }}></span>
                      <span className="truncate">Equity</span>
                    </label>
                    <span className="text-brand-text-primary font-semibold bg-brand-surface px-3 py-1 rounded-full text-sm border border-brand-border flex-shrink-0">
                      {equity}%
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="1"
                    value={equity} 
                    onChange={(e) => setEquity(Number(e.target.value))}
                    className="w-full accent-blue-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ASSET_COLORS.Debt }}></span>
                      <span className="truncate">Debt</span>
                    </label>
                    <span className="text-brand-text-primary font-semibold bg-brand-surface px-3 py-1 rounded-full text-sm border border-brand-border flex-shrink-0">
                      {debt}%
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="1"
                    value={debt} 
                    onChange={(e) => setDebt(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ASSET_COLORS.Gold }}></span>
                      <span className="truncate">Gold</span>
                    </label>
                    <span className="text-brand-text-primary font-semibold bg-brand-surface px-3 py-1 rounded-full text-sm border border-brand-border flex-shrink-0">
                      {gold}%
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="1"
                    value={gold} 
                    onChange={(e) => setGold(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ASSET_COLORS.Cash }}></span>
                      <span className="truncate">Cash</span>
                    </label>
                    <span className="text-brand-text-primary font-semibold bg-brand-surface px-3 py-1 rounded-full text-sm border border-brand-border flex-shrink-0">
                      {cash}%
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="100" step="1"
                    value={cash} 
                    onChange={(e) => setCash(Number(e.target.value))}
                    className="w-full accent-slate-400"
                  />
                </div>
              </Card>

              {/* Results & Chart */}
              <div className="lg:col-span-7 space-y-6 flex flex-col min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="glass-strong border-brand-primary/20 p-5 min-w-0">
                    <div className="flex justify-between items-start mb-4 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm text-brand-text-secondary mb-1 truncate">Risk Profile</p>
                        <p className="text-xl font-bold truncate">{riskProfile}</p>
                      </div>
                      <Badge variant={riskScore > 70 ? 'danger' : riskScore > 40 ? 'warning' : 'success'} className="flex-shrink-0">
                        Score: {riskScore}/100
                      </Badge>
                    </div>
                    <ProgressBar 
                      value={riskScore} 
                      color={riskScore > 70 ? 'danger' : riskScore > 40 ? 'warning' : 'success'} 
                      size="sm" 
                    />
                  </Card>
                  
                  <Card className="glass-strong border-brand-success/20 p-5 min-w-0">
                    <div className="flex justify-between items-start mb-4 min-w-0">
                      <div className="min-w-0">
                        <p className="text-sm text-brand-text-secondary mb-1 truncate">Diversification</p>
                        <p className="text-xl font-bold truncate">
                          {diversificationScore >= 80 ? 'Excellent' : diversificationScore >= 50 ? 'Fair' : 'Poor'}
                        </p>
                      </div>
                      <Badge variant={diversificationScore >= 80 ? 'success' : diversificationScore >= 50 ? 'warning' : 'danger'} className="flex-shrink-0">
                        Score: {diversificationScore}/100
                      </Badge>
                    </div>
                    <ProgressBar 
                      value={diversificationScore} 
                      color={diversificationScore >= 80 ? 'success' : diversificationScore >= 50 ? 'warning' : 'danger'} 
                      size="sm" 
                    />
                  </Card>
                </div>

                <Card variant="elevated" className="glass-strong flex-1 min-h-[350px] p-6 flex flex-col items-center justify-center min-w-0">
                  <h3 className="text-sm font-medium w-full text-center mb-4 truncate">Allocation Breakdown</h3>
                  <div className="w-full h-full min-h-[400px] min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={100}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Allocation']}
                          contentStyle={{ borderRadius: '8px', border: '1px solid var(--brand-border)', backgroundColor: 'var(--brand-surface)' }}
                        />
                        <Legend verticalAlign="bottom" height={36} wrapperStyle={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} />
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
