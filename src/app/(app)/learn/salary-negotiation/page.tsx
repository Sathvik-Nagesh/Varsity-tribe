'use client';

import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconRobot, 
  IconTrophy, 
  IconArrowLeft, 
  IconUser, 
  IconChartBar, 
  IconTarget, 
  IconTrendingUp,
  IconBriefcase
} from '@tabler/icons-react';
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
  currentOffer: number;
  confidence: number;
};

const getDialogueTree = (currency: string): Record<string, Step> => ({
  start: {
    id: 'start',
    aiMessage: `Hi there! We're thrilled to offer you the Software Engineer position. We'd like to start you off with a base salary of ${formatCurrency(80000, currency)} per year. How does that sound?`,
    currentOffer: 80000,
    confidence: 60,
    choices: [
      { text: "That sounds great, I accept!", nextStep: 'end_low', scoreImpact: 10 },
      { text: `Thank you! I'm very excited. Based on my research and experience, I was hoping for something closer to ${formatCurrency(95000, currency)}.`, nextStep: 'mid_1', scoreImpact: 30 },
      { text: `Is that a joke? I need at least ${formatCurrency(100000, currency)}.`, nextStep: 'mid_2_aggro', scoreImpact: -20 },
    ]
  },
  mid_1: {
    id: 'mid_1',
    aiMessage: `We do value your experience, but ${formatCurrency(95000, currency)} is a bit outside our budget for this role. We could come up to ${formatCurrency(85000, currency)}.`,
    currentOffer: 85000,
    confidence: 75,
    choices: [
      { text: `Alright, ${formatCurrency(85000, currency)} works for me. I accept.`, nextStep: 'end_mid', scoreImpact: 20 },
      { text: `I understand the budget constraints. What if we do ${formatCurrency(90000, currency)} and include an extra week of PTO?`, nextStep: 'mid_3_creative', scoreImpact: 40 },
      { text: `If you can't do ${formatCurrency(95000, currency)}, I'm not sure I can accept.`, nextStep: 'end_risky', scoreImpact: -10 },
    ]
  },
  mid_2_aggro: {
    id: 'mid_2_aggro',
    aiMessage: `That's quite higher than our band allows, and frankly I'm a bit surprised by the tone. The absolute best we can do is ${formatCurrency(83000, currency)}.`,
    currentOffer: 83000,
    confidence: 25,
    choices: [
      { text: `Fine, I'll take ${formatCurrency(83000, currency)}.`, nextStep: 'end_aggro', scoreImpact: 0 },
      { text: `I apologize if I came on strong. I'm just passionate. How about ${formatCurrency(88000, currency)}?`, nextStep: 'mid_4_recovery', scoreImpact: 15 },
    ]
  },
  mid_3_creative: {
    id: 'mid_3_creative',
    aiMessage: `That's a creative solution. I talked to HR, and we can do ${formatCurrency(88000, currency)} with the extra week of PTO. We'd love to have you on board.`,
    currentOffer: 88000,
    confidence: 90,
    choices: [
      { text: "That sounds wonderful. I accept!", nextStep: 'end_high', scoreImpact: 30 }
    ]
  },
  mid_4_recovery: {
    id: 'mid_4_recovery',
    aiMessage: `I appreciate that. We can meet you at ${formatCurrency(85000, currency)}, but that's our final offer.`,
    currentOffer: 85000,
    confidence: 50,
    choices: [
      { text: "I accept. Thank you.", nextStep: 'end_mid', scoreImpact: 20 }
    ]
  },
  end_low: {
    id: 'end_low',
    aiMessage: `Fantastic! We'll send the paperwork over today. Welcome to the team at ${formatCurrency(80000, currency)}!`,
    currentOffer: 80000,
    confidence: 65,
    choices: [],
    isEnd: true,
  },
  end_mid: {
    id: 'end_mid',
    aiMessage: `Great! We're glad we could find a middle ground. Welcome to the team at ${formatCurrency(85000, currency)}!`,
    currentOffer: 85000,
    confidence: 75,
    choices: [],
    isEnd: true,
  },
  end_high: {
    id: 'end_high',
    aiMessage: "Perfect. We're excited for you to start. Welcome to the team!",
    currentOffer: 88000,
    confidence: 95,
    choices: [],
    isEnd: true,
  },
  end_risky: {
    id: 'end_risky',
    aiMessage: "I'm sorry to hear that. We'll have to rescind the offer in that case. Best of luck in your job search.",
    currentOffer: 0,
    confidence: 0,
    choices: [],
    isEnd: true,
  },
  end_aggro: {
    id: 'end_aggro',
    aiMessage: `Alright. We'll send the updated paperwork for ${formatCurrency(83000, currency)}.`,
    currentOffer: 83000,
    confidence: 30,
    choices: [],
    isEnd: true,
  }
});

