'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/cn';
import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

function CircularProgress({
  value,
  size = 80,
  stroke = 6,
  color,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle
        className="circular-progress-track"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
      />
      <circle
        ref={ref}
        className="circular-progress-fill"
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={inView ? offset : circumference}
      />
    </svg>
  );
}

interface Goal {
  name: string;
  percent: number;
  current: number;
  target: number;
  color: string;
  sip: number;
  milestones: number;
}

const goals: Goal[] = [
  {
    name: 'Emergency Fund',
    percent: 48,
    current: 240000,
    target: 500000,
    color: '#2D7A4F',
    sip: 8500,
    milestones: 2,
  },
  {
    name: 'Japan Trip',
    percent: 68,
    current: 81600,
    target: 120000,
    color: '#387ED1',
    sip: 6000,
    milestones: 3,
  },
  {
    name: 'Retirement',
    percent: 12,
    current: 600000,
    target: 5000000,
    color: '#C17A00',
    sip: 15000,
    milestones: 1,
  },
  {
    name: 'Home Down Payment',
    percent: 25,
    current: 500000,
    target: 2000000,
    color: '#8B5CF6',
    sip: 12000,
    milestones: 1,
  },
];

function GoalCard({ goal, index }: { goal: Goal; index: number }) {
  const totalMilestones = 4;
  const { currency } = useUserStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.12, ease: 'easeOut' }}
      whileHover={{ scale: 1.03 }}
      className="glass-strong rounded-2xl p-5 flex flex-col items-center text-center gap-3 cursor-default"
    >
      {/* Circular Progress Ring */}
      <div className="relative flex items-center justify-center">
        <CircularProgress value={goal.percent} size={80} stroke={6} color={goal.color} />
        <span
          className="absolute text-base font-bold"
          style={{ color: goal.color }}
        >
          {goal.percent}%
        </span>
      </div>

      {/* Goal Name */}
      <h3 className="text-h3 font-semibold">{goal.name}</h3>

      {/* Amount */}
      <p className="text-small text-brand-text-secondary">
        {formatCurrency(goal.current, currency)} / {formatCurrency(goal.target, currency)}
      </p>

      {/* Monthly SIP */}
      <p className="text-[11px] text-brand-text-tertiary">
        Monthly SIP: {formatCurrency(goal.sip, currency)}/mo
      </p>

      {/* Milestone dots */}
      <div className="flex items-center gap-1.5 mt-1">
        {Array.from({ length: totalMilestones }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              i < goal.milestones ? 'opacity-100' : 'opacity-25'
            )}
            style={{
              backgroundColor: goal.color,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

export function GoalShowcase() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-[1200px] mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-label text-brand-primary">GOAL PLANNING</span>
          <h2 className="text-[1.75rem] md:text-[2rem] font-bold mt-2">
            Track Every Financial Milestone
          </h2>
          <p className="text-brand-text-secondary mt-3 max-w-[600px] mx-auto w-full text-sm min-w-0">
            Set personalized financial goals, monitor your progress in real time,
            and stay on track with smart SIP recommendations.
          </p>
        </motion.div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {goals.map((goal, i) => (
            <GoalCard key={goal.name} goal={goal} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
