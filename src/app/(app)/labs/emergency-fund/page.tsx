'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconAmbulance, IconShieldCheck, IconCoin, IconSparkles, IconTrendingDown, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { Button, Card, ProgressBar } from '@/components/ui';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatCurrency';

export default function EmergencyFundPage() {
  const router = useRouter();
  const { addXP, currency } = useUserStore();
  const [month, setMonth] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [fund, setFund] = useState(0);
  const [goal] = useState(3000); // $3000 target emergency fund

  const monthlyEvents = [
    { month: 1, income: 4000, expenses: 3000, description: `Normal month. You have ${formatCurrency(1000, currency)} left.` },
    { month: 2, income: 4000, expenses: 3200, description: `Minor dent in car, ${formatCurrency(200, currency)} unexpected expense.` },
    { month: 3, income: 4000, expenses: 3000, description: `Normal month. You have ${formatCurrency(1000, currency)} left.` },
    { month: 4, income: 4000, expenses: 4500, description: `Medical emergency! ${formatCurrency(1500, currency)} bill.` }
  ];

  const handleSave = (amount: number) => {
    setFund(prev => prev + amount);
    
    if (month < monthlyEvents.length) {
      setMonth(month + 1);
    } else {
      setCompleted(true);
      addXP(250); // XP for Emergency Fund Challenge
    }
  };

  const currentEvent = monthlyEvents[month - 1];
  const availableToSave = currentEvent ? currentEvent.income - currentEvent.expenses : 0;
  const isDeficit = availableToSave < 0;

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <IconAmbulance className="text-rose-500" size={32} />
              Emergency Fund Challenge
            </h1>
            <p className="text-slate-600 mt-2">Build a {formatCurrency(3000, currency)} safety net before disaster strikes.</p>
          </div>
          
          <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-slate-700">Emergency Fund</span>
              <span className="text-sm font-bold text-rose-600">{formatCurrency(fund, currency)} / {formatCurrency(goal, currency)}</span>
            </div>
            <ProgressBar value={(fund / goal) * 100} className="h-2 bg-slate-100" />
          </div>
        </div>

        <Card className="p-8 shadow-lg border-rose-100 bg-white">
          {!completed ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="text-center mb-8">
                  <span className="inline-block bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                    Month {month}
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">{currentEvent.description}</h2>
                  
                  <div className="flex justify-center gap-8 mt-6">
                    <div className="text-center">
                      <div className="text-sm text-slate-500">Income</div>
                      <div className="text-xl font-bold text-green-600">+ {formatCurrency(currentEvent.income, currency)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-slate-500">Expenses</div>
                      <div className="text-xl font-bold text-red-500">- {formatCurrency(currentEvent.expenses, currency)}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-900 mb-4 text-center">
                    {isDeficit ? 'You have a shortfall!' : 'How much will you save this month?'}
                  </h3>
                  
                  {isDeficit ? (
                    <div className="text-center">
                      <p className="text-slate-600 mb-6">You need to cover {formatCurrency(Math.abs(availableToSave), currency)} from your emergency fund.</p>
                      <Button 
                        variant="danger" 
                        className="w-full sm:w-auto"
                        disabled={fund < Math.abs(availableToSave)}
                        onClick={() => handleSave(availableToSave)}
                      >
                        {fund >= Math.abs(availableToSave) ? `Withdraw ${formatCurrency(Math.abs(availableToSave), currency)} from Fund` : 'Not enough in fund! Game Over.'}
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button
                        onClick={() => handleSave(availableToSave * 0.2)}
                        className="p-4 rounded-xl border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all font-medium text-slate-700"
                      >
                        Save 20% ({formatCurrency(availableToSave * 0.2, currency)})
                      </button>
                      <button
                        onClick={() => handleSave(availableToSave * 0.5)}
                        className="p-4 rounded-xl border-2 border-slate-200 hover:border-rose-500 hover:bg-rose-50 transition-all font-medium text-slate-700"
                      >
                        Save 50% ({formatCurrency(availableToSave * 0.5, currency)})
                      </button>
                      <button
                        onClick={() => handleSave(availableToSave)}
                        className="p-4 rounded-xl border-2 border-rose-500 bg-rose-50 hover:bg-rose-100 transition-all font-bold text-rose-700 shadow-sm"
                      >
                        Save 100% ({formatCurrency(availableToSave, currency)})
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6">
                <IconShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Challenge Completed!</h2>
              <p className="text-slate-600 mb-2">Final Emergency Fund Balance:</p>
              <p className={`text-4xl font-bold mb-8 ${fund >= goal ? 'text-green-500' : 'text-orange-500'}`}>
                {formatCurrency(fund, currency)}
              </p>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 max-w-sm mx-auto flex items-center justify-center gap-4">
                <IconSparkles className="text-blue-500" size={32} />
                <div className="text-left">
                  <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Reward</div>
                  <div className="text-2xl font-bold text-blue-900">+250 XP</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => router.push('/learn')}>
                  Back to Learn
                </Button>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Play Again
                </Button>
              </div>
            </motion.div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
}
