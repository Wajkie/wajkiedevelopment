import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Revalidera var 60:e sekund (ISR)
export const revalidate = 60;
// Force dynamic rendering (skippa pre-render under build)
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Hämta posts från databasen (snabbt!)
  const posts = await db
    .selectFrom('posts')
    .selectAll()
    .orderBy('createdAt', 'desc')
    .execute();

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Min blogg</h1>
          <Button asChild>
            <Link href="/admin">
              + Nytt inlägg
            </Link>
          </Button>
        </header>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground mb-4">Inga blogginlägg än.</p>
              <Button asChild>
                <Link href="/admin">
                  Skapa ditt första inlägg →
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.slug} as="article">
                <Link href={`/blog/${post.slug}`} className="block">
                  <CardHeader>
                    <CardTitle as="h2" className="hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <time className="text-muted-foreground text-sm" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('sv-SE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </CardHeader>
                  {post.excerpt && (
                    <CardContent>
                      <p className="text-foreground/80 mb-4">{post.excerpt}</p>
                      <span className="text-primary hover:text-accent transition-colors">
                        Läs mer →
                      </span>
                    </CardContent>
                  )}
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
