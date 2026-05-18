'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { sendCV } from '@/lib/actions/email';
import { getFormFieldAriaAttributes } from '@wajkie/a11y-core';
import { useAnnouncer } from '@wajkie/react-a11y';
import { useTranslations } from '@/lib/i18n';

export default function CVRequestForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const tr = useTranslations();

  const announce = useAnnouncer();

  useEffect(() => {
    if (status !== 'idle') {
      announce(message, status === 'error' ? 'assertive' : 'polite');
    }
  }, [status, message, announce]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      await sendCV(email);
      setStatus('success');
      setMessage(tr.notFound.successMessage);
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : tr.notFound.errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl text-center">
      <CardHeader>
        <div className="text-5xl sm:text-6xl md:text-8xl mb-4">🤷‍♂️</div>
        <CardTitle as="h1" className="text-4xl sm:text-5xl md:text-6xl mb-4">
          {tr.notFound.code}
        </CardTitle>
        <CardDescription className="text-xl">
          {tr.notFound.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 text-left">
          <p className="text-muted-foreground font-medium">
            {tr.notFound.cvHeading}
          </p>
          <p className="text-muted-foreground">
            {tr.notFound.cvDescription}
          </p>
          <ul className="space-y-1 text-muted-foreground pl-4 text-sm">
            {tr.notFound.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
          <p className="text-muted-foreground italic text-sm pt-1">
            {tr.notFound.cta}
          </p>
        </div>

        {/* CV Request */}
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-3">
            {tr.notFound.cvRequestDescription}
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  {tr.notFound.emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={tr.notFound.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                  {...getFormFieldAriaAttributes('email', status === 'error', false)}
                />
              </div>
              <Button
                type="submit"
                disabled={loading || !email}
                aria-busy={loading}
              >
                {loading ? tr.notFound.sending : tr.notFound.sendCv}
              </Button>
            </div>
            {status === 'success' && (
              <p className="text-sm text-green-400" role="status" aria-live="polite">
                {message}
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400" role="alert" aria-live="assertive">
                {message}
              </p>
            )}
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild>
            <Link href="/">{tr.notFound.backHome}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">{tr.notFound.viewProjects}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">{tr.notFound.readBlog}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
