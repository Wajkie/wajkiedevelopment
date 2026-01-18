import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostFromGitHub } from '@/lib/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui';
import { Button } from '@/components/ui';
import { ScrollToTopButton } from '@/components/layout';

interface Props {
  params: Promise<{ slug: string }>;
}

// Revalidera var 60:e sekund (ISR)
export const revalidate = 60;
// Force dynamic rendering (skippa pre-render under build)
export const dynamic = 'force-dynamic';

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostFromGitHub(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen py-12 px-4">
      <Card as="article" className="max-w-3xl mx-auto">
        <CardHeader>
          <Button asChild variant="ghost" size="sm" className="mb-4 -ml-3">
            <Link href="/blog">
              ← Tillbaka till bloggen
            </Link>
          </Button>

          <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
          <time className="text-muted-foreground" dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </CardHeader>

        <CardContent className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-foreground prose-headings:font-bold
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-5
          prose-p:text-foreground/80 prose-p:leading-relaxed prose-p:mb-4
          prose-a:text-primary prose-a:hover:text-accent prose-a:underline prose-a:underline-offset-2
          prose-strong:text-foreground prose-strong:font-semibold
          prose-em:text-foreground/90 prose-em:italic
          prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-background prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-2
          prose-li:text-foreground/80 prose-li:my-1 prose-li:leading-relaxed
          prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-foreground/70
          prose-hr:border-border prose-hr:my-8
          prose-table:border-collapse prose-table:w-full
          prose-th:border prose-th:border-border prose-th:bg-muted prose-th:p-2 prose-th:text-left
          prose-td:border prose-td:border-border prose-td:p-2
        ">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeHighlight,
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: 'wrap' }]
            ]}
          >
            {post.content}
          </ReactMarkdown>
        </CardContent>

        <CardFooter className="flex justify-between pt-8 border-t border-border">
          <Button asChild variant="outline" size="sm">
            <Link href="/blog">
              ← Tillbaka till bloggen
            </Link>
          </Button>
          <ScrollToTopButton />
        </CardFooter>
      </Card>
    </main>
  );
}
