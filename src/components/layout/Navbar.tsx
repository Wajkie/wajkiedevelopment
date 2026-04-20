import Link from 'next/link';
import NavLinks from './NavLinks';

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'wajkie';
const NPM_USERNAME = process.env.NPM_USERNAME || GITHUB_OWNER;

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border"
      aria-label="Huvudnavigation"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Logo/Name */}
          <Link
            href="/"
            className="text-lg sm:text-xl font-bold hover:text-primary transition-colors"
            aria-label="Hem - Wajkie"
          >
            Wajkie
          </Link>

          <NavLinks githubOwner={GITHUB_OWNER} npmUsername={NPM_USERNAME} />
        </div>
      </div>
    </nav>
  );
}
