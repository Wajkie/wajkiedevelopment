'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  interface SignInResponse {
    error?: string;
  }
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json() as SignInResponse;

      if (response.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Ogiltig kod');
        setCode('');
      }
    } catch {
      setError('Något gick fel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">🔐 Admin Login</h1>
        <p className="text-gray-400 mb-6">
          Ange 6-siffrig kod från Google Authenticator
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              TOTP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="000000"
              autoFocus
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full"
          >
            {loading ? 'Verifierar...' : 'Logga in'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 text-center">
            Behöver du sätta upp authenticator?
          </p>
          <a
            href="/auth/setup"
            className="text-sm text-blue-400 hover:text-blue-300 block text-center mt-2"
          >
            → Gå till setup
          </a>
        </div>
      </div>
    </div>
  );
}
