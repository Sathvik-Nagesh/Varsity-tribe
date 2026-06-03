"use client";

import React, { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import Link from 'next/link';
import { IconArrowLeft } from '@tabler/icons-react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { Card } from "@/components/ui";
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback() {
  return (
    <div className="flex-1 flex items-center justify-center bg-brand-surface-elevated rounded-2xl border border-brand-border h-[400px]">
      <div className="text-center p-6">
        <p className="text-brand-danger font-semibold mb-2">Visualization Failed</p>
        <p className="text-sm text-brand-text-secondary">We encountered an issue rendering the 3D scene.</p>
      </div>
    </div>
  );
}

import dynamic from 'next/dynamic';
const CompoundInterest3D = dynamic(() => import('./CompoundInterest3D'), { ssr: false });

const localFormatCurrency = (val: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(val);

export default function CompoundInterestLab() {
  const [monthlyInvestment, setMonthlyInvestment] = useState(500);
  const [years, setYears] = useState(30);
  const [expectedReturn, setExpectedReturn] = useState(8);

  const monthlyRate = expectedReturn / 100 / 12;
  const months = years * 12;
  const totalContributions = monthlyInvestment * months;
  const futureValue =
    monthlyRate === 0
      ? totalContributions
      : monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const totalInterest = futureValue - totalContributions;

  return (
    <PageLayout>
      <Container>
        <div className="py-6 flex items-center">
          <Link href="/learn" className="text-brand-text-secondary hover:text-brand-primary flex items-center gap-2 font-medium text-sm transition-colors">
            <IconArrowLeft size={16} /> Back to Learn
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 min-h-[700px] mb-12">
          
          {/* Controls Sidebar */}
          <Card variant="elevated" className="w-full lg:w-1/3 xl:w-1/4 p-6 sm:p-8 flex flex-col gap-8 shadow-xl bg-white/80 backdrop-blur-xl border border-white/40">
            <div>
              <h1 className="text-3xl font-display text-brand-primary mb-2">
                Wealth Lab
              </h1>
              <p className="text-sm text-brand-text-secondary font-medium">
                Visualize the exponential power of compound interest in 3D.
              </p>
            </div>

            {/* Results Summary */}
            <div className="bg-brand-surface-elevated rounded-xl p-5 border border-brand-border/60 space-y-4">
              <div>
                <p className="text-xs text-brand-text-secondary font-bold uppercase tracking-wider mb-1">
                  Future Value
                </p>
                <p className="text-4xl font-display text-brand-text-primary">
                  {localFormatCurrency(futureValue)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border/60">
                <div>
                  <p className="text-[10px] text-brand-text-tertiary font-bold uppercase tracking-wider mb-1">Contributions</p>
                  <p className="text-base font-semibold text-brand-text-secondary">
                    {localFormatCurrency(totalContributions)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-brand-success font-bold uppercase tracking-wider mb-1">Total Interest</p>
                  <p className="text-base font-semibold text-brand-success">
                    {localFormatCurrency(totalInterest)}
                  </p>
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-8 flex-1">
              {/* Monthly Investment */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-text-primary">
                    Monthly Investment
                  </label>
                  <span className="text-sm font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md border border-brand-primary/20">
                    {localFormatCurrency(monthlyInvestment)}
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[monthlyInvestment]}
                  max={5000}
                  step={50}
                  onValueChange={(val) => setMonthlyInvestment(val[0])}
                >
                  <Slider.Track className="bg-brand-surface-elevated border border-brand-border relative grow rounded-full h-2.5 overflow-hidden">
                    <Slider.Range className="absolute bg-brand-primary h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white border-2 border-brand-primary shadow-md rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-transform cursor-grab active:cursor-grabbing" />
                </Slider.Root>
              </div>

              {/* Years */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-text-primary">
                    Years to Grow
                  </label>
                  <span className="text-sm font-bold text-brand-secondary bg-brand-secondary/10 px-2 py-1 rounded-md border border-brand-secondary/20">
                    {years} Years
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[years]}
                  max={50}
                  min={1}
                  step={1}
                  onValueChange={(val) => setYears(val[0])}
                >
                  <Slider.Track className="bg-brand-surface-elevated border border-brand-border relative grow rounded-full h-2.5 overflow-hidden">
                    <Slider.Range className="absolute bg-brand-secondary h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white border-2 border-brand-secondary shadow-md rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-secondary/50 transition-transform cursor-grab active:cursor-grabbing" />
                </Slider.Root>
              </div>

              {/* Expected Return */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-brand-text-primary">
                    Expected Return
                  </label>
                  <span className="text-sm font-bold text-brand-warning bg-brand-warning/10 px-2 py-1 rounded-md border border-brand-warning/20">
                    {expectedReturn}%
                  </span>
                </div>
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[expectedReturn]}
                  max={20}
                  min={0}
                  step={0.5}
                  onValueChange={(val) => setExpectedReturn(val[0])}
                >
                  <Slider.Track className="bg-brand-surface-elevated border border-brand-border relative grow rounded-full h-2.5 overflow-hidden">
                    <Slider.Range className="absolute bg-brand-warning h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-6 h-6 bg-white border-2 border-brand-warning shadow-md rounded-full hover:scale-110 focus:outline-none focus:ring-2 focus:ring-brand-warning/50 transition-transform cursor-grab active:cursor-grabbing" />
                </Slider.Root>
              </div>
            </div>
          </Card>

          {/* 3D Canvas Container */}
          <Card variant="elevated" className="flex-1 relative min-h-[500px] w-full overflow-hidden p-0 bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] border-brand-border">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <div className="absolute inset-0">
                <CompoundInterest3D
                  monthlyInvestment={monthlyInvestment}
                  years={years}
                  expectedReturn={expectedReturn}
                />
              </div>
            </ErrorBoundary>
            
            <div className="absolute bottom-6 right-6 text-xs text-brand-text-tertiary font-medium bg-white/50 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-none">
              Drag to rotate • Scroll to zoom
            </div>
          </Card>
        </div>
      </Container>
    </PageLayout>
  );
}
