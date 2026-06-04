'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { IconArrowLeft, IconCalculator, IconPlus, IconTrash, IconSnowflake, IconMountain } from '@tabler/icons-react';
import { useUserStore } from '@/stores/useUserStore';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

interface Debt {
  id: string;
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

interface PayoffResult {
  method: string;
  totalInterest: number;
  monthsToPayoff: number;
  schedule: { month: number; remaining: number }[];
}

export default function LoanRepaymentPage() {
  const { currency } = useUserStore();
  
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card', balance: 5000, rate: 22, minPayment: 150 },
    { id: '2', name: 'Car Loan', balance: 15000, rate: 6, minPayment: 300 },
    { id: '3', name: 'Student Loan', balance: 25000, rate: 4.5, minPayment: 250 },
  ]);
  const [extraPayment, setExtraPayment] = useState<number>(200);
  const [results, setResults] = useState<{ snowball: PayoffResult, avalanche: PayoffResult } | null>(null);

  const addDebt = () => {
    setDebts([...debts, { id: Math.random().toString(), name: `Debt ${debts.length + 1}`, balance: 1000, rate: 10, minPayment: 50 }]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(d => d.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const calculatePayoff = () => {
    const runSimulation = (method: 'snowball' | 'avalanche'): PayoffResult => {
      // deep copy
      let currentDebts = debts.map(d => ({ ...d }));
      let totalInterest = 0;
      let month = 0;
      const schedule: { month: number; remaining: number }[] = [];
      
      const totalMinPayment = currentDebts.reduce((sum, d) => sum + d.minPayment, 0);
      const totalAvailableMonthly = totalMinPayment + extraPayment;

      let remainingBalance = currentDebts.reduce((sum, d) => sum + d.balance, 0);
      schedule.push({ month: 0, remaining: remainingBalance });

      // circuit breaker
      while (remainingBalance > 0 && month < 360) {
        month++;
        
        // Apply interest
        currentDebts.forEach(d => {
          if (d.balance > 0) {
            const interest = d.balance * (d.rate / 100 / 12);
            d.balance += interest;
            totalInterest += interest;
          }
        });

        // Sort debts based on method
        if (method === 'snowball') {
          currentDebts.sort((a, b) => a.balance - b.balance); // Lowest balance first
        } else {
          currentDebts.sort((a, b) => b.rate - a.rate); // Highest interest first
        }

        let fundsLeft = totalAvailableMonthly;

        // Pay minimums first
        currentDebts.forEach(d => {
          if (d.balance > 0) {
            let payment = Math.min(d.minPayment, d.balance);
            if (fundsLeft >= payment) {
              d.balance -= payment;
              fundsLeft -= payment;
            } else {
              // Not enough to cover minimums - ideally shouldn't happen if they can afford extra payment
              d.balance -= fundsLeft;
              fundsLeft = 0;
            }
          }
        });

        // Apply remaining funds to targeted debt
        for (let i = 0; i < currentDebts.length; i++) {
          let d = currentDebts[i];
          if (d.balance > 0 && fundsLeft > 0) {
            let payment = Math.min(fundsLeft, d.balance);
            d.balance -= payment;
            fundsLeft -= payment;
          }
        }

        remainingBalance = currentDebts.reduce((sum, d) => sum + d.balance, 0);
        schedule.push({ month, remaining: remainingBalance });
      }

      return {
        method,
        totalInterest,
        monthsToPayoff: month,
        schedule
      };
    };

    setResults({
      snowball: runSimulation('snowball'),
      avalanche: runSimulation('avalanche')
    });
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
          <h1 className="text-h2 font-bold mb-4 text-brand-text-primary">Debt Freedom Simulator</h1>
          <p className="text-body text-brand-text-secondary max-w-2xl">
            Compare the Snowball and Avalanche methods for paying off your debt. See how extra payments can save you money and time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-6">
            <Card variant="elevated" className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-h4 font-semibold text-brand-text-primary">Your Debts</h3>
                <Button variant="secondary" size="sm" onClick={addDebt} icon={<IconPlus size={16} />}>
                  Add Debt
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                {debts.map((debt, index) => (
                  <div key={debt.id} className="relative p-4 border border-brand-border rounded-xl bg-brand-surface">
                    <button 
                      onClick={() => removeDebt(debt.id)}
                      className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                      title="Remove debt"
                    >
                      <IconTrash size={14} />
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <Input
                          label="Debt Name"
                          value={debt.name}
                          onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Input
                          label="Current Balance"
                          type="number"
                          value={debt.balance}
                          onChange={(e) => updateDebt(debt.id, 'balance', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Input
                          label="Interest Rate (%)"
                          type="number"
                          value={debt.rate}
                          onChange={(e) => updateDebt(debt.id, 'rate', Number(e.target.value))}
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <Input
                          label="Minimum Payment"
                          type="number"
                          value={debt.minPayment}
                          onChange={(e) => updateDebt(debt.id, 'minPayment', Number(e.target.value))}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card variant="elevated" className="p-6">
              <h3 className="text-h4 font-semibold text-brand-text-primary mb-4">Extra Monthly Payment</h3>
              <p className="text-sm text-brand-text-secondary mb-4">
                How much extra can you put towards your debt each month beyond the minimum payments?
              </p>
              <Input
                label="Extra Payment Amount"
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
              />
              <div className="mt-6">
                <Button onClick={calculatePayoff} variant="primary" className="w-full" size="lg" icon={<IconCalculator size={20} />}>
                  Compare Strategies
                </Button>
              </div>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            {results ? (
              <>
                <Card variant="elevated" className="p-6 border-t-4 border-t-blue-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                      <IconSnowflake size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h4 font-semibold text-brand-text-primary mb-1">Debt Snowball</h3>
                      <p className="text-sm text-brand-text-secondary mb-4">Pay off smallest balances first to build momentum.</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
                          <p className="text-xs text-brand-text-secondary mb-1">Time to Debt Free</p>
                          <p className="text-lg font-bold text-brand-text-primary">
                            {Math.floor(results.snowball.monthsToPayoff / 12)}y {results.snowball.monthsToPayoff % 12}m
                          </p>
                        </div>
                        <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
                          <p className="text-xs text-brand-text-secondary mb-1">Total Interest Paid</p>
                          <p className="text-lg font-bold text-red-500">
                            {formatCurrency(results.snowball.totalInterest, currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" className="p-6 border-t-4 border-t-purple-500">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                      <IconMountain size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-h4 font-semibold text-brand-text-primary mb-1">Debt Avalanche</h3>
                      <p className="text-sm text-brand-text-secondary mb-4">Pay off highest interest rates first to save the most money.</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
                          <p className="text-xs text-brand-text-secondary mb-1">Time to Debt Free</p>
                          <p className="text-lg font-bold text-brand-text-primary">
                            {Math.floor(results.avalanche.monthsToPayoff / 12)}y {results.avalanche.monthsToPayoff % 12}m
                          </p>
                        </div>
                        <div className="bg-brand-surface p-4 rounded-xl border border-brand-border">
                          <p className="text-xs text-brand-text-secondary mb-1">Total Interest Paid</p>
                          <p className="text-lg font-bold text-red-500">
                            {formatCurrency(results.avalanche.totalInterest, currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200">
                  <h4 className="font-semibold mb-2">The Verdict</h4>
                  <p className="text-sm">
                    {results.avalanche.totalInterest < results.snowball.totalInterest ? (
                      <>The <strong>Avalanche method</strong> saves you <strong>{formatCurrency(results.snowball.totalInterest - results.avalanche.totalInterest, currency)}</strong> in interest. However, the Snowball method might give you quicker early wins to stay motivated!</>
                    ) : (
                      <>Both methods result in similar interest paid. Pick the one that keeps you motivated!</>
                    )}
                  </p>
                </div>
              </>
            ) : (
              <Card variant="elevated" className="h-full flex flex-col items-center justify-center p-12 text-center text-brand-text-tertiary">
                <IconCalculator size={64} className="mb-4 opacity-20" />
                <h3 className="text-h5 font-semibold text-brand-text-secondary mb-2">Awaiting Calculation</h3>
                <p className="text-sm max-w-sm">
                  Add your debts and an extra monthly payment, then calculate to see which strategy works best for you.
                </p>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
