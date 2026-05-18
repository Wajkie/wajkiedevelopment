import Link from 'next/link';
import { db } from '@/lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { PageContainer, PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { getTranslations } from '@/lib/i18n/server';

// Revalidera var 60:e sekund (ISR)
export const revalidate = 60;
// Force dynamic rendering (skippa pre-render under build)
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const tr = await getTranslations();

  // Hämta posts från databasen (snabbt!)
  const posts = await db
    .selectFrom('posts')
    .selectAll()
    .orderBy('createdAt', 'desc')
    .execute();

  return (
    <PageContainer maxWidth="6xl">
      <PageHeader
        title={tr.blog.title}
        description={tr.blog.description}
        action={
          <Button asChild>
            <Link href="/admin">
              {tr.blog.newPost}
            </Link>
          </Button>
        }
      />

        {posts.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <p className="text-xl text-muted-foreground mb-6">{tr.blog.noPosts}</p>
              <Button asChild>
                <Link href="/admin">
                  {tr.blog.createFirst}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.slug} as="article" className="group hover:border-primary/50 transition-all flex flex-col h-full [box-shadow:var(--shadow-md)] hover:[box-shadow:var(--shadow-lg)]">
                <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                  <CardHeader className="flex-1">
                    <time className="text-xs text-muted-foreground mb-2 block" dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString('sv-SE', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </time>
                    <CardTitle as="h2" className="group-hover:text-primary transition-colors text-xl mb-3">
                      {post.title}
                    </CardTitle>
                    {post.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border border-primary/20 bg-primary/5 text-sm text-primary group-hover:bg-primary/10 group-hover:border-primary/40 transition-all">
                      {tr.blog.readMore}
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </span>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
    </PageContainer>
  );
}
