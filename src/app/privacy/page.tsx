'use client';

import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';

export default function PrivacyPage() {
  return (
    <PageLayout>
      <Container className="py-12 max-w-4xl">
        <h1 className="text-h1 mb-6">Privacy Policy</h1>
        <div className="prose prose-slate dark:prose-invert">
          <p>Last updated: June 2026</p>
          <p>
            Welcome to Varsity Tribe. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you as to how we look after your personal data when you visit our website
            (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
          </p>
          <h2>1. Important Information and Who We Are</h2>
          <p>
            Varsity Tribe is the controller and responsible for your personal data.
          </p>
          <h2>2. The Data We Collect About You</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
            Identity Data, Contact Data, Financial Data, Transaction Data, Technical Data, Profile Data, Usage Data.
          </p>
          <h2>3. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
            Where we need to perform the contract we are about to enter into or have entered into with you.
          </p>
          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.
          </p>
        </div>
      </Container>
    </PageLayout>
  );
}
