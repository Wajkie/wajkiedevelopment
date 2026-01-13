'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import MarkdownToolbar from '@/components/MarkdownToolbar';
import MarkdownGuide from '@/components/MarkdownGuide';
import Button from '@/components/ui/Button';

export default function AdminClient() {
  const router = useRouter();
  const contentTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  interface ApiResponse {
    slug?: string;
    error?: string;
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/signin');
    router.refresh();
  };

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

      const data = await response.json() as ApiResponse;

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
    <div className="min-h-screen dark bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Nytt blogginlägg</h1>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setShowGuide(true)}
                variant="outline"
                size="sm"
              >
                📖 Guide
              </Button>
              <Button
                type="button"
                onClick={handleLogout}
                variant="ghost"
                size="sm"
              >
                Logga ut
              </Button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Titel
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Min fantastiska bloggpost"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium leading-none">
                Slug (URL)
              </label>
              <input
                id="slug"
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="min-fantastiska-bloggpost"
                required
              />
              <p className="text-sm text-muted-foreground">
                /blog/{formData.slug || 'slug-genereras-automatiskt'}
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="date" className="text-sm font-medium leading-none">
                Datum
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium leading-none">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="En kort sammanfattning av inlägget..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium leading-none">
                Innehåll (Markdown)
              </label>
              <div className="border border-input rounded-md overflow-hidden">
                <MarkdownToolbar 
                  onInsert={(newContent) => setFormData({ ...formData, content: newContent })}
                  textareaRef={contentTextareaRef}
                />
                <textarea
                  id="content"
                  ref={contentTextareaRef}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-background text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none border-0"
                  rows={20}
                  placeholder="# Min rubrik&#10;&#10;Här skriver du ditt innehåll med **markdown**!&#10;&#10;## Underrubrik&#10;&#10;- Lista&#10;- Med punkter"
                  required
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Använd toolbar eller skriv markdown direkt
              </p>
            </div>

            {message && (
              <div 
                role="alert"
                aria-live="polite"
                className={`rounded-lg border p-4 ${message.includes('✅') ? 'bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={saving}
                variant="default"
                size="md"
              >
                {saving ? 'Sparar...' : 'Publicera'}
              </Button>
              <Button
                type="button"
                onClick={() => router.push('/blog')}
                variant="outline"
                size="md"
              >
                Avbryt
              </Button>
            </div>
          </form>
        </div>

        <MarkdownGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      </div>
    </div>
  );
}
