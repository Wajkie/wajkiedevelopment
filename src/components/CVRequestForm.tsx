'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';

export default function CVRequestForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    try {
      const response = await fetch('/api/send-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('CV och personligt brev skickat! Kolla din inkorg.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Något gick fel. Försök igen.');
      }
    } catch {
      setStatus('error');
      setMessage('Kunde inte skicka. Kontrollera din internetanslutning.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl text-center">
      <CardHeader>
        <div className="text-8xl mb-4">🤷‍♂️</div>
        <CardTitle as="h1" className="text-6xl mb-4">
          404
        </CardTitle>
        <CardDescription className="text-xl">
          Sidan du letar efter finns inte
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 text-left">
          <p className="text-muted-foreground">
            <strong>Letar du efter mitt CV eller personliga brev?</strong>
          </p>
          <p className="text-muted-foreground">
            Det finns inte här. Istället bjuder jag på något mycket bättre:
          </p>
          <ul className="space-y-2 text-muted-foreground pl-6">
            <li>✨ <strong>Levande kod</strong> – Se mina projekt på GitHub</li>
            <li>📦 <strong>Publicerade paket</strong> – Användbara npm-paket som andra utvecklare använder</li>
            <li>🚀 <strong>CI/CD pipelines</strong> – Professionell utvecklingsprocess i praktiken</li>
            <li>📝 <strong>Tekniska artiklar</strong> – Min blogg där jag delar kunskap och lärdomar</li>
            <li>🎨 <strong>Modern design</strong> – Den här sajten är mitt CV</li>
          </ul>
          <p className="text-muted-foreground italic">
            Varför läsa om vad jag kan när du kan <strong>se</strong> vad jag bygger?
          </p>
        </div>

        {/* CV Request Form */}
        <div className="border-t border-border pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Behöver du ändå ett traditionellt CV? Ange din e-post så skickar jag det direkt.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Label htmlFor="email" className="sr-only">
                  E-postadress
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="din@email.se"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
              <Button type="submit" disabled={loading || !email}>
                {loading ? 'Skickar...' : 'Skicka CV'}
              </Button>
            </div>
            {status === 'success' && (
              <p className="text-sm text-green-400">{message}</p>
            )}
            {status === 'error' && (
              <p className="text-sm text-red-400">{message}</p>
            )}
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild>
            <Link href="/">Tillbaka till startsidan</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">Se mina projekt</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">Läs min blogg</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
