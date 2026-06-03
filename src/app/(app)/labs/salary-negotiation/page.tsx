'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { motion, AnimatePresence } from 'framer-motion';
import { IconRobot, IconTrophy, IconArrowLeft } from '@tabler/icons-react';
import { useUserStore } from '@/stores/useUserStore';
import Link from 'next/link';
import { formatCurrency } from '@/lib/formatCurrency';

type Choice = {
  text: string;
  nextStep: string;
  scoreImpact: number;
};

type Step = {
  id: string;
  aiMessage: string;
  choices: Choice[];
  isEnd?: boolean;
};

const getDialogueTree = (currency: string): Record<string, Step> => ({
  start: {
    id: 'start',
    aiMessage: `Hi there! We're thrilled to offer you the Software Engineer position. We'd like to start you off with a base salary of ${formatCurrency(80000, currency)} per year. How does that sound?`,
    choices: [
      { text: "That sounds great, I accept!", nextStep: 'end_low', scoreImpact: 10 },
      { text: `Thank you! I'm very excited. Based on my research and experience, I was hoping for something closer to ${formatCurrency(95000, currency)}.`, nextStep: 'mid_1', scoreImpact: 30 },
      { text: `Is that a joke? I need at least ${formatCurrency(100000, currency)}.`, nextStep: 'mid_2_aggro', scoreImpact: -10 },
    ]
  },
  mid_1: {
    id: 'mid_1',
    aiMessage: `We do value your experience, but ${formatCurrency(95000, currency)} is a bit outside our budget for this role. We could come up to ${formatCurrency(85000, currency)}.`,
    choices: [
      { text: `Alright, ${formatCurrency(85000, currency)} works for me. I accept.`, nextStep: 'end_mid', scoreImpact: 20 },
      { text: `I understand the budget constraints. What if we do ${formatCurrency(90000, currency)} and include an extra week of PTO?`, nextStep: 'mid_3_creative', scoreImpact: 40 },
      { text: `If you can't do ${formatCurrency(95000, currency)}, I'm not sure I can accept.`, nextStep: 'end_risky', scoreImpact: 0 },
    ]
  },
  mid_2_aggro: {
    id: 'mid_2_aggro',
    aiMessage: `That's quite higher than our band allows, and frankly I'm a bit surprised by the tone. The absolute best we can do is ${formatCurrency(83000, currency)}.`,
    choices: [
      { text: `Fine, I'll take ${formatCurrency(83000, currency)}.`, nextStep: 'end_aggro', scoreImpact: 0 },
      { text: `I apologize if I came on strong. I'm just passionate. How about ${formatCurrency(88000, currency)}?`, nextStep: 'mid_4_recovery', scoreImpact: 15 },
    ]
  },
  mid_3_creative: {
    id: 'mid_3_creative',
    aiMessage: `That's a creative solution. I talked to HR, and we can do ${formatCurrency(88000, currency)} with the extra week of PTO. We'd love to have you on board.`,
    choices: [
      { text: "That sounds wonderful. I accept!", nextStep: 'end_high', scoreImpact: 30 }
    ]
  },
  mid_4_recovery: {
    id: 'mid_4_recovery',
    aiMessage: `I appreciate that. We can meet you at ${formatCurrency(85000, currency)}, but that's our final offer.`,
    choices: [
      { text: "I accept. Thank you.", nextStep: 'end_mid', scoreImpact: 20 }
    ]
  },
  end_low: {
    id: 'end_low',
    aiMessage: `Fantastic! We'll send the paperwork over today. Welcome to the team at ${formatCurrency(80000, currency)}!`,
    choices: [],
    isEnd: true,
  },
  end_mid: {
    id: 'end_mid',
    aiMessage: `Great! We're glad we could find a middle ground. Welcome to the team at ${formatCurrency(85000, currency)}!`,
    choices: [],
    isEnd: true,
  },
  end_high: {
    id: 'end_high',
    aiMessage: "Perfect. We're excited for you to start. Welcome to the team!",
    choices: [],
    isEnd: true,
  },
  end_risky: {
    id: 'end_risky',
    aiMessage: "I'm sorry to hear that. We'll have to rescind the offer in that case. Best of luck in your job search.",
    choices: [],
    isEnd: true,
  },
  end_aggro: {
    id: 'end_aggro',
    aiMessage: `Alright. We'll send the updated paperwork for ${formatCurrency(83000, currency)}.`,
    choices: [],
    isEnd: true,
  }
});

