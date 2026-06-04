'use client';

import { useGoalStore } from '@/stores/useGoalStore';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Breadcrumbs } from '@/components/ui';
import { IconTarget, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function GoalsPage() {
  const { goals } = useGoalStore();

  return (
    <PageLayout>
      <Container>
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Your Goals' }]} />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-h1">Your Goals</h1>
          {goals.length > 0 && (
            <Button variant="primary" size="sm" icon={<IconPlus size={16} />}>
              Add Goal
            </Button>
          )}
        </div>

        {goals.length === 0 ? (
          <Card variant="elevated" className="p-12 flex flex-col items-center justify-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary mb-6">
              <IconTarget size={40} />
            </div>
            <h2 className="text-h2 mb-2">No goals yet</h2>
            <p className="text-body text-brand-text-secondary max-w-md mb-8">
              Your future wealth journey starts with one goal. Set your first target, track your progress, and achieve financial freedom.
            </p>
            <Button variant="primary" size="md" icon={<IconPlus size={20} />}>
              Create First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Real goal rendering goes here if they exist */}
            <p className="text-body text-brand-text-secondary">Goals are present.</p>
          </div>
        )}
      </Container>
    </PageLayout>
  );
}
