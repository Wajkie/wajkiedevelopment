'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Card } from '@/components/ui';
import { createToken, getVisitorStats } from './actions';

type Token = {
  id: number;
  name: string;
  allowedDomains: string[];
  rateLimit: number;
  createdAt: Date;
  lastUsedAt: Date | null;
};

type NewToken = Token & {
  token: string;
};

type VisitorStats = {
  totalVisits: number;
  uniqueVisitors: number;
  recentVisits: number;
  topPages: Array<{ path: string; visits: number }>;
  actions: Array<{ action: string; count: number }>;
};

export default function AnalyticsClient({ initialTokens }: { initialTokens: Token[] }) {
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [newToken, setNewToken] = useState<NewToken | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [selectedTokenId, setSelectedTokenId] = useState<number | undefined>();

  // Form state
  const [name, setName] = useState('');
  const [domains, setDomains] = useState('');
  const [rateLimit, setRateLimit] = useState('100');

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const data = await getVisitorStats(selectedTokenId);
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoadingStats(false);
    }
  }, [selectedTokenId]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const data = await createToken({
        name,
        allowedDomains: domains.split(',').map(d => d.trim()).filter(Boolean),
        rateLimit: parseInt(rateLimit),
      });

      setNewToken(data);
      setTokens([data, ...tokens]);

      // Reset form
      setName('');
      setDomains('');
      setRateLimit('100');
    } catch (error) {
      console.error('Error creating token:', error);
      alert('Kunde inte skapa token');
    } finally {
      setIsCreating(false);
    }
  };

  const getCodeSnippet = (token: string) => {
    return `// Visitor Tracking - Add to your project
// Place in a utility file (e.g., utils/tracking.ts)

export function trackVisit(action = 'visit', path?: string) {
  if (typeof window === 'undefined') return;
  if (navigator.userAgent.includes('bot')) return;

  fetch('${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wajkiedevelopment.se'}/api/visitor/track', {
    method: 'POST',
    body: JSON.stringify({
      key: '${token}',
      action,
      path: path || window.location.pathname
    }),
    signal: AbortSignal.timeout(3000)
  }).catch(() => {});
}

// Usage examples:
// trackVisit(); // Track page visit
// trackVisit('click', '/features'); // Track custom action`;
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <Card className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Visitor tracking, statistik och API tokens
              </p>
            </div>
            <Button onClick={() => router.push('/admin')} variant="outline">
              ← Dashboard
            </Button>
          </div>
        </Card>

        {/* Token Filter + Refresh */}
        {tokens.length > 0 && (
          <Card className="p-6">
            <Label htmlFor="token-filter" className="text-sm font-medium">
              Filtrera per token:
            </Label>
            <div className="flex gap-2 mt-2">
              <select
                id="token-filter"
                value={selectedTokenId || ''}
                onChange={(e) => setSelectedTokenId(e.target.value ? Number(e.target.value) : undefined)}
                className="flex-1 px-3 py-2 bg-background border border-input rounded-md"
              >
                <option value="">Alla tokens</option>
                {tokens.map((token) => (
                  <option key={token.id} value={token.id}>
                    {token.name}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={loadStats} disabled={loadingStats}>
                {loadingStats ? 'Loading...' : '🔄 Refresh'}
              </Button>
            </div>
          </Card>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Total Visits</div>
              <div className="text-3xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Unique Visitors</div>
              <div className="text-3xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Last 24h</div>
              <div className="text-3xl font-bold">{stats.recentVisits.toLocaleString()}</div>
            </Card>
            <Card className="p-6">
              <div className="text-sm text-muted-foreground mb-2">Actions</div>
              <div className="text-3xl font-bold">{stats.actions.length}</div>
            </Card>
          </div>
        )}

        {/* Top Pages & Actions */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">🔥 Top Pages</h3>
              <div className="space-y-3">
                {stats.topPages.map((page, idx) => (
                  <div key={page.path} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">
                        #{idx + 1}
                      </span>
                      <span className="text-sm font-mono">{page.path}</span>
                    </div>
                    <span className="text-sm font-semibold">{page.visits}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">⚡ Actions</h3>
              <div className="space-y-3">
                {stats.actions.map((action) => (
                  <div key={action.action} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{action.action}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(action.count / stats.totalVisits) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold w-12 text-right">{action.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Create Token Form */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Skapa ny tracking token</h2>
          <form onSubmit={handleCreateToken} className="space-y-4">
            <div>
              <Label htmlFor="name">Projektnamn *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My Side Project"
                required
              />
            </div>

            <div>
              <Label htmlFor="domains">Tillåtna domäner (kommaseparerade)</Label>
              <Input
                id="domains"
                value={domains}
                onChange={(e) => setDomains(e.target.value)}
                placeholder="myproject.vercel.app, custom-domain.com"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Lämna tom för att tillåta alla domäner
              </p>
            </div>

            <div>
              <Label htmlFor="rateLimit">Rate Limit (requests/min)</Label>
              <Input
                id="rateLimit"
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(e.target.value)}
                placeholder="100"
              />
            </div>

            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Skapar...' : '🔑 Skapa Token'}
            </Button>
          </form>
        </Card>

        {/* New Token Display (shown once) */}
        {newToken && (
          <Card className="p-6 border-green-500 bg-green-50 dark:bg-green-950">
            <h2 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">
              ✅ Token skapad för &ldquo;{newToken.name}&rdquo;
            </h2>

            <div className="space-y-4">
              <div>
                <Label>Token (visas bara denna gång!)</Label>
                <div className="flex gap-2">
                  <Input
                    value={newToken.token}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(newToken.token);
                      alert('Token kopierad!');
                    }}
                    variant="outline"
                  >
                    📋 Kopiera
                  </Button>
                </div>
              </div>

              <div>
                <Label>Copy-Paste Ready Code</Label>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-xs">
                    <code>{getCodeSnippet(newToken.token)}</code>
                  </pre>
                  <Button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(getCodeSnippet(newToken.token));
                      alert('Code kopierad!');
                    }}
                    className="absolute top-2 right-2"
                    variant="outline"
                    size="sm"
                  >
                    📋 Kopiera kod
                  </Button>
                </div>
              </div>

              <Button type="button" onClick={() => setNewToken(null)} variant="outline">
                Stäng
              </Button>
            </div>
          </Card>
        )}

        {/* Existing Tokens */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Befintliga tokens</h2>
          {tokens.length === 0 ? (
            <p className="text-muted-foreground">Inga tokens skapade ännu</p>
          ) : (
            <div className="space-y-4">
              {tokens.map((token) => (
                <div key={token.id} className="border border-border rounded p-4">
                  <h3 className="font-bold">{token.name}</h3>
                  <div className="text-sm text-muted-foreground space-y-1 mt-2">
                    <p>ID: {token.id}</p>
                    <p>Domäner: {Array.isArray(token.allowedDomains) && token.allowedDomains.length > 0 ? token.allowedDomains.join(', ') : 'Alla'}</p>
                    <p>Rate Limit: {token.rateLimit}/min</p>
                    <p>Skapad: {new Date(token.createdAt).toLocaleDateString('sv-SE')}</p>
                    {token.lastUsedAt && (
                      <p>Senast använd: {new Date(token.lastUsedAt).toLocaleString('sv-SE')}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
