'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import dynamic from 'next/dynamic';
import { IconArrowLeft, IconCalculator, IconBeach, IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useUserStore } from '@/stores/useUserStore';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

const AreaChart = dynamic(() => import('recharts').then((mod) => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then((mod) => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const ReferenceLine = dynamic(() => import('recharts').then((mod) => mod.ReferenceLine), { ssr: false });

export default function RetirementPlannerPage() {
  const { currency } = useUserStore();
  
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(90);
  
  const [currentSavings, setCurrentSavings] = useState<number>(500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  
  const [annualRetirementExpenses, setAnnualRetirementExpenses] = useState<number>(1200000);
  
  const [preRetirementReturn, setPreRetirementReturn] = useState<number>(10);
  const [postRetirementReturn, setPostRetirementReturn] = useState<number>(6);
  const [inflationRate, setInflationRate] = useState<number>(5);

  const [chartData, setChartData] = useState<any[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [shortfallAge, setShortfallAge] = useState<number | null>(null);

  const calculateRetirement = () => {
    let balance = currentSavings;
    const data = [];
    
    // Convert annual rates to real rates (inflation adjusted) roughly: (1+return)/(1+inflation) - 1
    const preRealReturn = (1 + preRetirementReturn/100) / (1 + inflationRate/100) - 1;
    const postRealReturn = (1 + postRetirementReturn/100) / (1 + inflationRate/100) - 1;
    
    let isShortfall = false;
    let brokeAge = null;

    for (let age = currentAge; age <= lifeExpectancy; age++) {
      if (age < retirementAge) {
        // Accumulation phase
        balance = balance * (1 + preRealReturn) + (monthlyContribution * 12);
        data.push({ age, balance: Math.max(0, Math.round(balance)), phase: 'Accumulation' });
      } else {
        // Distribution phase
        // Subtract expenses first at the start of the year, then grow the rest
        if (balance < annualRetirementExpenses) {
            balance = 0;
            if (!isShortfall) {
                isShortfall = true;
                brokeAge = age;
            }
        } else {
            balance = (balance - annualRetirementExpenses) * (1 + postRealReturn);
        }
        data.push({ age, balance: Math.max(0, Math.round(balance)), phase: 'Retirement' });
      }
    }

    setChartData(data);
    setSuccess(!isShortfall);
    setShortfallAge(brokeAge);
    setHasCalculated(true);
  };

  return (
    <PageLayout>
      <Container className="pb-12 max-w-6xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-h2 font-bold mb-4 text-brand-text-primary">Retirement Age Simulator</h1>
          <p className="text-body text-brand-text-secondary max-w-2xl">
            Find out if your nest egg will last through your golden years. Adjust your retirement age, savings, and expenses to build a bulletproof plan.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Card variant="elevated" className="p-6">
              <h3 className="text-h4 font-semibold text-brand-text-primary border-b border-brand-border pb-3 mb-4">Timeline</h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Current Age" type="number" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
                    <Input label="Retirement Age" type="number" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
                </div>
                <Input label="Life Expectancy" type="number" value={lifeExpectancy} onChange={(e) => setLifeExpectancy(Number(e.target.value))} />
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <h3 className="text-h4 font-semibold text-brand-text-primary border-b border-brand-border pb-3 mb-4">Money</h3>
              <div className="flex flex-col gap-4">
                <Input label="Current Savings" type="number" value={currentSavings} onChange={(e) => setCurrentSavings(Number(e.target.value))} />
                <Input label="Monthly Contribution" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(Number(e.target.value))} />
                <Input label="Desired Annual Income in Retirement (Today's Value)" type="number" value={annualRetirementExpenses} onChange={(e) => setAnnualRetirementExpenses(Number(e.target.value))} />
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <h3 className="text-h4 font-semibold text-brand-text-primary border-b border-brand-border pb-3 mb-4">Market Expectations</h3>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Pre-Retirement Return (%)" type="number" value={preRetirementReturn} onChange={(e) => setPreRetirementReturn(Number(e.target.value))} />
                    <Input label="Post-Retirement Return (%)" type="number" value={postRetirementReturn} onChange={(e) => setPostRetirementReturn(Number(e.target.value))} />
                </div>
                <Input label="Inflation Rate (%)" type="number" value={inflationRate} onChange={(e) => setInflationRate(Number(e.target.value))} />
              </div>
            </Card>

            <Button onClick={calculateRetirement} variant="primary" size="lg" className="w-full" icon={<IconCalculator size={20} />}>
              Run Simulation
            </Button>
          </div>

          <div className="lg:col-span-8 flex flex-col">
            <Card variant="elevated" className="h-full p-6 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-brand-text-primary">
                <IconBeach className="text-brand-primary" />
                <h3 className="text-h4 font-semibold">Your Retirement Trajectory</h3>
              </div>

              {hasCalculated ? (
                <>
                  <div className={`mb-6 p-4 rounded-xl border ${success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      {success ? (
                        <IconCheck className="text-green-600 mt-1" size={24} />
                      ) : (
                        <IconAlertTriangle className="text-red-600 mt-1" size={24} />
                      )}
                      <div>
                        <h4 className={`text-lg font-bold ${success ? 'text-green-800' : 'text-red-800'}`}>
                          {success ? 'Looking Good!' : 'Warning: Funds Depleted Early'}
                        </h4>
                        <p className={`text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>
                          {success 
                            ? `Your savings are projected to last through age ${lifeExpectancy} based on your current plan.` 
                            : `Your savings are projected to run out at age ${shortfallAge}. Consider saving more, retiring later, or reducing retirement expenses.`}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={success ? "#10B981" : "#F59E0B"} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={success ? "#10B981" : "#F59E0B"} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                        <XAxis 
                          dataKey="age" 
                          tickFormatter={(val) => `Age ${val}`}
                          stroke="#9ca3af"
                          fontSize={12}
                        />
                        <YAxis 
                          tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                          stroke="#9ca3af"
                          fontSize={12}
                          width={60}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), "Portfolio Balance"]}
                          labelFormatter={(label) => `Age: ${label}`}
                          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <ReferenceLine x={retirementAge} stroke="#3B82F6" strokeDasharray="3 3" label={{ position: 'top', value: 'Retirement', fill: '#3B82F6', fontSize: 12 }} />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          stroke={success ? "#10B981" : "#F59E0B"} 
                          fillOpacity={1} 
                          fill="url(#colorBalance)" 
                          strokeWidth={3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-brand-text-tertiary">
                  <IconBeach size={64} className="mb-4 opacity-20" />
                  <p>Enter your details and run the simulation to see if you are ready for retirement.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
