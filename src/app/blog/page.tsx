import Link from 'next/link';
import { db } from '@/lib/db';

// Revalidera var 60:e sekund (ISR)
export const revalidate = 60;
// Force dynamic rendering (skippa pre-render under build)
export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  // Hämta posts från databasen (snabbt!)
  const posts = await db
    .selectFrom('posts')
    .selectAll()
    .orderBy('date', 'desc')
    .execute();

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Min blogg</h1>
          <Link 
            href="/admin"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Nytt inlägg
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-center border border-gray-700">
            <p className="text-gray-300 mb-4">Inga blogginlägg än.</p>
            <Link 
              href="/admin"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Skapa ditt första inlägg →
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article 
                key={post.slug}
                className="bg-gray-800 rounded-lg shadow-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
              >
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="text-2xl font-bold mb-2 text-white hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-400 text-sm mb-3">
                    {new Date(post.date).toLocaleDateString('sv-SE', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {post.excerpt && (
                    <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  )}
                  <span className="text-blue-400 hover:text-blue-300 hover:underline">
                    Läs mer →
                  </span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
