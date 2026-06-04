'use client';

import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Container } from '@/components/layout/Container';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <PageLayout>
      <Container className="py-12 max-w-4xl">
        <h1 className="text-h1 mb-6 text-center">Contact Us</h1>
        <p className="text-center text-brand-text-secondary mb-12">
          Have a question or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
        </p>

        <div className="max-w-xl mx-auto">
          {submitted ? (
            <Card className="p-8 text-center bg-brand-success/10 border-brand-success/20">
              <h2 className="text-h3 text-brand-success mb-2">Message Sent!</h2>
              <p className="text-brand-text-secondary">
                Thank you for reaching out. We will respond to your inquiry within 24-48 hours.
              </p>
              <Button onClick={() => setSubmitted(false)} className="mt-6" variant="primary">
                Send Another Message
              </Button>
            </Card>
          ) : (
            <Card variant="elevated" className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Name"
                  placeholder="Your full name"
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="your.email@example.com"
                  required
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-brand-text-primary">
                    Message
                  </label>
                  <textarea
                    className="flex w-full rounded-md border border-brand-border bg-brand-surface px-3 py-2 text-sm placeholder:text-brand-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent min-h-[120px]"
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          )}
        </div>
      </Container>
    </PageLayout>
  );
}