export default function SalaryNegotiationPage() {
  const { addXP, currency } = useUserStore();
  const dialogueTree = getDialogueTree(currency);
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [score, setScore] = useState<number>(0);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([
    { sender: 'ai', text: dialogueTree['start'].aiMessage }
  ]);
  
  const endRef = useRef<HTMLDivElement>(null);

  const triggerConfetti = async () => {
    const confetti = (await import('canvas-confetti')).default;
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#2563EB', '#60A5FA', '#FCD34D']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#2563EB', '#60A5FA', '#FCD34D']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (dialogueTree[currentStepId].isEnd) {
      triggerConfetti();
    }
  }, [currentStepId]);



  const handleChoice = (choice: Choice) => {
    setScore((prev) => prev + choice.scoreImpact);
    
    setMessages((prev) => [...prev, { sender: 'user', text: choice.text }]);
    
    const nextStep = dialogueTree[choice.nextStep];
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: 'ai', text: nextStep.aiMessage }]);
      setCurrentStepId(nextStep.id);
    }, 800);
  };

  const resetSimulation = () => {
    setCurrentStepId('start');
    setScore(0);
    setMessages([{ sender: 'ai', text: dialogueTree['start'].aiMessage }]);
  };

  const step = dialogueTree[currentStepId];

  return (
    <PageLayout>
      <Container className="pb-12 max-w-4xl">
        <div className="py-4 mb-2 flex items-center">
          <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>
        <div className="mb-8 flex flex-col items-center text-center">
          <h1 className="text-h2 font-bold mb-4 text-brand-text-primary">Salary Negotiation Simulator</h1>
          <p className="text-body text-brand-text-secondary max-w-2xl">
            Practice your negotiation skills with our AI Hiring Manager. Your choices affect your final offer and your total XP earned.
          </p>
        </div>

        <Card variant="elevated" className="min-h-[500px] flex flex-col bg-brand-surface border-brand-border-strong">
          <div className="flex justify-between items-center pb-4 border-b border-brand-border mb-4">
            <div className="flex items-center gap-2 text-brand-primary font-semibold">
              <IconRobot size={24} />
              <span>AI Hiring Manager</span>
            </div>
            <div className="flex items-center gap-2 bg-brand-surface-elevated px-4 py-2 rounded-full border border-brand-border">
              <IconTrophy size={18} className="text-[#F59E0B]" />
              <span className="font-bold text-brand-text-primary">XP: {score}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                    msg.sender === 'user' 
                      ? 'bg-brand-primary text-white rounded-br-none'
                      : 'bg-brand-surface-elevated text-brand-text-primary border border-brand-border rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <div className="mt-auto pt-4 border-t border-brand-border">
            {!step.isEnd ? (
              <div className="flex flex-col gap-3">
                <p className="text-small text-brand-text-secondary mb-2 font-medium">Choose your response:</p>
                {step.choices.map((choice, idx) => (
                  <Button
                    key={idx}
                    variant="secondary"
                    className="justify-start text-left h-auto py-3 whitespace-normal"
                    onClick={() => handleChoice(choice)}
                  >
                    {choice.text}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] mb-4">
                  <IconTrophy size={32} />
                </div>
                <h3 className="text-h3 font-bold mb-2">Simulation Complete!</h3>
                <p className="text-body text-brand-text-secondary mb-6">
                  You earned a total of {score} XP in this negotiation.
                </p>
                <Button onClick={resetSimulation} variant="primary">
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </Card>
      </Container>
    </PageLayout>
  );
}
