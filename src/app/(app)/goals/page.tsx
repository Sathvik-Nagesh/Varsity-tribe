'use client';

import { useGoalStore } from '@/stores/useGoalStore';
import { PageLayout } from "@/components/layout/PageLayout";
import { Container } from "@/components/layout/Container";
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { IconTarget, IconPlus } from '@tabler/icons-react';
import Link from 'next/link';

export default function GoalsPage() {
  const { goals } = useGoalStore();

  return (
    <PageLayout>
      <Container>
        {/* Breadcrumb inserted based on requirements */}
        <div className="mb-6">
          <Link href="/dashboard" className="text-small font-medium text-brand-primary hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>

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
              Create your first goal and start building wealth. Track your progress, manage SIPs, and achieve financial freedom.
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
