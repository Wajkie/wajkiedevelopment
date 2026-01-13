import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostFromGitHub } from '@/lib/github';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Props {
  params: Promise<{ slug: string }>;
}

// Revalidera var 60:e sekund (ISR)
export const revalidate = 60;

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await getPostFromGitHub(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
        <Link 
          href="/blog"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Tillbaka till bloggen
        </Link>

        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-3">{post.title}</h1>
          <p className="text-gray-500">
            {new Date(post.date).toLocaleDateString('sv-SE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
