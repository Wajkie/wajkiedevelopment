'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Label } from '@/components/ui';
import { setupAuth } from '@/lib/actions/auth';
import { useTranslations } from '@/lib/i18n';

export default function SetupPage() {
  const tr = useTranslations();
  const [data, setData] = useState<{
    secret: string;
    qrCodeDataUrl: string;
    hasExisting: boolean;
    existingSecret?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setupAuth()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">{tr.auth.setup.loading}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{tr.auth.setup.loadingError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (data.hasExisting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <span aria-hidden="true">⚠️</span>
              {tr.auth.setup.alreadySetup}
            </CardTitle>
            <CardDescription>
              {tr.auth.setup.alreadySetupDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {tr.auth.setup.alreadySetupHint}
            </p>
            {data.existingSecret && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground font-mono break-all">
                  {tr.auth.setup.currentSecret}{data.existingSecret.substring(0, 10)}...
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/auth/signin">{tr.auth.setup.goToLogin}</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span aria-hidden="true">🔐</span>
            {tr.auth.setup.title}
          </CardTitle>
          <CardDescription>
            {tr.auth.setup.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg">
            <Image
              src={data.qrCodeDataUrl}
              alt={tr.auth.setup.qrAlt}
              width={300}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <Label htmlFor="manual-secret">
              {tr.auth.setup.manualEntry}
            </Label>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">{tr.auth.setup.secretLabel}</p>
              <code
                id="manual-secret"
                className="text-sm text-accent font-mono break-all select-all block"
                tabIndex={0}
              >
                {data.secret}
              </code>
            </div>
          </div>

          {/* Instructions */}
          <div
            className="p-4 rounded-lg bg-accent/10 border border-accent/20"
            role="region"
            aria-label={tr.auth.setup.instructionsTitle}
          >
            <h3 className="text-sm font-semibold text-accent mb-2">
              {tr.auth.setup.important}
            </h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              {tr.auth.setup.steps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </div>

          {/* Environment Variable */}
          <div className="space-y-2">
            <Label htmlFor="env-totp">{tr.auth.setup.envLabel}</Label>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <code
                id="env-totp"
                className="text-sm text-accent font-mono select-all block"
                tabIndex={0}
              >
                TOTP_SECRET={data.secret}
              </code>
            </div>
          </div>

          {/* Generate Session Secret */}
          <div className="space-y-2">
            <Label htmlFor="env-session">{tr.auth.setup.sessionSecretLabel}</Label>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <code
                id="env-session"
                className="text-xs text-muted-foreground font-mono select-all block"
                tabIndex={0}
              >
                openssl rand -base64 32
              </code>
            </div>
          </div>

          <div
            className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center"
            role="alert"
          >
            {tr.auth.setup.warning}
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button asChild className="flex-1">
            <a href="/auth/signin">{tr.auth.setup.goToLogin}</a>
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            {tr.auth.setup.generateNew}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
