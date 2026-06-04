'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import dynamic from 'next/dynamic';
import { IconCalculator, IconTrendingUp, IconArrowLeft, IconInfoCircle } from '@tabler/icons-react';
import { useUserStore } from '@/stores/useUserStore';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

const LineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const Line = dynamic(() => import('recharts').then((mod) => mod.Line), { ssr: false });
const XAxis = dynamic(() => import('recharts').then((mod) => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then((mod) => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then((mod) => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then((mod) => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then((mod) => mod.ResponsiveContainer), { ssr: false });
const Legend = dynamic(() => import('recharts').then((mod) => mod.Legend), { ssr: false });

interface DataPoint {
  age: number;
  year: number;
  currentHabits: number;
  targetHabits: number;
}

export default function FutureYouPage() {
  const [age, setAge] = useState<number>(25);
  const [currentSavings, setCurrentSavings] = useState<number>(100000);
  const [currentMonthly, setCurrentMonthly] = useState<number>(5000);
  const [targetMonthly, setTargetMonthly] = useState<number>(15000);
  const [returnRate, setReturnRate] = useState<number>(10);

  const { currency } = useUserStore();
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateFuture = () => {
    let currentNW1 = currentSavings;
    let currentNW2 = currentSavings;
    const rate = returnRate / 100 / 12; // monthly rate
    
    const data: DataPoint[] = [];
    
    for (let year = 0; year <= 30; year++) {
      if (year === 0) {
        data.push({
          year: 0,
          age: age,
          currentHabits: Math.round(currentSavings),
          targetHabits: Math.round(currentSavings)
        });
        continue;
      }
      
      // Calculate for 12 months
      for (let m = 0; m < 12; m++) {
        currentNW1 = currentNW1 * (1 + rate) + currentMonthly;
        currentNW2 = currentNW2 * (1 + rate) + targetMonthly;
      }
      
      data.push({
        year,
        age: age + year,
        currentHabits: Math.round(currentNW1),
        targetHabits: Math.round(currentNW2)
      });
    }
    
    setChartData(data);
    setHasCalculated(true);
    triggerConfetti();
  };

  const triggerConfetti = async () => {
    const confetti = (await import('canvas-confetti')).default;
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10B981', '#3B82F6', '#6366f1']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10B981', '#3B82F6', '#6366f1']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const getDifferenceInsights = () => {
    if (!hasCalculated || chartData.length === 0) return null;
    const finalYear = chartData[chartData.length - 1];
    const diff = finalYear.targetHabits - finalYear.currentHabits;
    return (
      <div className="mt-6 bg-brand-primary/10 rounded-xl p-6 border border-brand-primary/20">
        <h4 className="text-h5 font-semibold text-brand-primary mb-2 flex items-center gap-2">
          <IconInfoCircle size={20} />
          Lifestyle Impact
        </h4>
        <p className="text-body text-brand-text-primary mb-4">
          By saving an extra <strong>{formatCurrency(targetMonthly - currentMonthly, currency)}</strong> per month, you will have an additional <strong>{formatCurrency(diff, currency)}</strong> in 30 years.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <span className="text-2xl mb-2 block">🏖️</span>
            <p className="text-sm text-brand-text-secondary">Extra luxury vacations every year</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <span className="text-2xl mb-2 block">🏡</span>
            <p className="text-sm text-brand-text-secondary">A fully paid off dream home</p>
          </div>
          <div className="bg-brand-surface border border-brand-border rounded-lg p-4">
            <span className="text-2xl mb-2 block">⏳</span>
            <p className="text-sm text-brand-text-secondary">Option to retire 5-10 years earlier</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageLayout>
      <Container className="pb-12 max-w-5xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-h2 font-bold mb-4 text-brand-text-primary">Future You Simulator</h1>
          <p className="text-body text-brand-text-secondary max-w-2xl">
            Compare your current savings habits with a target goal to see the projected impact on your lifestyle and net worth over 30 years.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card variant="elevated" className="col-span-1 flex flex-col gap-4">
            <h3 className="text-h4 font-semibold text-brand-text-primary border-b border-brand-border pb-2">Your Details</h3>
            
            <Input
              label="Current Age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
            />
            <Input
              label="Current Accumulated Savings"
              type="number"
              value={currentSavings}
              onChange={(e) => setCurrentSavings(Number(e.target.value))}
            />
            <Input
              label="Current Monthly Savings"
              type="number"
              value={currentMonthly}
              onChange={(e) => setCurrentMonthly(Number(e.target.value))}
            />
            <Input
              label="Target Monthly Savings"
              type="number"
              value={targetMonthly}
              onChange={(e) => setTargetMonthly(Number(e.target.value))}
            />
            <Input
              label="Expected Annual Return (%)"
              type="number"
              value={returnRate}
              onChange={(e) => setReturnRate(Number(e.target.value))}
            />

            <div className="mt-4 pt-4 border-t border-brand-border">
              <Button onClick={calculateFuture} variant="primary" className="w-full" icon={<IconCalculator size={20} />}>
                Calculate Future
              </Button>
            </div>
          </Card>

          <Card variant="elevated" className="col-span-1 lg:col-span-2 flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-brand-text-primary">
              <IconTrendingUp className="text-brand-primary" />
              <h3 className="text-h4 font-semibold">30-Year Projection</h3>
            </div>

            {hasCalculated ? (
              <>
                <div className="w-full h-full min-h-[350px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis 
                        dataKey="age" 
                        tickFormatter={(val) => `Age ${val}`}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickMargin={10}
                      />
                      <YAxis 
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickMargin={10}
                      />
                      <Tooltip 
                        formatter={(value: any, name: any) => [
                          formatCurrency(Number(value) || 0, currency), 
                          String(name) === "currentHabits" ? "Current Habit" : "Target Habit"
                        ]}
                        labelFormatter={(label) => `Age: ${label}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend verticalAlign="top" height={36}/>
                      <Line 
                        name="Current Habit"
                        type="monotone" 
                        dataKey="currentHabits" 
                        stroke="#6B7280" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#6B7280" }}
                      />
                      <Line 
                        name="Target Habit"
                        type="monotone" 
                        dataKey="targetHabits" 
                        stroke="#3B82F6" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#3B82F6" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                {getDifferenceInsights()}
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-brand-text-tertiary">
                <IconTrendingUp size={48} className="mb-4 opacity-20" />
                <p>Enter your details and calculate to see your projection.</p>
              </div>
            )}
          </Card>
        </div>
      </Container>
    </PageLayout>
  );
}
