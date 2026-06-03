'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Badge } from '@/components/ui/Badge';
import { 
  IconCalculator, 
  IconHomeDollar, 
  IconChartPie, 
  IconTrendingUp,
  IconShieldCheck,
  IconAlertCircle,
  IconArrowRight
} from '@tabler/icons-react';
import { Container } from "@/components/layout/Container";
import { PageLayout } from "@/components/layout/PageLayout";

export default function ToolsHubPage() {
  const tools = [
    {
      title: 'SIP Calculator',
      description: 'Calculate wealth over time with regular investments.',
      icon: <IconTrendingUp className="w-8 h-8 text-brand-primary" />,
      href: '/tools/sip',
      color: 'bg-brand-primary/10',
    },
    {
      title: 'EMI Calculator',
      description: 'Plan your loans and visualize interest payments.',
      icon: <IconHomeDollar className="w-8 h-8 text-brand-success" />,
      href: '/tools/emi',
      color: 'bg-brand-success/10',
    },
    {
      title: 'Retirement Planner',
      description: 'Find out if you are on track for a comfortable retirement.',
      icon: <IconCalculator className="w-8 h-8 text-brand-warning" />,
      href: '/tools/retirement',
      color: 'bg-brand-warning/10',
    },
    {
      title: 'Portfolio Analyzer',
      description: 'Analyze asset allocation and measure your portfolio risk.',
      icon: <IconChartPie className="w-8 h-8 text-brand-danger" />,
      href: '/tools/portfolio',
      color: 'bg-brand-danger/10',
    },
  ];

  return (
    <PageLayout>
      <Container className="space-y-8 pb-12">
        <div className="pt-6 pb-2">
          <Link href="/dashboard" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l14 0" /><path d="M5 12l6 6" /><path d="M5 12l6 -6" /></svg>
            Back to Dashboard
          </Link>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8 pb-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Financial Tools</h1>
            <p className="text-brand-text-secondary">Plan, calculate, and secure your financial future.</p>
          </div>

          {/* Financial Health Score Widget */}
          <Card variant="elevated" className="relative overflow-hidden glass-strong">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <IconShieldCheck className="w-48 h-48 text-brand-primary" />
            </div>
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl font-semibold mb-2">Financial Health Score</h2>
                <p className="text-sm text-brand-text-secondary mb-6">
                  Your overall financial well-being based on savings, debt, and investments.
                </p>
                <div className="flex items-end gap-3 mb-2">
                  <span className="text-5xl font-bold text-brand-primary">742</span>
                  <span className="text-lg text-brand-text-tertiary mb-1">/ 1000</span>
                </div>
                <ProgressBar value={74} color="primary" size="lg" className="max-w-md" />
                <div className="mt-4 flex gap-2">
                  <Badge variant="success" size="sm">Good Standing</Badge>
                  <Badge variant="neutral" size="sm">Top 20%</Badge>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="bg-brand-surface p-4 rounded-xl border border-brand-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Emergency Fund</span>
                    <Badge variant="success" size="sm">Good</Badge>
                  </div>
                  <p className="text-xs text-brand-text-tertiary">3 months of expenses saved.</p>
                </div>
                <div className="bg-brand-surface p-4 rounded-xl border border-brand-border/50">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">Debt Management</span>
                    <Badge variant="warning" size="sm" icon={<IconAlertCircle size={14} />}>Needs Work</Badge>
                  </div>
                  <p className="text-xs text-brand-text-tertiary">High credit utilization.</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool, idx) => (
              <Link href={tool.href} key={idx} className="block group">
                <Card hoverable className="h-full flex flex-col glass-strong transition-all duration-300 group-hover:border-brand-primary/50">
                  <div className={`p-3 rounded-2xl w-fit mb-4 ${tool.color}`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-brand-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-brand-text-secondary flex-1">
                    {tool.description}
                  </p>
                  <div className="mt-6 flex items-center text-sm font-medium text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 transform duration-300">
                    Open Tool <IconArrowRight size={16} className="ml-1" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </Container>
    </PageLayout>
  );
}
