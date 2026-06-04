'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView } from 'framer-motion';
import { IconArrowRight, IconTrendingUp, IconShieldCheck, IconChartBar } from '@tabler/icons-react';
import { Button } from '@/components/ui';
import { Container } from '@/components/layout/Container';

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

import { useUserStore } from '@/stores/useUserStore';
import { formatCurrency } from '@/lib/formatCurrency';

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

/* Circular progress ring */
function CircularProgress({ value, size = 72, stroke = 5, color = '#387ED1' }: { value: number; size?: number; stroke?: number; color?: string }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <svg width={size} height={size} className="circular-progress">
      <circle className="circular-progress-track" cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} />
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

export function HeroSection() {
  const { currency } = useUserStore();
  return (
    <section className="hero-gradient relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Decorative orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 rounded-full bg-brand-primary/5 blur-3xl animate-pulse-ring" />
      <div className="absolute bottom-20 right-[15%] w-56 h-56 rounded-full bg-brand-success/5 blur-3xl animate-pulse-ring" style={{ animationDelay: '1.5s' }} />

      <Container  className="py-16 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left: Content */}
          <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-[540px]">
            <motion.div variants={fadeUp} className="mb-6 flex flex-col items-start gap-3">
              <Image 
                src="/logo.png" 
                alt="Varsity Tribe" 
                width={300} 
                height={96} 
                className="h-16 md:h-24 w-auto transition-transform duration-300 hover:scale-[1.03]" 
                priority 
              />
              <span className="text-sm font-semibold tracking-wide text-brand-primary uppercase">
                India's Financial Learning Community
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="text-[2.5rem] md:text-[3.25rem] font-bold leading-[1.1] tracking-tight text-brand-text-primary">
              Learn. Invest.{' '}
              <span className="text-brand-primary">Grow Together.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mt-5 text-body text-brand-text-secondary max-w-[480px] leading-relaxed">
              India&apos;s most trusted financial education community. Set real goals, learn with simulators, compete on leaderboards, and join 50,000+ learners building their financial future.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/onboarding">
                <Button size="lg" variant="primary" icon={<IconArrowRight size={18} />}>
                  Start Your Journey — Free
                </Button>
              </Link>
              <a href="#tools">
                <Button size="lg" variant="secondary">
                  Explore Tools
                </Button>
              </a>
            </motion.div>

            {/* Live stats bar */}
            <motion.div variants={fadeUp} className="mt-8 flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-h3 font-bold text-brand-text-primary"><Counter target={50000} suffix="+" /></span>
                <span className="text-small text-brand-text-secondary">Learners</span>
              </div>
              <div className="h-6 w-px bg-brand-border" />
              <div className="flex items-center gap-2">
                <span className="text-h3 font-bold text-brand-text-primary">₹<Counter target={120} suffix="Cr+" /></span>
                <span className="text-small text-brand-text-secondary">Goals Tracked</span>
              </div>
              <div className="h-6 w-px bg-brand-border hidden sm:block" />
              <div className="items-center gap-2 hidden sm:flex">
                <span className="text-h3 font-bold text-brand-text-primary"><Counter target={15000} suffix="+" /></span>
                <span className="text-small text-brand-text-secondary">Modules</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Floating Dashboard Preview */}
          <div className="relative hidden lg:flex items-center justify-center min-h-[500px]">
            {/* Main Goal Card */}
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}>
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="glass-strong rounded-2xl p-5 w-[280px] shadow-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-label text-brand-primary">ACTIVE GOAL</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-success/10 text-brand-success font-medium">On Track</span>
                </div>
                <div className="flex items-center gap-4">
                  <CircularProgress value={68} size={64} stroke={5} color="#387ED1" />
                  <div>
                    <p className="text-h3 font-semibold text-brand-text-primary">Bali Trip</p>
                    <p className="text-small text-brand-text-secondary">{formatCurrency(81600, currency)} / {formatCurrency(120000, currency)}</p>
                    <p className="text-[11px] text-brand-text-tertiary mt-0.5">SIP: {formatCurrency(5000, currency)}/mo · Dec 2026</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {[25, 50, 75, 100].map((ms) => (
                    <div key={ms} className={`h-1.5 flex-1 rounded-full ${ms <= 50 ? 'bg-brand-primary' : 'bg-brand-border'}`} />
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Emergency Fund Card - floating top right */}
            <motion.div
              className="absolute top-4 right-0"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
            >
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="glass-strong rounded-xl p-4 w-[200px] shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-brand-success/10 flex items-center justify-center">
                    <IconShieldCheck size={16} className="text-brand-success" />
                  </div>
                  <span className="text-small font-medium">Emergency Fund</span>
                </div>
                <div className="flex items-center gap-2">
                  <CircularProgress value={48} size={40} stroke={4} color="#2D7A4F" />
                  <div>
                    <p className="text-small font-semibold">{formatCurrency(240000, currency)} / {formatCurrency(500000, currency)}</p>
                    <p className="text-[10px] text-brand-text-tertiary">48% complete</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* XP Card - floating bottom left */}
            <motion.div
              className="absolute bottom-12 -left-4"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="glass-strong rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-brand-warning/10 flex items-center justify-center">
                    <IconTrendingUp size={18} className="text-brand-warning" />
                  </div>
                  <div>
                    <p className="text-[11px] text-brand-text-tertiary">This Week</p>
                    <p className="text-h3 font-semibold text-brand-primary">+350 XP</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Portfolio Health Card - floating bottom right */}
            <motion.div
              className="absolute bottom-0 right-8"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1.5 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="glass-strong rounded-xl p-3 shadow-lg"
              >
                <div className="flex items-center gap-2">
                  <IconChartBar size={18} className="text-brand-primary" />
                  <div>
                    <p className="text-[11px] text-brand-text-tertiary">Portfolio Health</p>
                    <div className="flex items-center gap-1">
                      <div className="w-16 h-1.5 rounded-full bg-brand-border overflow-hidden">
                        <div className="h-full w-[82%] rounded-full bg-gradient-to-r from-brand-primary to-brand-success" />
                      </div>
                      <span className="text-[11px] font-semibold text-brand-success">82%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
