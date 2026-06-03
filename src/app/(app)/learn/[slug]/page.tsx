'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { IconArrowLeft, IconRobot, IconUser, IconAward } from '@tabler/icons-react';
import { Card, Button, Badge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { useUserStore } from '@/stores/useUserStore';
import { PageLayout } from "@/components/layout/PageLayout";

export default function SimulationPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { addXP } = useUserStore();

  const isSalaryNegotiation = slug === 'salary-negotiation';

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<{ role: 'manager' | 'user' | 'system', content: string }[]>([
    { role: 'manager', content: "Hi there. Thanks for your hard work this year. We've reviewed your performance and we can offer a 10% hike for the upcoming cycle." }
  ]);

  const handleChoice = (choice: number) => {
    let newMessages: typeof history = [];
    
    if (choice === 1) {
      newMessages = [
        { role: 'user', content: "Thank you. I appreciate the offer, but given my increased responsibilities and market research, I was hoping for something closer to 15%." },
        { role: 'manager', content: "I understand your perspective. Let me check with HR if we can bump it to 12% and add a performance bonus. How does that sound?" },
        { role: 'system', content: "Excellent response! You anchored your counter-offer with data and highlighted your responsibilities, opening the door for constructive negotiation." }
      ];
    } else if (choice === 2) {
      newMessages = [
        { role: 'user', content: "Is that the best you can do? I think I deserve more." },
        { role: 'manager', content: "I'm sorry you feel that way. 10% is standard for your band this year." },
        { role: 'system', content: "A bit too confrontational without facts. Try to base negotiations on value delivered and market data rather than just stating you deserve more." }
      ];
    } else {
      newMessages = [
        { role: 'user', content: "Okay, thank you! I accept." },
        { role: 'system', content: "You accepted the first offer! While safe, you might have left money on the table. Always try to negotiate politely if you have strong performance data." }
      ];
    }

    setHistory(prev => [...prev, ...newMessages]);
    setStep(1);
    setCompleted(true);
  };

  const handleFinish = () => {
    addXP(50);
    router.push('/learn');
  };

  if (!isSalaryNegotiation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-h4 font-display">Simulation Coming Soon</h1>
        <p className="text-brand-text-secondary max-w-md">
          The {slug?.replace('-', ' ')} simulation is currently under development. Check back later!
        </p>
        <Button onClick={() => router.push('/learn')} icon={<IconArrowLeft size={16} />}>
          Back to Hub
        </Button>
      </div>
    );
  }

  return (
    <PageLayout>
        <div className="max-w-3xl mx-auto pb-24">
          {/* Header */}
          <div className="flex items-center gap-4 mb-[var(--spacing-lg)]">
            <button 
              onClick={() => router.push('/learn')}
              className="p-2 hover:bg-brand-surface-elevated rounded-full transition-colors text-brand-text-secondary"
            >
              <IconArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-h5 font-display">Salary Negotiation</h1>
              <p className="text-small text-brand-text-secondary">Interactive Challenge</p>
            </div>
          </div>

          {/* Chat Interface */}
          <Card className="min-h-[500px] flex flex-col bg-white/90 backdrop-blur-xl border-brand-primary/20 shadow-lg relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex-1 overflow-y-auto space-y-6 p-2 mb-6">
              <AnimatePresence>
                {history.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "flex gap-3 max-w-[85%]",
                      msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto",
                      msg.role === 'system' && "max-w-full mx-auto justify-center"
                    )}
                  >
                    {msg.role !== 'system' && (
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                        msg.role === 'manager' ? "bg-brand-surface-elevated border border-brand-border" : "bg-brand-primary text-white"
                      )}>
                        {msg.role === 'manager' ? <IconRobot size={18} /> : <IconUser size={18} />}
                      </div>
                    )}
                    
                    <div className={cn(
                      "p-4 rounded-[var(--radius-lg)] text-body leading-relaxed shadow-sm",
                      msg.role === 'manager' ? "bg-brand-surface border border-brand-border rounded-tl-none" :
                      msg.role === 'user' ? "bg-brand-primary text-white rounded-tr-none" :
                      "bg-brand-warning/10 border border-brand-warning/30 text-brand-text-primary text-center rounded-xl mx-8 shadow-inner"
                    )}>
                      {msg.role === 'system' && <strong className="block mb-1 text-brand-warning">AI Feedback:</strong>}
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Action Area */}
            <div className="mt-auto pt-4 border-t border-brand-border/50 relative z-10">
              {!completed ? (
                <div className="space-y-3">
                  <p className="text-small font-medium text-brand-text-secondary mb-2">Choose your response:</p>
                  
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleChoice(1)}
                    className="w-full text-left p-4 rounded-[var(--radius-md)] bg-brand-surface border border-brand-border hover:border-brand-primary hover:bg-brand-primary/5 transition-colors"
                  >
                    "Thank you, but given my increased responsibilities, I was hoping for something closer to 15%."
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleChoice(2)}
                    className="w-full text-left p-4 rounded-[var(--radius-md)] bg-brand-surface border border-brand-border hover:border-brand-danger/30 hover:bg-brand-danger/5 transition-colors"
                  >
                    "Is that the best you can do? I think I deserve more."
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleChoice(3)}
                    className="w-full text-left p-4 rounded-[var(--radius-md)] bg-brand-surface border border-brand-border hover:border-brand-success/30 hover:bg-brand-success/5 transition-colors"
                  >
                    "Okay, thank you! I accept."
                  </motion.button>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center py-4 space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-brand-success/20 flex items-center justify-center text-brand-success mb-2">
                    <IconAward size={32} />
                  </div>
                  <h3 className="text-h5 font-display text-center">Simulation Complete!</h3>
                  <p className="text-brand-text-secondary">You earned +50 XP for completing this scenario.</p>
                  <Button onClick={handleFinish} variant="primary" size="lg" className="w-full max-w-sm mt-4">
                    Claim Reward & Return
                  </Button>
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </PageLayout>
    );
}
