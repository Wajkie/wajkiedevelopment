import { CamelCasePlugin, Generated, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

// Database schema types (använd camelCase i TypeScript)
export interface Database {
  posts: PostTable;
  projects: ProjectTable;
  bio: BioTable;
  journeyEntries: JourneyEntryTable;
  apiTokens: ApiTokenTable;
  pageVisits: PageVisitTable;
  testimonials: TestimonialTable;
}

export interface PostTable {
  id: Generated<number>;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ProjectTable {
  id: Generated<number>;
  repoId: number;
  name: string;
  description: string | null;
  url: string;
  homepage: string | null;
  language: string | null;
  stars: number;
  topics: string[]; // JSONB array
  hasWorkflows: boolean;
  lastCommit: Date;
  deploymentUrl: string | null;
  orderIndex: number;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface Skill {
  name: string;
  icon: string;
  color: string;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface BioTable {
  id: Generated<number>;
  name: string;
  tagline: string;
  shortPitch: string;
  aboutParagraphs: string[]; // JSONB array
  contactEmail: string;
  contactGithub: string;
  contactLinkedin: string;
  skillsFrontend: Skill[]; // JSONB array
  skillsBackend: Skill[]; // JSONB array
  skillsTools: Skill[]; // JSONB array
  values: Value[]; // JSONB array
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface JourneyLink {
  title: string;
  url: string;
}

export interface JourneyEntryTable {
  id: Generated<number>;
  title: string;
  description: string;
  date: string; // "2024-01" or "2024-01-15"
  period: string; // "Year 1 - Web Development"
  images: string[]; // JSONB array of image paths
  learnings: string[]; // JSONB array of learning strings
  result: string | null; // Grade or completion status
  tags: string[]; // JSONB array
  links: JourneyLink[]; // JSONB array
  orderIndex: number;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

export interface ApiTokenTable {
  id: Generated<number>;
  name: string;
  tokenHash: string;
  allowedDomains: string[]; // JSONB array
  rateLimit: number;
  createdAt: Generated<Date>;
  lastUsedAt: Date | null;
}

export interface PageVisitTable {
  id: Generated<number>;
  tokenId: number;
  action: string;
  pagePath: string | null;
  ipHash: string;
  timestamp: Generated<Date>;
}

export interface TestimonialTable {
  id: Generated<number>;
  nameHash: string;
  emailHash: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  emailConsent: boolean;
  thankYouSent: boolean;
  approvedAt: Date | null;
  createdAt: Generated<Date>;
  updatedAt: Generated<Date>;
}

// Skapa Kysely instance med CamelCasePlugin
const createDialect = () => {
  const dbUrl = process.env.DATABASE_URL || '';
  
  // Neon kräver alltid SSL
  return new PostgresDialect({
    pool: new Pool({
      connectionString: dbUrl.split('?')[0],
      max: 10,
      ssl: { rejectUnauthorized: false },
    }),
  });
};

const dialect = createDialect();

export const db = new Kysely<Database>({
  dialect,
  plugins: [new CamelCasePlugin()],
});
