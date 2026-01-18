import Link from 'next/link';
import Button from '@/components/ui/Button';

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'wajkie';
const NPM_USERNAME = process.env.NPM_USERNAME || GITHUB_OWNER;

export default function Navbar() {
  return (
    <nav 
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
      aria-label="Huvudnavigation"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <Link 
            href="/" 
            className="text-xl font-bold hover:text-primary transition-colors"
            aria-label="Hem - Wajkie"
          >
            Wajkie
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2" role="navigation" aria-label="Sidnavigering">
            <Button asChild variant="ghost" size="sm">
              <Link href="/about">Om mig</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/journey">Utbildning</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/projects">Projekt</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/packages">Paket</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/blog">Blogg</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/project-info">Tech</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/analytics">Analytics</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a 
                href={`https://github.com/${GITHUB_OWNER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profil (öppnas i ny flik)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <a 
                href={`https://www.npmjs.com/~${NPM_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NPM profil (öppnas i ny flik)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
                </svg>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
