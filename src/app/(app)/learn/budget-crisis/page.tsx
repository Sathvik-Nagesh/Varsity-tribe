'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconReportMoney, IconAlertTriangle, IconCheck, IconArrowRight, IconSparkles, IconArrowLeft, IconWallet, IconHome, IconCar, IconPizza, IconDeviceGamepad2, IconPigMoney } from '@tabler/icons-react';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { Button, Card } from '@/components/ui';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatCurrency';

type Phase = 'setup' | 'simulation' | 'completed';

export default function BudgetCrisisPage() {
  const router = useRouter();
  const { addXP, currency } = useUserStore();
  
  const salary = 5000;
  const [phase, setPhase] = useState<Phase>('setup');
  
  // Budget Categories
  const [budget, setBudget] = useState({
    rent: 1500,
    food: 600,
    transport: 400,
    entertainment: 500,
    savingsGoal: 1000,
  });

  const totalAllocated = Object.values(budget).reduce((a, b) => a + b, 0);
  const buffer = salary - totalAllocated;

  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [success, setSuccess] = useState(true);

  const startSimulation = () => {
    if (buffer < 0) {
      alert("You cannot allocate more than your salary!");
      return;
    }
    setPhase('simulation');
  };

  const updateBudget = (category: keyof typeof budget, value: number) => {
    setBudget(prev => ({ ...prev, [category]: Math.max(0, value) }));
  };

  const shocks = [
    {
      title: "Car Breakdown",
      description: `Your car transmission failed. The mechanic says it'll cost ${formatCurrency(600, currency)}.`,
      options: [
        { 
          text: `Use buffer (${formatCurrency(buffer, currency)}) and cut Entertainment`, 
          action: () => {
            const needed = Math.max(0, 600 - buffer);
            updateBudget('entertainment', budget.entertainment - needed);
          },
          msg: "Good job reallocating discretionary funds to cover the emergency!"
        },
        { 
          text: `Raid your Savings Goal`, 
          action: () => {
            updateBudget('savingsGoal', budget.savingsGoal - 600);
          },
          msg: "You covered it, but your long-term savings took a direct hit."
        }
      ]
    },
    {
      title: "Rent Increase",
      description: `Your landlord is raising rent by ${formatCurrency(200, currency)} per month. You must adjust your monthly budget permanently.`,
      options: [
        { 
          text: `Cut Food & Entertainment by ${formatCurrency(100, currency)} each`, 
          action: () => {
            updateBudget('rent', budget.rent + 200);
            updateBudget('food', budget.food - 100);
            updateBudget('entertainment', budget.entertainment - 100);
          },
          msg: "A tough lifestyle cut, but you maintained your savings goals."
        },
        { 
          text: `Reduce Savings Goal by ${formatCurrency(200, currency)}`, 
          action: () => {
            updateBudget('rent', budget.rent + 200);
            updateBudget('savingsGoal', budget.savingsGoal - 200);
          },
          msg: "You maintained your lifestyle, but your future self will have less saved."
        }
      ]
    },
    {
      title: "Inflation Spike",
      description: `Groceries and gas are more expensive. Food goes up ${formatCurrency(150, currency)}, Transport up ${formatCurrency(50, currency)}.`,
      options: [
        { 
          text: `Absorb it by cutting Entertainment by ${formatCurrency(200, currency)}`, 
          action: () => {
            updateBudget('food', budget.food + 150);
            updateBudget('transport', budget.transport + 50);
            updateBudget('entertainment', budget.entertainment - 200);
          },
          msg: "Very disciplined! You sacrificed fun to keep the budget balanced."
        },
        { 
          text: `Use the buffer / Ignore and potentially go into debt`, 
          action: () => {
            updateBudget('food', budget.food + 150);
            updateBudget('transport', budget.transport + 50);
          },
          msg: "Dangerous game! If your buffer doesn't cover it, you're using credit cards."
        }
      ]
    }
  ];

  const handleChoice = (option: any) => {
    option.action();
    setFeedback(option.msg);
    
    setTimeout(() => {
      setFeedback(null);
      // Check if user went negative in important categories or over budget
      const newTotal = Object.values(budget).reduce((a, b) => a + b, 0);
      if (newTotal > salary || budget.food < 0 || budget.transport < 0) {
        setSuccess(false);
      }

      if (step < shocks.length - 1) {
        setStep(step + 1);
      } else {
        setPhase('completed');
        addXP(400); // XP for Budget Crisis Simulator
      }
    }, 2500);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>

        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <IconReportMoney className="text-orange-500" size={32} />
              Budget Balancer
            </h1>
            <p className="text-slate-600 mt-2">Allocate your income and defend it against real-world shocks.</p>
          </div>
          
          <div className="w-full md:w-auto bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-6">
            <div>
              <div className="text-sm font-semibold text-slate-500">Monthly Income</div>
              <div className="text-xl font-bold text-slate-800">{formatCurrency(salary, currency)}</div>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <div className="text-sm font-semibold text-slate-500">Buffer (Unallocated)</div>
              <div className={`text-xl font-bold ${buffer >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(buffer, currency)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Budget Overview */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-slate-50 border-slate-200 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <IconWallet size={20} className="text-slate-500" />
                Current Budget
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600"><IconHome size={16}/> Rent</div>
                  <div className="font-semibold">{formatCurrency(budget.rent, currency)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600"><IconPizza size={16}/> Food</div>
                  <div className="font-semibold">{formatCurrency(budget.food, currency)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600"><IconCar size={16}/> Transport</div>
                  <div className="font-semibold">{formatCurrency(budget.transport, currency)}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-slate-600"><IconDeviceGamepad2 size={16}/> Entertainment</div>
                  <div className="font-semibold">{formatCurrency(budget.entertainment, currency)}</div>
                </div>
                <div className="pt-3 border-t border-slate-200 flex justify-end items-center">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex items-center gap-2 text-emerald-600 font-medium"><IconPigMoney size={16}/> Savings Goal</div>
                    <div className="font-bold text-emerald-600">{formatCurrency(budget.savingsGoal, currency)}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Total Expenses</span>
                  <span className={`font-bold ${totalAllocated > salary ? 'text-red-500' : 'text-slate-800'}`}>
                    {formatCurrency(totalAllocated, currency)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full mt-2 overflow-hidden">
                  <div 
                    className={`h-full ${totalAllocated > salary ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (totalAllocated / salary) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Card className="p-8 shadow-lg border-orange-100 bg-white min-h-[400px]">
              <AnimatePresence mode="wait">
                {phase === 'setup' && (
                  <motion.div
                    key="setup"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-slate-900">Step 1: Allocate Your Budget</h2>
                      <p className="text-slate-600">Adjust your starting allocations before the month begins. Make sure you don't exceed your salary!</p>
                    </div>

                    <div className="space-y-6 mb-8">
                      {Object.entries(budget).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex justify-between items-center mb-1">
                            <label className="text-sm font-medium text-slate-700 capitalize">
                              {key === 'savingsGoal' ? 'Savings Goal' : key}
                            </label>
                            <span className="font-semibold">{formatCurrency(value, currency)}</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" max="3000" step="50"
                            value={value}
                            onChange={(e) => updateBudget(key as keyof typeof budget, Number(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button variant="primary" onClick={startSimulation} disabled={buffer < 0}>
                        Start Month
                      </Button>
                    </div>
                  </motion.div>
                )}

                {phase === 'simulation' && (
                  <motion.div
                    key="simulation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {!feedback ? (
                      <>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                            Shock {step + 1} of {shocks.length}
                          </span>
                        </div>
                        
                        <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                          <IconAlertTriangle className="text-orange-500" />
                          {shocks[step].title}
                        </h2>
                        <p className="text-slate-700 text-lg mb-8">{shocks[step].description}</p>

                        <div className="space-y-4">
                          {shocks[step].options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleChoice(option)}
                              className="w-full text-left p-4 rounded-xl border-2 border-slate-200 hover:border-orange-500 hover:bg-orange-50 transition-all group flex items-center justify-between"
                            >
                              <span className="text-slate-700 font-medium group-hover:text-orange-700">{option.text}</span>
                              <IconArrowRight className="text-slate-400 group-hover:text-orange-500 transition-colors" />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="py-12 text-center"
                      >
                        <div className="text-2xl font-bold text-slate-900 mb-4">Outcome</div>
                        <p className="text-xl text-slate-600">{feedback}</p>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {phase === 'completed' && (
                  <motion.div
                    key="completed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-6"
                  >
                    <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 
                      ${success && buffer >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {success && buffer >= 0 ? <IconCheck size={40} /> : <IconAlertTriangle size={40} />}
                    </div>
                    
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      {success && buffer >= 0 ? 'You Survived the Month!' : 'Budget Blown!'}
                    </h2>
                    
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                      {success && buffer >= 0 
                        ? 'You successfully navigated unexpected expenses without going into debt.' 
                        : 'Your expenses exceeded your income. In the real world, this means credit card debt!'}
                    </p>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 max-w-sm mx-auto flex items-center justify-center gap-4">
                      <IconSparkles className="text-blue-500" size={32} />
                      <div className="text-left">
                        <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Reward</div>
                        <div className="text-2xl font-bold text-blue-900">+400 XP</div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <Button variant="secondary" onClick={() => router.push('/learn')}>
                        Back to Learn
                      </Button>
                      <Button variant="primary" onClick={() => {
                        setPhase('setup');
                        setStep(0);
                        setFeedback(null);
                        setSuccess(true);
                        setBudget({
                          rent: 1500,
                          food: 600,
                          transport: 400,
                          entertainment: 500,
                          savingsGoal: 1000,
                        });
                      }}>
                        Try Again
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
