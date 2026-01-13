'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownToolbar from '@/components/MarkdownToolbar';
import Button from '@/components/ui/Button';

export default function AdminPage() {
  const router = useRouter();
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
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
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700">
          <h1 className="text-3xl font-bold mb-6 text-white">Nytt blogginlägg</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Titel
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min fantastiska bloggpost"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Slug (URL)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="min-fantastiska-bloggpost"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                URL: /blog/{formData.slug || 'slug-genereras-automatiskt'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Datum
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Excerpt (kort beskrivning)
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="En kort sammanfattning av inlägget..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Innehåll (Markdown)
              </label>
              <MarkdownToolbar 
                onInsert={(newContent) => setFormData({ ...formData, content: newContent })}
                textareaRef={contentTextareaRef}
              />
              <textarea
                ref={contentTextareaRef}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-b-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                rows={20}
                placeholder="# Min rubrik&#10;&#10;Här skriver du ditt innehåll med **markdown**!&#10;&#10;## Underrubrik&#10;&#10;- Lista&#10;- Med punkter"
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                Använd toolbar eller skriv markdown direkt
              </p>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${message.includes('✅') ? 'bg-green-900/50 text-green-200 border border-green-700' : 'bg-red-900/50 text-red-200 border border-red-700'}`}>
                {message}
              </div>
            )}

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={saving}
                variant="primary"
                size="md"
              >
                {saving ? 'Sparar...' : 'Spara inlägg'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/blog')}
                variant="secondary"
                size="md"
              >
                Avbryt
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4">
          <h3 className="font-semibold mb-2 text-white">Markdown-guide:</h3>
          <ul className="text-sm space-y-1 text-gray-300">
            <li><code className="bg-gray-700 px-2 py-0.5 rounded text-blue-400"># Rubrik 1</code></li>
            <li><code className="bg-gray-700 px-2 py-0.5 rounded text-blue-400">## Rubrik 2</code></li>
            <li><code className="bg-gray-700 px-2 py-0.5 rounded text-blue-400">**fet text**</code></li>
            <li><code className="bg-gray-700 px-2 py-0.5 rounded text-blue-400">*kursiv text*</code></li>
            <li><code className="bg-gray-700 px-2 py-0.5 rounded text-blue-400">- Lista</code></li>
            <li><code className="bg-gray-700 px-2 py-0.5 rounded text-blue-400">[länk](https://...)</code></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