const TypingIndicator = () => (
  <div className="flex gap-1.5 items-center px-4 py-3 bg-brand-surface-elevated rounded-2xl rounded-bl-sm border border-brand-border w-fit shadow-sm h-[48px]">
    <motion.div
      className="w-2 h-2 rounded-full bg-brand-text-secondary/60"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
    />
    <motion.div
      className="w-2 h-2 rounded-full bg-brand-text-secondary/60"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
    />
    <motion.div
      className="w-2 h-2 rounded-full bg-brand-text-secondary/60"
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
    />
  </div>
);

export default function SalaryNegotiationPage() {
  const { addXP, currency } = useUserStore();
  const dialogueTree = getDialogueTree(currency);
  
  const [currentStepId, setCurrentStepId] = useState<string>('start');
  const [score, setScore] = useState<number>(0);
  const [messages, setMessages] = useState<{sender: 'ai' | 'user', text: string}[]>([
    { sender: 'ai', text: dialogueTree['start'].aiMessage }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(dialogueTree['start'].currentOffer);
  const [confidence, setConfidence] = useState(dialogueTree['start'].confidence);
  
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
  }, [messages, isTyping]);

  useEffect(() => {
    if (dialogueTree[currentStepId].isEnd && currentOffer > 0) {
      triggerConfetti();
      addXP(score);
    }
  }, [currentStepId]);

  const handleChoice = (choice: Choice) => {
    setMessages((prev) => [...prev, { sender: 'user', text: choice.text }]);
    setIsTyping(true);
    
    setTimeout(() => {
      const nextStep = dialogueTree[choice.nextStep];
      setScore((prev) => prev + choice.scoreImpact);
      setCurrentStepId(nextStep.id);
      setCurrentOffer(nextStep.currentOffer);
      setConfidence(nextStep.confidence);
      setMessages((prev) => [...prev, { sender: 'ai', text: nextStep.aiMessage }]);
      setIsTyping(false);
    }, 1500);
  };

  const resetSimulation = () => {
    setCurrentStepId('start');
    setScore(0);
    setMessages([{ sender: 'ai', text: dialogueTree['start'].aiMessage }]);
    setCurrentOffer(dialogueTree['start'].currentOffer);
    setConfidence(dialogueTree['start'].confidence);
    setIsTyping(false);
  };

  const step = dialogueTree[currentStepId];

  return (
    <PageLayout>
      <Container className="pb-12 pt-6 max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors mb-2">
              <IconArrowLeft size={16} /> Back to Learn
            </Link>
            <h1 className="text-h2 font-bold text-brand-text-primary">Salary Negotiation Simulator</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-brand-surface border border-brand-border px-4 py-2 rounded-full shadow-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-small font-medium text-brand-text-secondary">Live Session</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: Dashboard (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col gap-5 order-2 lg:order-1">
            {/* Target Offer */}
            <Card variant="elevated" className="bg-brand-surface border-brand-border p-6 relative overflow-hidden group shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <IconTarget size={80} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-brand-primary/10 rounded-xl text-brand-primary">
                  <IconTarget size={22} />
                </div>
                <h3 className="text-body font-semibold text-brand-text-secondary">Target Offer</h3>
              </div>
              <p className="text-h2 font-bold text-brand-text-primary tracking-tight">
                {formatCurrency(95000, currency)}
              </p>
            </Card>

            {/* Current Offer */}
            <Card variant="elevated" className="bg-brand-surface border-brand-border p-6 relative overflow-hidden group shadow-sm transition-shadow hover:shadow-md">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <IconBriefcase size={80} />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#10B981]/10 rounded-xl text-[#10B981]">
                  <IconBriefcase size={22} />
                </div>
                <h3 className="text-body font-semibold text-brand-text-secondary">Current Offer</h3>
              </div>
              <p className="text-h2 font-bold text-brand-text-primary tracking-tight">
                <motion.span
                  key={currentOffer}
                  initial={{ opacity: 0, y: -15, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="inline-block"
                >
                  {formatCurrency(currentOffer, currency)}
                </motion.span>
              </p>
            </Card>

            {/* Confidence Meter */}
            <Card variant="elevated" className="bg-brand-surface border-brand-border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#8B5CF6]/10 rounded-xl text-[#8B5CF6]">
                    <IconTrendingUp size={22} />
                  </div>
                  <h3 className="text-body font-semibold text-brand-text-secondary">Recruiter Confidence</h3>
                </div>
                <span className="text-body font-bold text-brand-text-primary">{confidence}%</span>
              </div>
              <div className="h-3.5 w-full bg-brand-surface-elevated border border-brand-border rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#C084FC] relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite] -skew-x-12" style={{ backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)' }} />
                </motion.div>
              </div>
              <p className="text-small text-brand-text-secondary mt-3">
                {confidence >= 80 ? "They really want you! Great leverage." : confidence >= 50 ? "Things are going well, steady on." : "Careful, you might be pushing too hard."}
              </p>
            </Card>

            {/* Negotiation Score */}
            <Card variant="elevated" className="bg-brand-surface border-brand-border p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-[#F59E0B]/10 rounded-xl text-[#F59E0B]">
                  <IconTrophy size={22} />
                </div>
                <h3 className="text-body font-semibold text-brand-text-secondary">Negotiation Score</h3>
              </div>
              <p className="text-h2 font-bold text-brand-text-primary">
                 <motion.span
                  key={score}
                  initial={{ scale: 1.3, color: '#FCD34D' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="inline-block"
                >
                  {score} XP
                </motion.span>
              </p>
            </Card>
          </div>
          
          {/* RIGHT: Chat Window (8 cols on lg) */}
          <div className="lg:col-span-8 order-1 lg:order-2">
            <Card variant="elevated" className="flex flex-col bg-brand-surface border-brand-border h-[700px] overflow-hidden shadow-lg rounded-2xl ring-1 ring-black/[0.03]">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border bg-brand-surface/80 backdrop-blur-md z-10 sticky top-0">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-primary to-blue-400 flex items-center justify-center text-white shadow-md ring-2 ring-brand-surface">
                      <IconRobot size={24} />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#10B981] border-2 border-brand-surface rounded-full shadow-sm" />
                  </div>
                  <div>
                    <h2 className="text-body font-bold text-brand-text-primary leading-tight">Sarah from HR</h2>
                    <p className="text-small text-brand-text-secondary">AI Hiring Manager</p>
                  </div>
                </div>
                <div className="hidden sm:flex p-2 bg-brand-surface-elevated rounded-lg border border-brand-border text-brand-text-secondary">
                  <IconChartBar size={20} />
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-brand-surface/30 to-brand-surface-elevated/30 scroll-smooth">
                <AnimatePresence>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-blue-400 flex items-center justify-center text-white shrink-0 mr-3 mt-auto shadow-sm">
                          <IconRobot size={18} />
                        </div>
                      )}
                      
                      <div className={`max-w-[85%] rounded-2xl px-5 py-3.5 shadow-sm text-body ${
                        msg.sender === 'user' 
                          ? 'bg-gradient-to-br from-brand-primary to-brand-primary-hover text-white rounded-br-sm'
                          : 'bg-brand-surface-elevated text-brand-text-primary border border-brand-border rounded-bl-sm'
                      }`}>
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>

                      {msg.sender === 'user' && (
                        <div className="w-9 h-9 rounded-full bg-brand-surface-elevated border border-brand-border flex items-center justify-center text-brand-text-secondary shrink-0 ml-3 mt-auto shadow-sm">
                          <IconUser size={18} />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, originY: 1 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-start"
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-primary to-blue-400 flex items-center justify-center text-white shrink-0 mr-3 mt-auto shadow-sm">
                        <IconRobot size={18} />
                      </div>
                      <TypingIndicator />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div ref={endRef} className="h-2" />
              </div>

              {/* Choices Area */}
              <div className="p-6 bg-brand-surface border-t border-brand-border shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.05)] z-10">
                {!step.isEnd ? (
                  <div className="flex flex-col gap-3.5">
                    {step.choices.map((choice, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, type: "spring", stiffness: 300, damping: 25 }}
                      >
                        <Button
                          variant="secondary"
                          className="w-full justify-start text-left h-auto py-3.5 px-5 whitespace-normal border border-brand-border hover:border-brand-primary/50 hover:bg-brand-primary/5 transition-all shadow-sm group focus:ring-2 focus:ring-brand-primary/20"
                          onClick={() => handleChoice(choice)}
                          disabled={isTyping}
                        >
                          <div className="flex items-center gap-4 w-full">
                            <div className="w-7 h-7 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-xs font-semibold text-brand-text-secondary group-hover:text-brand-primary group-hover:border-brand-primary transition-colors shrink-0 shadow-sm">
                              {String.fromCharCode(65 + idx)}
                            </div>
                            <span className="flex-1 text-body font-medium text-brand-text-primary group-hover:text-brand-primary transition-colors">{choice.text}</span>
                          </div>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="text-center py-6"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-[#F59E0B] to-yellow-400 text-white shadow-xl mb-5 ring-8 ring-[#F59E0B]/10">
                      <IconTrophy size={40} />
                    </div>
                    <h3 className="text-h3 font-bold mb-3 text-brand-text-primary">Negotiation Complete!</h3>
                    <p className="text-body text-brand-text-secondary mb-8 max-w-sm mx-auto">
                      You secured a final offer of <strong className="text-brand-text-primary">{formatCurrency(currentOffer, currency)}</strong> and earned <strong className="text-[#F59E0B]">{score} XP</strong>.
                    </p>
                    <Button onClick={resetSimulation} variant="primary" className="shadow-md hover:shadow-lg transition-all min-w-[200px]">
                      Try Another Scenario
                    </Button>
                  </motion.div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </PageLayout>
  );
}
