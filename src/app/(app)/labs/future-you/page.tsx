'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import confetti from 'canvas-confetti';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { IconCalculator, IconTrendingUp, IconArrowLeft } from '@tabler/icons-react';
import { useUserStore } from '@/stores/useUserStore';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

interface DataPoint {
  age: number;
  year: number;
  netWorth: number;
}

export default function FutureYouPage() {
  const [age, setAge] = useState<number>(25);
  const [salary, setSalary] = useState<number>(60000);
  const [expenses, setExpenses] = useState<number>(40000);
  const [savings, setSavings] = useState<number>(10000);
  const [returnRate, setReturnRate] = useState<number>(7);

  const { currency } = useUserStore();

  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);

  const calculateFuture = () => {
    let currentNetWorth = savings;
    const annualSavings = salary - expenses;
    const rate = returnRate / 100;
    
    const data: DataPoint[] = [];
    
    for (let i = 0; i <= 30; i++) {
      data.push({
        year: i,
        age: age + i,
        netWorth: Math.round(currentNetWorth)
      });
      
      currentNetWorth = currentNetWorth * (1 + rate) + annualSavings;
    }
    
    setChartData(data);
    setHasCalculated(true);
    triggerConfetti();
  };

  const triggerConfetti = () => {
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10B981', '#34D399', '#059669']
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10B981', '#34D399', '#059669']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
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
            Peek into your financial future. Enter your details below to see how your net worth could grow over the next 30 years through the power of compound interest.
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
              label="Annual Salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(Number(e.target.value))}
            />
            <Input
              label="Annual Expenses"
              type="number"
              value={expenses}
              onChange={(e) => setExpenses(Number(e.target.value))}
            />
            <Input
              label="Current Savings"
              type="number"
              value={savings}
              onChange={(e) => setSavings(Number(e.target.value))}
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
              <IconTrendingUp className="text-[#10B981]" />
              <h3 className="text-h4 font-semibold">30-Year Projection</h3>
            </div>

            {hasCalculated ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[5, 10, 20, 30].map(years => {
                    const dataPoint = chartData.find(d => d.year === years);
                    return (
                      <div key={years} className="bg-brand-surface border border-brand-border rounded-xl p-4 text-center">
                        <p className="text-small text-brand-text-secondary mb-1">In {years} Years</p>
                        <p className="font-bold text-brand-primary text-lg">{dataPoint ? formatCurrency(dataPoint.netWorth, currency) : formatCurrency(0, currency)}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="w-full h-full min-h-[400px] min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
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
                        formatter={(value: any) => [formatCurrency(Number(value) || 0, currency), "Net Worth"]}
                        labelFormatter={(label) => `Age: ${label}`}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="netWorth" 
                        stroke="#10B981" 
                        strokeWidth={3}
                        dot={false}
                        activeDot={{ r: 6, fill: "#10B981" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
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
