'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';

export default function TermsPage() {
  return (
    <PageLayout>
      <Container className="py-12 max-w-4xl">
        <h1 className="text-h1 mb-6">Terms of Service</h1>
        <div className="prose prose-slate dark:prose-invert">
          <p>Last updated: June 2026</p>
          <h2>1. Terms</h2>
          <p>
            By accessing the website at Varsity Tribe, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.
          </p>
          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the materials (information or software) on Varsity Tribe's website for personal, non-commercial transitory viewing only.
          </p>
          <h2>3. Disclaimer</h2>
          <p>
            The materials on Varsity Tribe's website are provided on an 'as is' basis. Varsity Tribe makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>
          <h2>4. Limitations</h2>
          <p>
            In no event shall Varsity Tribe or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Varsity Tribe's website.
          </p>
        </div>
      </Container>
    </PageLayout>
  );
}
