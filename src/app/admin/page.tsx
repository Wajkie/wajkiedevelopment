'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Auto-generera slug från titel
  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/å/g, 'a')
      .replace(/ä/g, 'a')
      .replace(/ö/g, 'o')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setFormData({ ...formData, title, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Blogginlägg sparat!');
        setTimeout(() => {
          router.push(`/blog/${data.slug}`);
        }, 1500);
      } else {
        setMessage(`❌ Fel: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Kunde inte spara inlägg');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">Nytt blogginlägg</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Titel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min fantastiska bloggpost"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="min-fantastiska-bloggpost"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                URL: /blog/{formData.slug || 'slug-genereras-automatiskt'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Datum
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Excerpt (kort beskrivning)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="En kort sammanfattning av inlägget..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Innehåll (Markdown)
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows={20}
                placeholder="# Min rubrik&#10;&#10;Här skriver du ditt innehåll med **markdown**!&#10;&#10;## Underrubrik&#10;&#10;- Lista&#10;- Med punkter"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Använd Markdown: **fet**, *kursiv*, # Rubrik, etc.
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {saving ? 'Sparar...' : 'Spara inlägg'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/blog')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Avbryt
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Markdown-guide:</h3>
          <ul className="text-sm space-y-1">
            <li><code className="bg-white px-2 py-0.5 rounded"># Rubrik 1</code></li>
            <li><code className="bg-white px-2 py-0.5 rounded">## Rubrik 2</code></li>
            <li><code className="bg-white px-2 py-0.5 rounded">**fet text**</code></li>
            <li><code className="bg-white px-2 py-0.5 rounded">*kursiv text*</code></li>
            <li><code className="bg-white px-2 py-0.5 rounded">- Lista</code></li>
            <li><code className="bg-white px-2 py-0.5 rounded">[länk](https://...)</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
