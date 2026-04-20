'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Button } from '@/components/ui';
import { verifyAuthCode } from '@/lib/actions/auth';

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await verifyAuthCode(code);
      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Något gick fel');
      setCode('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <span aria-hidden="true">🔐</span>
              Admin Login
            </CardTitle>
            <CardDescription>
              Ange 6-siffrig kod från din authenticator app
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="totp-code" className="sr-only">
                  TOTP Kod
                </Label>
                <Input
                  id="totp-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  className="text-center text-2xl font-mono tracking-widest"
                  placeholder="000000"
                  autoFocus
                  autoComplete="one-time-code"
                  aria-label="Sexsiffrig TOTP-kod"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'code-error' : undefined}
                  required
                />
              </div>

              {error && (
                <div 
                  id="code-error"
                  role="alert"
                  className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading || code.length !== 6}
                className="w-full"
                aria-busy={loading}
              >
                {loading ? 'Verifierar...' : 'Logga in'}
              </Button>

              <div className="w-full pt-4 border-t border-border space-y-2 text-center">
                <p className="text-sm text-muted-foreground">
                  Behöver du sätta upp authenticator?
                </p>
                <a
                  href="/auth/setup"
                  className="text-sm text-accent hover:text-accent/80 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  Gå till setup →
                </a>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
