'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-white">Laddar...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="text-red-400">Fel vid laddning</div>
      </div>
    );
  }

  if (data.hasExisting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-red-400 mb-4">⚠️ Setup redan klar</h1>
          <p className="text-gray-300 mb-4">
            TOTP_SECRET finns redan i dina environment variables.
          </p>
          <p className="text-sm text-gray-400">
            Om du vill generera en ny secret, ta bort TOTP_SECRET från .env.local och ladda om denna sida.
          </p>
          {data.existingSecret && (
            <div className="mt-6 p-4 bg-gray-900 rounded border border-gray-700">
              <p className="text-xs text-gray-500 font-mono break-all">
                Current secret: {data.existingSecret.substring(0, 10)}...
              </p>
            </div>
          )}
          <a 
            href="/auth/signin" 
            className="mt-6 block w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition"
          >
            Gå till login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-white mb-2">🔐 TOTP Setup</h1>
        <p className="text-gray-400 mb-6">
          Scanna QR-koden med Google Authenticator eller 1Password
        </p>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-lg mb-6">
          <Image 
            src={data.qrCodeDataUrl} 
            alt="TOTP QR Code" 
            width={300}
            height={300}
            className="w-full h-auto"
          />
        </div>

        {/* Manual Entry */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Eller ange manuellt i appen:
          </label>
          <div className="bg-gray-900 p-3 rounded border border-gray-700">
            <p className="text-xs text-gray-500 mb-1">Secret:</p>
            <code className="text-sm text-blue-400 font-mono break-all select-all">
              {data.secret}
            </code>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-300 mb-2">⚠️ VIKTIGT:</h3>
          <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
            <li>Scanna koden med din app</li>
            <li>Kopiera secret nedan</li>
            <li>Lägg till i <code className="bg-gray-700 px-1 rounded">.env.local</code></li>
            <li>Starta om dev server</li>
          </ol>
        </div>

        {/* Environment Variable */}
        <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-6">
          <p className="text-xs text-gray-500 mb-2">Lägg till i .env.local:</p>
          <code className="text-sm text-green-400 font-mono select-all block">
            TOTP_SECRET={data.secret}
          </code>
        </div>

        {/* Generate Session Secret */}
        <div className="bg-gray-900 p-4 rounded border border-gray-700 mb-6">
          <p className="text-xs text-gray-500 mb-2">Generera också SESSION_SECRET:</p>
          <code className="text-xs text-gray-400 font-mono select-all block">
            openssl rand -base64 32
          </code>
        </div>

        <div className="flex gap-3">
          <a 
            href="/auth/signin" 
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-center hover:bg-blue-700 transition"
          >
            Gå till login
          </a>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
          >
            Generera ny
          </button>
        </div>

        <p className="text-xs text-red-400 mt-4 text-center">
          🔒 Ta bort denna route efter setup i production!
        </p>
      </div>
    </div>
  );
}
