'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { MarkdownToolbar, MarkdownGuide } from '@/components/blog';
import { Button } from '@/components/ui';
import { logoutUser } from '@/lib/actions/auth';
import { createPost } from '@/lib/actions/posts';
import { useAnnouncer } from '@wajkie/react-a11y';

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
  
  const announce = useAnnouncer();

  useEffect(() => {
    if (message) {
      const isSuccess = message.includes('✅');
      announce(message.replace(/✅|❌/g, '').trim(), isSuccess ? 'polite' : 'assertive');
    }
  }, [message, announce]);

  const handleLogout = async () => {
    await logoutUser();
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
      const result = await createPost(formData);
      setMessage('✅ Blogginlägg sparat!');
      setTimeout(() => {
        router.push(`/blog/${result.slug}`);
      }, 1500);
    } catch (error) {
      setMessage(`❌ Fel: ${error instanceof Error ? error.message : 'Kunde inte spara inlägg'}`);
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card as="section" aria-labelledby="page-title">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle as="h1" id="page-title" className="text-3xl">
                  Nytt blogginlägg
                </CardTitle>
                <CardDescription>
                  Skriv markdown, förhandsgranska och publicera direkt till GitHub
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={() => router.push('/admin')}
                  variant="outline"
                  size="sm"
                >
                  ← Dashboard
                </Button>
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
          </CardHeader>
        </Card>

        {/* Main Form Card */}
        <Card as="section" aria-labelledby="form-title">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-6">
              <h2 id="form-title" className="sr-only">
                Formulär för nytt blogginlägg
              </h2>
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Min fantastiska bloggpost"
                  required
                  autoFocus
                  aria-describedby="title-help"
                />
                <p id="title-help" className="text-sm text-muted-foreground">
                  Slug genereras automatiskt från titeln
                </p>
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input
                  id="slug"
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="min-fantastiska-bloggpost"
                  required
                  aria-describedby="slug-preview"
                />
                <p id="slug-preview" className="text-sm text-muted-foreground font-mono">
                  /blog/{formData.slug || 'slug-genereras-automatiskt'}
                </p>
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label htmlFor="date">Publiceringsdatum</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt (valfritt)</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="En kort sammanfattning av inlägget..."
                  rows={3}
                  aria-describedby="excerpt-help"
                />
                <p id="excerpt-help" className="text-sm text-muted-foreground">
                  Visas i blogglistningen
                </p>
              </div>

              {/* Content with Markdown Toolbar */}
              <div className="space-y-2">
                <Label htmlFor="content">Innehåll (Markdown)</Label>
                <div className="rounded-lg overflow-hidden border border-input">
                  <MarkdownToolbar 
                    onInsert={(newContent) => setFormData({ ...formData, content: newContent })}
                    textareaRef={contentTextareaRef}
                  />
                  <Textarea
                    id="content"
                    ref={contentTextareaRef}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="font-mono border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[400px]"
                    placeholder="# Min rubrik&#10;&#10;Här skriver du ditt innehåll med **markdown**!&#10;&#10;## Underrubrik&#10;&#10;- Lista&#10;- Med punkter"
                    required
                    aria-describedby="content-help"
                  />
                </div>
                <p id="content-help" className="text-sm text-muted-foreground">
                  Använd toolbar eller skriv markdown direkt
                </p>
              </div>

              {/* Message */}
              {message && (
                <div 
                  role="alert"
                  aria-live="polite"
                  className={`rounded-lg border p-4 ${
                    message.includes('✅') 
                      ? 'bg-accent/10 text-accent border-accent/20' 
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={saving}
                  aria-busy={saving}
                >
                  {saving ? 'Publicerar...' : 'Publicera blogginlägg'}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.push('/blog')}
                  variant="outline"
                >
                  Avbryt
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>

        {/* Markdown Guide Modal */}
        <MarkdownGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
      </div>
    </main>
  );
}
