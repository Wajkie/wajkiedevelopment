import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostFromGitHub } from '@/lib/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import 'highlight.js/styles/github-dark.css';

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
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <article className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-xl p-8 border border-gray-700">
        <Link 
          href="/blog"
          className="text-blue-400 hover:text-blue-300 hover:underline mb-4 inline-block"
        >
          ← Tillbaka till bloggen
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3 text-white">{post.title}</h1>
          <p className="text-gray-400">
            {new Date(post.date).toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-gray-300 prose-a:text-blue-400 prose-strong:text-white prose-code:text-blue-400 prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-700">
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
        </div>
      </article>
    </div>
  );
}
