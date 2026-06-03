'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  HeroSection,
  GoalShowcase,
  ToolsHub,
  CommunitySection,
  EventsSection,
  AchievementsSection,
  CtaSection,
} from '@/components/landing';
import { Footer } from '@/components/layout/Footer';
import { LandingNavbar } from '@/components/layout/LandingNavbar';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { useUserStore } from '@/stores/useUserStore';
import { PageLayout } from '@/components/layout/PageLayout';

export default function LandingPage() {
  const { onboardingCompleted } = useUserStore();
  const router = useRouter();

  // Removed automatic redirect to dashboard to allow access to homepage

  return (
    <PageLayout>
      <main className="flex flex-col overflow-x-hidden">
        <LandingNavbar />
        <HeroSection />
        <GoalShowcase />
        <ToolsHub />
        <CommunitySection />
        <EventsSection />
        <AchievementsSection />
        <CtaSection />
        <Footer />
        <ScrollToTop />
      </main>
    </PageLayout>
  );
}
