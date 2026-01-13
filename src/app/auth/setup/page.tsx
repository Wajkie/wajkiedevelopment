'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

export default function SetupPage() {
  const [data, setData] = useState<{
    secret: string;
    qrCodeDataUrl: string;
    hasExisting: boolean;
    existingSecret?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/setup')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Laddar...</p>
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
            <p className="text-center text-destructive">Fel vid laddning</p>
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
              Setup redan klar
            </CardTitle>
            <CardDescription>
              TOTP_SECRET finns redan i dina environment variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Om du vill generera en ny secret, ta bort TOTP_SECRET från .env.local och ladda om denna sida.
            </p>
            {data.existingSecret && (
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground font-mono break-all">
                  Current secret: {data.existingSecret.substring(0, 10)}...
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/auth/signin">Gå till login</a>
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
            TOTP Setup
          </CardTitle>
          <CardDescription>
            Scanna QR-koden med Google Authenticator, 1Password eller annan TOTP-app
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg">
            <Image 
              src={data.qrCodeDataUrl} 
              alt="TOTP QR-kod för autentisering" 
              width={300}
              height={300}
              className="w-full h-auto"
              priority
            />
          </div>

          {/* Manual Entry */}
          <div className="space-y-2">
            <Label htmlFor="manual-secret">
              Eller ange manuellt i appen:
            </Label>
            <div className="p-3 rounded-lg bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground mb-1">Secret:</p>
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
            aria-label="Installationsinstruktioner"
          >
            <h3 className="text-sm font-semibold text-accent mb-2">
              ⚠️ VIKTIGT:
            </h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Scanna koden med din authenticator app</li>
              <li>Kopiera secret nedan</li>
              <li>Lägg till i <code className="bg-muted px-1 rounded">.env.local</code></li>
              <li>Starta om dev server</li>
            </ol>
          </div>

          {/* Environment Variable */}
          <div className="space-y-2">
            <Label htmlFor="env-totp">Lägg till i .env.local:</Label>
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
            <Label htmlFor="env-session">Generera också SESSION_SECRET:</Label>
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
            🔒 Ta bort denna route efter setup i production!
          </div>
        </CardContent>

        <CardFooter className="flex gap-3">
          <Button asChild className="flex-1">
            <a href="/auth/signin">Gå till login</a>
          </Button>
          <Button
            variant="secondary"
            onClick={() => window.location.reload()}
            className="flex-1"
          >
            Generera ny
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
