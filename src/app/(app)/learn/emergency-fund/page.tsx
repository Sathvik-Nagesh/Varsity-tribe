'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconAmbulance, IconShieldCheck, IconArrowLeft, IconSparkles, IconBriefcase, IconUsers, IconAlertCircle } from '@tabler/icons-react';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { Button, Card, ProgressBar } from '@/components/ui';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatCurrency';

type Phase = 'setup' | 'simulation' | 'completed';
type JobRisk = 'Low' | 'Medium' | 'High';

export default function EmergencyFundPage() {
  const router = useRouter();
  const { addXP, currency } = useUserStore();
  
  // Setup State
  const [phase, setPhase] = useState<Phase>('setup');
  const [expenses, setExpenses] = useState<number>(3000);
  const [dependents, setDependents] = useState<number>(0);
  const [jobRisk, setJobRisk] = useState<JobRisk>('Medium');
  
  // Simulation State
  const [fund, setFund] = useState(0);
  const [recommendedMonths, setRecommendedMonths] = useState(3);
  const [goal, setGoal] = useState(0);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const calculateGoal = () => {
    let months = 3;
    if (dependents === 1) months += 1;
    if (dependents >= 2) months += 2;
    if (jobRisk === 'Medium') months += 1;
    if (jobRisk === 'High') months += 3;
    
    // Cap at 12 months, min 3
    months = Math.max(3, Math.min(12, months));
    
    setRecommendedMonths(months);
    const targetGoal = months * expenses;
    setGoal(targetGoal);
    setFund(targetGoal); // Start simulation with full fund
    setPhase('simulation');
  };

  const scenarios = [
    {
      title: "Unexpected Travel",
      description: `A family member is ill and you need to book a last-minute flight and hotel for a week.`,
      cost: expenses * 0.5,
      options: [
        { text: `Use Emergency Fund`, impact: -(expenses * 0.5), msg: "Good use of the fund. This is exactly what it's for." },
        { text: "Put on Credit Card", impact: 0, msg: "You preserved your fund but now have high-interest debt." }
      ]
    },
    {
      title: "Medical Emergency",
      description: `You had an unexpected hospital visit resulting in a large out-of-pocket medical bill.`,
      cost: expenses * 1.5,
      options: [
        { text: `Pay from Emergency Fund`, impact: -(expenses * 1.5), msg: "Ouch! But your emergency fund saved you from debt." },
        { text: "Set up a Payment Plan", impact: -(expenses * 0.2), msg: "Smart! Spreading the cost with a 0% interest payment plan." }
      ]
    },
    {
      title: "Lost Job!",
      description: `Your company downsized and you were laid off. It takes you 3 months to find a new job.`,
      cost: expenses * 3,
      options: [
        { text: `Live off Emergency Fund`, impact: -(expenses * 3), msg: "Your emergency fund kept a roof over your head. Well done!" }
      ]
    }
  ];

  const handleChoice = (impact: number, msg: string) => {
    setFund(prev => Math.max(0, prev + impact));
    setFeedback(msg);
    
    setTimeout(() => {
      setFeedback(null);
      if (scenarioIndex < scenarios.length - 1) {
        setScenarioIndex(scenarioIndex + 1);
      } else {
        setPhase('completed');
        addXP(300);
      }
    }, 2500);
  };

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
              Emergency Fund
            </h1>
            <p className="text-slate-600 mt-2">Calculate your ideal safety net and test it against real-life shocks.</p>
          </div>
          
          {phase !== 'setup' && (
            <div className="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-700">Fund Balance</span>
                <span className="text-sm font-bold text-rose-600">{formatCurrency(fund, currency)}</span>
              </div>
              <ProgressBar value={(fund / goal) * 100} className="h-2 bg-slate-100" />
              <div className="text-xs text-slate-500 mt-2 text-right">Goal: {formatCurrency(goal, currency)}</div>
            </div>
          )}
        </div>

        <Card className="p-8 shadow-lg border-rose-100 bg-white min-h-[400px]">
          <AnimatePresence mode="wait">
            {phase === 'setup' && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-2xl mx-auto"
              >
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Build Your Safety Net</h2>
                  <p className="text-slate-600">Let's calculate how much you really need.</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                      <IconAlertCircle size={18} className="text-slate-400" />
                      Monthly Essential Expenses
                    </label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="1000" max="10000" step="100"
                        value={expenses}
                        onChange={(e) => setExpenses(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                      />
                      <span className="font-bold text-lg min-w-[100px] text-right">{formatCurrency(expenses, currency)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <IconUsers size={18} className="text-slate-400" />
                        Dependents
                      </label>
                      <select 
                        value={dependents}
                        onChange={(e) => setDependents(Number(e.target.value))}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      >
                        <option value={0}>None (Just me)</option>
                        <option value={1}>1 Dependent</option>
                        <option value={2}>2 Dependents</option>
                        <option value={3}>3+ Dependents</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                        <IconBriefcase size={18} className="text-slate-400" />
                        Job Risk Level
                      </label>
                      <select 
                        value={jobRisk}
                        onChange={(e) => setJobRisk(e.target.value as JobRisk)}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 outline-none"
                      >
                        <option value="Low">Low (Stable, high demand)</option>
                        <option value="Medium">Medium (Average stability)</option>
                        <option value="High">High (Freelancer, volatile industry)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button variant="primary" onClick={calculateGoal} className="px-8">
                      Calculate Goal
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {phase === 'simulation' && (
              <motion.div
                key="simulation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-2xl mx-auto text-center"
              >
                {!feedback ? (
                  <>
                    <div className="mb-8">
                      <span className="inline-block bg-rose-100 text-rose-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                        Scenario {scenarioIndex + 1} of {scenarios.length}
                      </span>
                      <h2 className="text-2xl font-bold text-slate-900 mb-4">{scenarios[scenarioIndex].title}</h2>
                      <p className="text-slate-600 text-lg">{scenarios[scenarioIndex].description}</p>
                      <div className="mt-4 text-xl font-bold text-red-500">
                        Cost: {formatCurrency(scenarios[scenarioIndex].cost, currency)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {scenarios[scenarioIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleChoice(option.impact, option.msg)}
                          className={`p-4 rounded-xl border-2 transition-all font-medium flex flex-col items-center justify-center gap-2
                            ${option.impact === 0 
                              ? 'border-slate-200 hover:border-slate-400 text-slate-700' 
                              : 'border-rose-200 hover:border-rose-500 bg-rose-50 text-rose-700'}
                          `}
                        >
                          <span>{option.text}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="py-12"
                  >
                    <div className="text-2xl font-bold text-slate-900 mb-4">Result</div>
                    <p className="text-xl text-slate-600 mb-8">{feedback}</p>
                    <div className="text-lg">
                      Remaining Fund: <span className="font-bold">{formatCurrency(fund, currency)}</span>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}

            {phase === 'completed' && (
              <motion.div
                key="completed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <IconShieldCheck size={40} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">You Survived the Unexpected!</h2>
                
                <div className="bg-slate-50 rounded-2xl p-6 mb-8 max-w-md mx-auto text-left">
                  <h3 className="font-bold text-slate-800 mb-4 border-b pb-2">Your Personal Recommendation</h3>
                  <ul className="space-y-3 text-slate-600">
                    <li className="flex justify-between">
                      <span>Target Months:</span>
                      <span className="font-bold text-slate-900">{recommendedMonths} Months</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Target Amount:</span>
                      <span className="font-bold text-slate-900">{formatCurrency(goal, currency)}</span>
                    </li>
                    <li className="flex justify-between pt-2 border-t text-sm">
                      <span>Fund Remaining:</span>
                      <span className={`font-bold ${fund > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {formatCurrency(fund, currency)}
                      </span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 max-w-sm mx-auto flex items-center justify-center gap-4">
                  <IconSparkles className="text-blue-500" size={32} />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Reward</div>
                    <div className="text-2xl font-bold text-blue-900">+300 XP</div>
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button variant="secondary" onClick={() => router.push('/learn')}>
                    Back to Learn
                  </Button>
                  <Button variant="primary" onClick={() => {
                    setPhase('setup');
                    setScenarioIndex(0);
                    setFeedback(null);
                  }}>
                    Recalculate
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>
    </PageLayout>
  );
}
