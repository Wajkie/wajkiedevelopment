'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/about', label: 'Om mig' },
  { href: '/journey', label: 'Utbildning' },
  { href: '/projects', label: 'Projekt' },
  { href: '/packages', label: 'Paket' },
  { href: '/blog', label: 'Blogg' },
  { href: '/project-info', label: 'Tech' },
  { href: '/admin/analytics', label: 'Analytics' },
];

type Props = {
  githubOwner: string;
  npmUsername: string;
};

export default function NavLinks({ githubOwner, npmUsername }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const externalLinks = (
    <>
      <Button asChild variant="ghost" size="sm">
        <a
          href={`https://github.com/${githubOwner}`}
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
          href={`https://www.npmjs.com/~${npmUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="NPM profil (öppnas i ny flik)"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
          </svg>
        </a>
      </Button>
    </>
  );

  return (
    <>
      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-2" role="navigation" aria-label="Sidnavigering">
        {navLinks.map(({ href, label }) => (
          <Button key={href} asChild variant="ghost" size="sm">
            <Link href={href}>{label}</Link>
          </Button>
        ))}
        {externalLinks}
      </div>

      {/* Mobile hamburger button */}
      <button
        className="md:hidden flex items-center justify-center w-11 h-11 rounded-md hover:bg-muted transition-colors"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Stäng meny' : 'Öppna meny'}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile dropdown menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg z-50"
          role="navigation"
          aria-label="Mobilnavigering"
        >
          <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Button key={href} asChild variant="ghost" className="justify-start h-11">
                <Link href={href} onClick={close}>{label}</Link>
              </Button>
            ))}
            <div className="flex gap-2 pt-2 border-t border-border mt-1">
              <Button asChild variant="ghost" size="sm">
                <a
                  href={`https://github.com/${githubOwner}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profil (öppnas i ny flik)"
                  onClick={close}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </Button>
              <Button asChild variant="ghost" size="sm">
                <a
                  href={`https://www.npmjs.com/~${npmUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="NPM profil (öppnas i ny flik)"
                  onClick={close}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
                  </svg>
                  NPM
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
