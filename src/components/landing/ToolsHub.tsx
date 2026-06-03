'use client';

import { motion } from 'framer-motion';
import {
  IconCalculator,
  IconReceipt,
  IconSunHigh,
  IconChartPie,
} from '@tabler/icons-react';
import { cn } from '@/lib/cn';

import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

interface ToolCard {
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  preview: React.ReactNode;
}

function SIPPreview() {
  const { currency } = useUserStore();
  return (
    <div className="mt-3 space-y-2">
      {/* Fake slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-brand-text-tertiary">
          <span>Monthly</span>
          <span className="font-medium text-brand-text-primary">{formatCurrency(5000, currency)}/mo</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-primary"
            style={{ width: '60%' }}
          />
        </div>
      </div>
      <p className="text-brand-primary font-semibold text-xs">
        Projected: {formatCurrency(1820000, currency)} in 15 yrs
      </p>
    </div>
  );
}

function EMIPreview() {
  const { currency } = useUserStore();
  const pills = [
    { label: 'Loan', value: formatCurrency(2500000, currency) },
    { label: 'EMI', value: formatCurrency(22455, currency) },
    { label: 'Interest', value: formatCurrency(440000, currency) },
  ];

  return (
    <div className="mt-3 flex items-center gap-1.5">
      {pills.map((p) => (
        <div
          key={p.label}
          className="flex-1 rounded-lg bg-white/5 px-2 py-1.5 text-center"
        >
          <div className="text-[10px] text-brand-text-tertiary">{p.label}</div>
          <div className="text-[11px] font-semibold text-brand-text-primary">
            {p.value}
          </div>
        </div>
      ))}
    </div>
  );
}

function RetirementPreview() {
  const bars = [28, 45, 68, 100];
  const colors = ['#387ED1', '#2D8F5E', '#2DA06A', '#2D7A4F'];

  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-end gap-1.5 h-10">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm"
            style={{
              height: `${h}%`,
              backgroundColor: colors[i],
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-brand-text-tertiary">
        <span>Current Age: 28</span>
        <span>Retire by: 55</span>
      </div>
    </div>
  );
}

function PortfolioPreview() {
  const segments = [
    { label: 'Equity 60%', color: '#387ED1', width: '60%' },
    { label: 'Debt 30%', color: '#2D7A4F', width: '30%' },
    { label: 'Gold 10%', color: '#C17A00', width: '10%' },
  ];

  return (
    <div className="mt-3 space-y-2">
      {segments.map((seg) => (
        <div key={seg.label} className="space-y-0.5">
          <div className="text-[10px] text-brand-text-tertiary">{seg.label}</div>
          <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: seg.width, backgroundColor: seg.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const tools: ToolCard[] = [
  {
    icon: IconCalculator,
    iconBg: 'bg-brand-primary/10',
    iconColor: 'text-brand-primary',
    title: 'SIP Calculator',
    preview: <SIPPreview />,
  },
  {
    icon: IconReceipt,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    title: 'EMI Calculator',
    preview: <EMIPreview />,
  },
  {
    icon: IconSunHigh,
    iconBg: 'bg-brand-success/10',
    iconColor: 'text-brand-success',
    title: 'Retirement Planner',
    preview: <RetirementPreview />,
  },
  {
    icon: IconChartPie,
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-500',
    title: 'Portfolio Check',
    preview: <PortfolioPreview />,
  },
];

export function ToolsHub() {
  return (
    <section id="tools" className="py-20 section-gradient-alt">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-label text-brand-primary">FINANCIAL TOOLS</span>
          <h2 className="text-[1.75rem] md:text-[2rem] font-bold mt-2">
            Powerful Tools at Your Fingertips
          </h2>
          <p className="text-brand-text-secondary mt-3 max-w-[600px] mx-auto w-full text-sm min-w-0">
            Interactive calculators and simulators to make smarter financial
            decisions
          </p>
        </motion.div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {tools.map((tool, i) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -4 }}
              className="glass-strong rounded-2xl p-5 flex flex-col cursor-default"
            >
              {/* Icon */}
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  tool.iconBg
                )}
              >
                <tool.icon size={20} className={tool.iconColor} />
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold mt-3">{tool.title}</h3>

              {/* Mini Preview */}
              {tool.preview}

              {/* CTA */}
              <span className="text-brand-primary text-xs font-medium mt-auto pt-3">
                Try it →
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
