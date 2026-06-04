'use client';

import { useState, useSyncExternalStore } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  IconArrowLeft,
  IconShield,
  IconPlane,
  IconSchool,
  IconCar,
  IconHome,
  IconHeart,
  IconSunHigh,
  IconShoppingCart,
  IconCircleCheck,
} from '@tabler/icons-react';

import { Button, ProgressBar, Badge, Card, Input } from '@/components/ui';
import { useUserStore, selectRiskProfile, selectPersonaTrack, selectRecommendedActions } from '@/stores/useUserStore';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/formatCurrency';

import type {
  AgeBracket,
  IncomeRange,
  GoalType,
  TimeAvailable,
  OnboardingAnswers,
} from '@/types';

/* ─── Option Card ─────────────────────────────────────────────────── */

function OptionCard({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center rounded-[var(--radius-lg)] border-2 p-4 text-center transition-all',
        selected
          ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
          : 'border-brand-border bg-brand-surface hover:border-brand-border-strong',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/* ─── Step Wrapper ────────────────────────────────────────────────── */

function StepHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-h2 text-brand-text-primary">{title}</h1>
      {subtitle && (
        <p className="text-body text-brand-text-secondary mt-1">{subtitle}</p>
      )}
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────── */

export default function OnboardingPage() {
  const router = useRouter();
  const { completeOnboarding, setCurrency, currency: currencyStore } = useUserStore();
  const riskProfile = useUserStore(selectRiskProfile);
  const personaTrack = useUserStore(selectPersonaTrack);
  const recommendedActions = useUserStore(useShallow(selectRecommendedActions));

  /* hydration guard */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  /* step & animation direction */
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);

  /* ── Local answer state ── */
  const [ageBracket, setAgeBracket] = useState<AgeBracket | null>(null);
  const [incomeRange, setIncomeRange] = useState<IncomeRange | null>(null);
  const [goals, setGoals] = useState<GoalType[]>([]);
  const [experience, setExperience] = useState<
    'none' | 'beginner' | 'intermediate' | 'advanced' | null
  >(null);
  const [riskComfort, setRiskComfort] = useState<number>(0);
  const [motivation, setMotivation] = useState('');
  const [motivationOther, setMotivationOther] = useState('');
  const [isMotivationOther, setIsMotivationOther] = useState(false);
  const [timeAvailable, setTimeAvailable] = useState<TimeAvailable | null>(
    null,
  );
  const [worry, setWorry] = useState('');
  const [worryOther, setWorryOther] = useState('');
  const [isWorryOther, setIsWorryOther] = useState(false);


  /* ── Validation per step ── */
  function isStepValid(): boolean {
    switch (step) {
      case 1:
        return ageBracket !== null;
      case 2:
        return incomeRange !== null;
      case 3:
        return goals.length > 0;
      case 4:
        return experience !== null;
      case 5:
        return riskComfort > 0;
      case 6:
        return isMotivationOther
          ? motivationOther.trim().length > 0
          : motivation.length > 0;
      case 7:
        return timeAvailable !== null;
      case 8:
        return isWorryOther
          ? worryOther.trim().length > 0
          : worry.length > 0;
      default:
        return true;
    }
  }

  /* ── Navigation ── */
  function goNext() {
    if (step === 8) {
      const answers: OnboardingAnswers = {
        ageBracket,
        incomeRange,
        currentGoals: goals,
        investmentExperience: experience,
        riskComfort,
        motivation: isMotivationOther ? motivationOther : motivation,
        weeklyTimeAvailable: timeAvailable,
        biggestFinancialWorry: isWorryOther ? worryOther : worry,
      };
      completeOnboarding(answers);
      setDirection(1);
      setStep(10);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, 10));
  }

  function goBack() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }

  /* ── Goal toggle helper ── */
  function toggleGoal(goal: GoalType) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  if (!mounted) return null;

  /* ── Result Screen (step 10) ── */
  if (step === 10) {
    const formatLabel = (s: string) =>
      s
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    return (
      <div className="flex min-h-screen flex-col items-center bg-brand-bg">
        <div className="flex w-full max-w-[640px] flex-1 flex-col items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex justify-center mb-6"
            >
              <Image src="/logo.png" alt="Varsity Tribe" width={160} height={48} className="h-10 w-auto" />
            </motion.div>

            <h1 className="text-h1 text-brand-text-primary mb-6">
              Your personalized plan is ready! 🎉
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mb-8 flex flex-wrap items-center justify-center gap-3"
            >
              <Badge variant="neutral" size="md">
                {formatLabel(riskProfile)} Investor
              </Badge>
              <Badge variant="primary" size="md">
                {formatLabel(personaTrack)}
              </Badge>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="mb-10 flex flex-col gap-3"
            >
              {recommendedActions.map((action, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="flex items-start gap-3 text-left">
                    <IconCircleCheck
                      size={22}
                      className="mt-0.5 shrink-0 text-brand-success"
                    />
                    <span className="text-body text-brand-text-primary">
                      {action}
                    </span>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="w-full sm:w-auto"
              >
                Go to Dashboard
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ── Steps 1-8 ── */
  return (
    <div className="flex min-h-screen flex-col items-center bg-brand-bg">
      <Link href="/" className="mt-8 mb-6 inline-block transition-transform hover:scale-105">
        <Image src="/logo.png" alt="Varsity Tribe" width={160} height={48} className="h-10 w-auto" />
      </Link>

      {/* Progress */}
      <ProgressBar
        value={(step / 9) * 100}
        color="primary"
        size="sm"
        className="max-w-[640px] w-full px-4"
      />
      <p className="text-small text-brand-text-tertiary mt-2">
        Step {step} of 9
      </p>

      {/* Step Content */}
      <div className="flex w-full max-w-[640px] flex-1 flex-col px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ x: direction * 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction * -50, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {/* ── Step 1: Age ── */}
            {step === 1 && (
              <>
                <StepHeader
                  title="How old are you?"
                  subtitle="This helps us tailor content to your life stage."
                />
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { emoji: '🎓', label: '18–22', value: '18-22' },
                      { emoji: '💼', label: '23–28', value: '23-28' },
                      { emoji: '🚀', label: '29–35', value: '29-35' },
                      { emoji: '🏠', label: '36–45', value: '36-45' },
                      { emoji: '📊', label: '46–55', value: '46-55' },
                      { emoji: '🌅', label: '55+', value: '55+' },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={ageBracket === opt.value}
                      onClick={() => setAgeBracket(opt.value)}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-body font-medium text-brand-text-primary">
                        {opt.label}
                      </span>
                    </OptionCard>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 2: Income ── */}
            {step === 2 && (
              <>
                <StepHeader
                  title="What's your annual income?"
                  subtitle="This stays private. It helps set realistic goals."
                />
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { emoji: '🎒', label: 'No income yet', value: 'no-income' },
                      { emoji: '💰', label: `${formatCurrency(0, currencyStore)} – ${formatCurrency(500000, currencyStore)}`, value: '0-5L' },
                      { emoji: '💰', label: `${formatCurrency(500000, currencyStore)} – ${formatCurrency(1000000, currencyStore)}`, value: '5-10L' },
                      { emoji: '💰', label: `${formatCurrency(1000000, currencyStore)} – ${formatCurrency(2000000, currencyStore)}`, value: '10-20L' },
                      { emoji: '💰', label: `${formatCurrency(2000000, currencyStore)} – ${formatCurrency(5000000, currencyStore)}`, value: '20-50L' },
                      { emoji: '💰', label: `${formatCurrency(5000000, currencyStore)}+`, value: '50L+' },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={incomeRange === opt.value}
                      onClick={() => setIncomeRange(opt.value)}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-body font-medium text-brand-text-primary">
                        {opt.label}
                      </span>
                    </OptionCard>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 3: Goals (multi-select) ── */}
            {step === 3 && (
              <>
                <StepHeader
                  title="What are your financial goals?"
                  subtitle="Select all that apply."
                />
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { icon: IconShield, label: 'Emergency Fund', value: 'emergency-fund' },
                      { icon: IconPlane, label: 'Travel', value: 'travel' },
                      { icon: IconSchool, label: 'Higher Education', value: 'higher-education' },
                      { icon: IconCar, label: 'Vehicle', value: 'vehicle' },
                      { icon: IconHome, label: 'Home Down Payment', value: 'home-down-payment' },
                      { icon: IconHeart, label: 'Wedding', value: 'wedding' },
                      { icon: IconSunHigh, label: 'Retirement', value: 'retirement' },
                      { icon: IconShoppingCart, label: 'Major Purchase', value: 'major-purchase' },
                    ] as const
                  ).map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <OptionCard
                        key={opt.value}
                        selected={goals.includes(opt.value)}
                        onClick={() => toggleGoal(opt.value)}
                      >
                        <Icon
                          size={24}
                          className={cn(
                            'mb-1',
                            goals.includes(opt.value)
                              ? 'text-brand-primary'
                              : 'text-brand-text-tertiary',
                          )}
                        />
                        <span className="text-body font-medium text-brand-text-primary">
                          {opt.label}
                        </span>
                      </OptionCard>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── Step 4: Experience ── */}
            {step === 4 && (
              <>
                <StepHeader title="How much investing experience do you have?" />
                <div className="grid grid-cols-1 gap-3">
                  {(
                    [
                      {
                        emoji: '🆕',
                        title: 'None',
                        desc: "I've never invested before",
                        value: 'none',
                      },
                      {
                        emoji: '🌱',
                        title: 'Beginner',
                        desc: "I've done some FDs or saved in PPF",
                        value: 'beginner',
                      },
                      {
                        emoji: '📈',
                        title: 'Intermediate',
                        desc: 'I invest in mutual funds or stocks',
                        value: 'intermediate',
                      },
                      {
                        emoji: '🎯',
                        title: 'Advanced',
                        desc: 'I actively manage a diversified portfolio',
                        value: 'advanced',
                      },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={experience === opt.value}
                      onClick={() => setExperience(opt.value)}
                      className="flex-row! items-center! justify-start! gap-3 text-left!"
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div>
                        <p className="text-body font-semibold text-brand-text-primary">
                          {opt.title}
                        </p>
                        <p className="text-small text-brand-text-secondary">
                          {opt.desc}
                        </p>
                      </div>
                    </OptionCard>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 5: Risk ── */}
            {step === 5 && (
              <>
                <StepHeader
                  title="How comfortable are you with risk?"
                  subtitle={`Imagine ${formatCurrency(100000, currencyStore)} drops to ${formatCurrency(85000, currencyStore)}. How do you feel?`}
                />
                <div className="grid grid-cols-1 gap-3">
                  {(
                    [
                      { emoji: '😰', num: 1, desc: "Very uncomfortable — I'd lose sleep" },
                      { emoji: '😟', num: 2, desc: "Uncomfortable — I'd worry a lot" },
                      { emoji: '😐', num: 3, desc: "Neutral — I understand it's temporary" },
                      { emoji: '🙂', num: 4, desc: "Comfortable — It's part of investing" },
                      { emoji: '😎', num: 5, desc: "Very comfortable — I'd buy more!" },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.num}
                      selected={riskComfort === opt.num}
                      onClick={() => setRiskComfort(opt.num)}
                      className="flex-row! items-center! justify-start! gap-3 text-left!"
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <div>
                        <span className="text-body font-semibold text-brand-text-primary">
                          {opt.num}
                        </span>
                        <span className="text-body text-brand-text-secondary ml-2">
                          — {opt.desc.split('— ')[1]}
                        </span>
                      </div>
                    </OptionCard>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 6: Motivation ── */}
            {step === 6 && (
              <>
                <StepHeader title="What motivates you to learn about money?" />
                <div className="grid grid-cols-1 gap-3">
                  {(
                    [
                      { emoji: '🏦', label: 'Build long-term wealth' },
                      { emoji: '👨‍👩‍👧', label: 'Provide for my family' },
                      { emoji: '🔓', label: 'Achieve financial freedom' },
                      { emoji: '🏖️', label: 'Retire early' },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.label}
                      selected={!isMotivationOther && motivation === opt.label}
                      onClick={() => {
                        setMotivation(opt.label);
                        setIsMotivationOther(false);
                      }}
                      className="flex-row! items-center! justify-start! gap-3 text-left!"
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className="text-body font-medium text-brand-text-primary">
                        {opt.label}
                      </span>
                    </OptionCard>
                  ))}
                  <OptionCard
                    selected={isMotivationOther}
                    onClick={() => {
                      setIsMotivationOther(true);
                      setMotivation('');
                    }}
                    className="flex-row! items-center! justify-start! gap-3 text-left!"
                  >
                    <span className="text-2xl shrink-0">✏️</span>
                    <span className="text-body font-medium text-brand-text-primary">
                      Other
                    </span>
                  </OptionCard>
                  {isMotivationOther && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        label="Tell us more"
                        placeholder="What motivates you?"
                        value={motivationOther}
                        onChange={(e) => setMotivationOther(e.target.value)}
                      />
                    </motion.div>
                  )}
                </div>
              </>
            )}

            {/* ── Step 7: Time ── */}
            {step === 7 && (
              <>
                <StepHeader title="How much time can you spend learning each week?" />
                <div className="grid grid-cols-2 gap-3">
                  {(
                    [
                      { emoji: '⏱️', label: '1–2 hours', value: '1-2h' },
                      { emoji: '⏱️', label: '3–5 hours', value: '3-5h' },
                      { emoji: '⏱️', label: '5–10 hours', value: '5-10h' },
                      { emoji: '⏱️', label: '10+ hours', value: '10h+' },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.value}
                      selected={timeAvailable === opt.value}
                      onClick={() => setTimeAvailable(opt.value)}
                    >
                      <span className="text-2xl mb-1">{opt.emoji}</span>
                      <span className="text-body font-medium text-brand-text-primary">
                        {opt.label}
                      </span>
                    </OptionCard>
                  ))}
                </div>
              </>
            )}

            {/* ── Step 8: Worry ── */}
            {step === 8 && (
              <>
                <StepHeader title="What's your biggest financial worry?" />
                <div className="grid grid-cols-1 gap-3">
                  {(
                    [
                      { emoji: '😟', label: 'Not saving enough' },
                      { emoji: '🤷', label: "Don't know where to invest" },
                      { emoji: '💳', label: 'Too much debt' },
                      { emoji: '🛡️', label: 'No emergency fund' },
                      { emoji: '👴', label: 'Retirement planning' },
                    ] as const
                  ).map((opt) => (
                    <OptionCard
                      key={opt.label}
                      selected={!isWorryOther && worry === opt.label}
                      onClick={() => {
                        setWorry(opt.label);
                        setIsWorryOther(false);
                      }}
                      className="flex-row! items-center! justify-start! gap-3 text-left!"
                    >
                      <span className="text-2xl shrink-0">{opt.emoji}</span>
                      <span className="text-body font-medium text-brand-text-primary">
                        {opt.label}
                      </span>
                    </OptionCard>
                  ))}
                  <OptionCard
                    selected={isWorryOther}
                    onClick={() => {
                      setIsWorryOther(true);
                      setWorry('');
                    }}
                    className="flex-row! items-center! justify-start! gap-3 text-left!"
                  >
                    <span className="text-2xl shrink-0">✏️</span>
                    <span className="text-body font-medium text-brand-text-primary">
                      Other
                    </span>
                  </OptionCard>
                  {isWorryOther && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.2 }}
                    >
                      <Input
                        label="Tell us more"
                        placeholder="What worries you?"
                        value={worryOther}
                        onChange={(e) => setWorryOther(e.target.value)}
                      />
                    </motion.div>
                  )}
                </div>
              </>
            )}


          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Nav */}
      <div className="flex w-full max-w-[640px] items-center justify-between px-4 pb-8">
        {step > 1 ? (
          <Button
            variant="ghost"
            icon={<IconArrowLeft size={18} />}
            onClick={goBack}
          >
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button
          variant="primary"
          disabled={!isStepValid()}
          onClick={goNext}
        >
          {step === 9 ? 'See My Plan' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
