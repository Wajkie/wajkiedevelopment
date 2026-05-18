export const projectInfo = {
  name: 'Portfolio & Blog Platform',
  description: 'A modern full-stack web application built with Next.js, TypeScript, and PostgreSQL. The platform combines a personal portfolio with blog functionality, project management, analytics, and dynamic content.',
  repository: 'https://github.com/Wajkie/wajkiedevelopment',
  
  features: [
    {
      category: 'Content Management',
      icon: '📝',
      items: [
        { name: 'Markdown Blog with GitHub CMS', description: 'Write and publish blog posts in markdown with GitHub as version-controlled backend' },
        { name: 'ISR (60s)', description: 'Incremental Static Regeneration for fresh content without rebuilds' },
        { name: 'Dynamic Bio & Journey', description: 'Editable bio and timeline via admin panel with real-time updates' },
        { name: 'Project Showcase', description: 'Automatic GitHub repository import with CI/CD deployment status' },
        { name: 'NPM Package Integration', description: 'Live download stats and quality metrics from NPM Registry API' },
      ],
    },
    {
      category: 'Analytics & Tracking',
      icon: '📊',
      items: [
        { name: 'Privacy-First Analytics', description: 'SHA-256 IP hashing, no cookies, GDPR-compliant visitor tracking' },
        { name: 'Token-Based API Auth', description: 'Bcrypt hashed tokens with rate limiting per project' },
        { name: 'Action Tracking', description: 'Track visits, clicks, scrolls, downloads, and shares' },
        { name: 'Real-Time Dashboard', description: 'Live stats with auto-refresh (30s polling) and admin filtering' },
        { name: 'Public Stats Widget', description: 'Visitor-facing metrics (total visits, unique visitors, popular pages)' },
      ],
    },
    {
      category: 'Developer Experience',
      icon: '🛠️',
      items: [
        { name: 'TypeScript (99.82%)', description: 'Full type-safety with strict mode across entire stack' },
        { name: 'Kysely ORM', description: 'Type-safe SQL query builder with CamelCase plugin' },
        { name: 'Server Actions', description: 'RPC-style functions replacing 9 API routes for cleaner code' },
        { name: 'Path Aliases', description: '@/types, @/components, @/lib, @/actions for clean imports' },
        { name: 'Hot Reload', description: 'Turbopack for instant feedback during development' },
      ],
    },
    {
      category: 'Performance',
      icon: '⚡',
      items: [
        { name: 'SSR & ISR', description: 'Server-side rendering with 60s incremental static regeneration' },
        { name: 'Parallel Queries', description: 'Promise.all for concurrent data fetching (~50ms response time)' },
        { name: 'Smart Caching', description: 'Database query optimization with proper indexing' },
        { name: 'Code Splitting', description: 'Dynamic imports for reduced initial bundle size' },
        { name: 'Database Pooling', description: 'Connection pooling with max 10 concurrent connections' },
      ],
    },
    {
      category: 'Security & Auth',
      icon: '🔒',
      items: [
        { name: 'TOTP 2FA', description: 'Two-factor authentication with Google Authenticator (otplib)' },
        { name: 'Iron Session', description: 'Encrypted, stateless sessions with rotation' },
        { name: 'Protected Routes', description: 'Server-side authentication guards for admin pages' },
        { name: 'IP Hashing (SHA-256)', description: 'Privacy-preserving visitor tracking without storing PII' },
        { name: 'Rate Limiting', description: 'Configurable per-token limits to prevent API abuse' },
      ],
    },
    {
      category: 'UI & UX',
      icon: '🎨',
      items: [
        { name: 'Liquid Glass Design', description: 'Glassmorphism with backdrop-blur and muted okLCH color palette' },
        { name: '6-Level Shadow System', description: 'Depth through shadows instead of color saturation' },
        { name: 'Accessibility (WCAG AA)', description: '0 WAVE alerts, semantic HTML, ARIA labels, keyboard nav' },
        { name: 'Smooth Animations', description: '1s CSS transitions with prefers-reduced-motion support' },
        { name: 'Responsive Design', description: 'Mobile-first approach tested across all breakpoints' },
        { name: 'Bilingual (SV / EN)', description: 'Full locale system with cookie + localStorage persistence, SSR-safe hydration, and compile-time key enforcement' },
      ],
    },
  ],

  techStack: {
    frontend: [
      { name: 'Next.js 16', version: '16.1.1', description: 'React framework with App Router and Server Actions' },
      { name: 'React 19', version: '19.0.0', description: 'UI library with latest features' },
      { name: 'TypeScript', version: '5.7.2', description: 'Type-safe JavaScript (99.82% coverage)' },
      { name: 'Tailwind CSS v4', version: '4.0.0-alpha', description: 'Utility-first CSS with okLCH color space' },
    ],
    backend: [
      { name: 'Server Actions', description: 'RPC-style functions replacing REST API routes' },
      { name: 'Kysely', version: '0.27.4', description: 'Type-safe SQL query builder with CamelCase plugin' },
      { name: 'PostgreSQL (Neon)', description: 'Serverless Postgres with connection pooling' },
      { name: 'Iron Session', version: '8.0.3', description: 'Encrypted stateless session management' },
      { name: 'bcryptjs', version: '2.4.3', description: 'Secure password and token hashing' },
    ],
    integrations: [
      { name: 'Octokit', version: '4.0.2', description: 'GitHub API client for repo and content management' },
      { name: 'NPM Registry API', description: 'Package stats and metadata fetching' },
      { name: 'otplib', version: '12.0.1', description: 'TOTP generation and validation for 2FA' },
      { name: 'GitHub Webhooks', description: 'Post-publish triggers for database sync' },
    ],
    devTools: [
      { name: 'Turbopack', description: 'Next-gen bundler for fast development' },
      { name: 'ESLint', description: 'Code linting and quality checks' },
      { name: 'dotenvx', description: 'Environment variable management' },
      { name: 'tsx', description: 'TypeScript execution for scripts' },
    ],
  },

  architecture: {
    description: 'The project follows a modern Next.js App Router architecture with separation of concerns, type-safety, and modular design enabling easy feature extraction.',
    layers: [
      {
        name: 'Presentation Layer',
        path: 'src/app/',
        description: 'React Server Components, Client Components, and file-based routing',
        tech: ['RSC', 'App Router', 'Layouts', 'Loading States', 'Error Boundaries'],
      },
      {
        name: 'Action Layer',
        path: 'src/lib/actions/',
        description: 'Server Actions organized by domain (auth, posts, analytics, journey, bio, projects)',
        tech: ['Server Actions', 'Type-safe RPC', 'Isolated features', 'Revalidation'],
      },
      {
        name: 'Data Layer',
        path: 'src/lib/',
        description: 'Database interaction and external API calls with connection pooling',
        tech: ['Kysely', 'Type-safe queries', 'PostgreSQL', 'GitHub API', 'NPM API'],
      },
      {
        name: 'Component Layer',
        path: 'src/components/',
        description: 'Reusable UI components organized by domain (layout, blog, forms, common, projects, bio, npm, ui)',
        tech: ['Atomic Design', 'Barrel Exports', 'Props Typing', 'Client/Server Split'],
      },
    ],
  },
};
