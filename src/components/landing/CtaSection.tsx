'use client';

import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { IconArrowRight, IconStar } from '@tabler/icons-react';
import { Button, Badge } from '@/components/ui';

/* ── Animated Counter ── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {count.toLocaleString('en-IN')}{suffix}
    </span>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

/* ── Success Stories ── */
const getStories = (currency: string) => [
  {
    name: 'Priya M.',
    role: 'Software Engineer, Bangalore',
    quote: `Varsity Tribe helped me go from zero investing knowledge to managing a ${formatCurrency(1200000, currency)} portfolio in 8 months. The community support is unmatched.`,
    metric: `${formatCurrency(1200000, currency)} Portfolio`,
    avatar: 'PM',
    color: 'bg-emerald-500',
  },
  {
    name: 'Rohan K.',
    role: 'BCA Student, Jaipur',
    quote: `I started my first SIP with ${formatCurrency(500, currency)} while still in college. The goal tracker keeps me motivated. Already saved ${formatCurrency(45000, currency)}!`,
    metric: `${formatCurrency(45000, currency)} Saved`,
    avatar: 'RK',
    color: 'bg-blue-500',
  },
  {
    name: 'Amit & Sneha S.',
    role: 'Couple, Mumbai',
    quote: 'We use the joint goal planner to track our home down payment. Being on the same financial page has transformed our relationship.',
    metric: `${formatCurrency(500000, currency)} Down Payment`,
    avatar: 'AS',
    color: 'bg-purple-500',
  },
];

export function CtaSection() {
  const { currency } = useUserStore();
  const stories = getStories(currency);
  // Get just the symbol
  const symbol = formatCurrency(0, currency).replace(/[\d.,\s]/g, '') || (currency === 'USD' ? '$' : '₹');

  return (
    <>
      {/* ══ Stats Bar ══ */}
      <section className="bg-brand-text-primary py-14">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-[1200px] px-4 md:px-6"
        >
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
            {[
              { target: 50247, suffix: '+', label: 'Active Learners' },
              { target: 120000000, suffix: '+', label: 'Goals Tracked', isCurrency: true },
              { target: 1247, suffix: '+', label: 'Events Hosted' },
              { target: 100, suffix: '+', label: 'Learning Modules' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp} className="flex flex-col items-center text-center">
                <span className="text-[1.75rem] md:text-display font-bold text-white font-mono">
                  {stat.isCurrency ? formatCurrency(stat.target, currency) + stat.suffix : <><Counter target={stat.target} suffix={stat.suffix} /></>}
                </span>
                <span className="mt-1 text-small text-white/50">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══ Success Stories ══ */}
      <section className="py-20 px-4 bg-brand-bg">
        <div className="mx-auto max-w-[1200px]">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.p variants={fadeUp} className="text-label text-brand-primary mb-2">SUCCESS STORIES</motion.p>
            <motion.h2 variants={fadeUp} className="text-[1.75rem] md:text-[2rem] font-bold text-brand-text-primary">
              Real People. Real Results.
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {stories.map((story) => (
              <motion.div key={story.name} variants={fadeUp}>
                <div className="glass-strong rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <IconStar key={s} size={14} className="text-brand-warning" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-body text-brand-text-secondary leading-relaxed flex-1">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${story.color} flex items-center justify-center text-white text-small font-semibold`}>
                        {story.avatar}
                      </div>
                      <div>
                        <p className="text-small font-medium text-brand-text-primary">{story.name}</p>
                        <p className="text-[11px] text-brand-text-tertiary">{story.role}</p>
                      </div>
                    </div>
                    <Badge variant="success" size="sm">{story.metric}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ Final CTA ══ */}
      <section className="py-20 px-4 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="relative mx-auto max-w-[640px] text-center"
        >
          <motion.h2 variants={fadeUp} className="text-[1.75rem] md:text-[2.25rem] font-bold text-brand-text-primary leading-tight">
            Ready to take control of your financial future?
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-4 text-body text-brand-text-secondary">
            Join 50,000+ learners who are building wealth, one smart decision at a time.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/onboarding">
              <Button size="lg" variant="primary" icon={<IconArrowRight size={18} />}>
                Start Your Journey — Free
              </Button>
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="mt-4 text-small text-brand-text-tertiary">
            No credit card required. Free forever for core features.
          </motion.p>
        </motion.div>
      </section>
    </>
  );
}
