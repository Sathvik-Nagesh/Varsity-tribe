'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconReportMoney, IconAlertTriangle, IconCheck, IconArrowRight, IconSparkles, IconArrowLeft } from '@tabler/icons-react';
import Link from 'next/link';
import { useUserStore } from '@/stores/useUserStore';
import { Button, Card } from '@/components/ui';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/formatCurrency';

export default function BudgetCrisisPage() {
  const router = useRouter();
  const { addXP, currency } = useUserStore();
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [budget, setBudget] = useState(3000);
  const [savings, setSavings] = useState(500);

  const scenarios = [
    {
      title: "Car Breakdown",
      description: `Your car transmission failed. The mechanic says it'll cost ${formatCurrency(1200, currency)} to fix. How do you pay for it?`,
      options: [
        { text: `Use emergency savings (${formatCurrency(500, currency)}) + put ${formatCurrency(700, currency)} on Credit Card`, impact: { budget: -150, savings: -500 }, correct: false, feedback: "Using credit adds monthly debt payments (high interest) to your budget." },
        { text: `Take a personal loan for ${formatCurrency(1200, currency)}`, impact: { budget: -250, savings: 0 }, correct: false, feedback: "Personal loans have high interest, severely hurting your monthly budget." },
        { text: `Cut discretionary budget this month by ${formatCurrency(700, currency)} + use ${formatCurrency(500, currency)} savings`, impact: { budget: -700, savings: -500 }, correct: true, feedback: "Great choice! Temporarily cutting wants avoids going into high-interest debt." }
      ]
    },
    {
      title: "Medical Bill",
      description: `You received an unexpected out-of-network medical bill for ${formatCurrency(800, currency)}. What's your move?`,
      options: [
        { text: "Ignore it for now", impact: { budget: 0, savings: 0 }, correct: false, feedback: "Ignoring medical bills ruins your credit score." },
        { text: "Negotiate a payment plan", impact: { budget: -100, savings: 0 }, correct: true, feedback: "Smart! Hospitals often offer 0% interest payment plans." },
        { text: "Pay it all with a credit card", impact: { budget: -150, savings: 0 }, correct: false, feedback: "Putting it on a card adds interest, when a payment plan might be 0%." }
      ]
    }
  ];

  const handleChoice = (option: any) => {
    setBudget(prev => prev + option.impact.budget);
    setSavings(prev => prev + option.impact.savings);
    
    if (step < scenarios.length - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      addXP(400); // XP for Budget Crisis Simulator
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-slate-500 hover:text-slate-800 flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <IconReportMoney className="text-orange-500" size={32} />
              Budget Crisis Simulator
            </h1>
            <p className="text-slate-600 mt-2">Navigate unexpected financial shocks without ruining your budget.</p>
          </div>
          <div className="text-right p-4 bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 font-medium">Monthly Budget Remaining</div>
            <div className={`text-2xl font-bold ${budget > 2000 ? 'text-green-600' : budget > 1000 ? 'text-orange-500' : 'text-red-600'}`}>
              {formatCurrency(budget, currency)}
            </div>
            <div className="text-sm text-slate-500 mt-1">Savings: {formatCurrency(savings, currency)}</div>
          </div>
        </div>

        <Card className="p-8 shadow-lg border-orange-100 bg-white">
          {!completed ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Month {step + 1}
                  </span>
                  <span className="text-slate-400 text-sm">Crisis {step + 1} of {scenarios.length}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <IconAlertTriangle className="text-orange-500" />
                  {scenarios[step].title}
                </h2>
                <p className="text-slate-700 text-lg mb-8">{scenarios[step].description}</p>

                <div className="space-y-4">
                  {scenarios[step].options.map((option, idx) => (
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
              </motion.div>
            </AnimatePresence>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="mx-auto w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <IconCheck size={40} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">You Survived the Crisis!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                You managed to navigate unexpected expenses. While your budget took a hit, you avoided a complete financial meltdown.
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
