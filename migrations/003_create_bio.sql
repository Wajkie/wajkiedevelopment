-- Add bio table to store editable bio data
CREATE TABLE IF NOT EXISTS bio (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  short_pitch TEXT NOT NULL,
  about_paragraphs JSONB NOT NULL,
  contact_email TEXT NOT NULL,
  contact_github TEXT NOT NULL,
  contact_linkedin TEXT NOT NULL,
  skills_frontend JSONB NOT NULL,
  skills_backend JSONB NOT NULL,
  skills_tools JSONB NOT NULL,
  values JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default bio data
INSERT INTO bio (
  id,
  name,
  tagline,
  short_pitch,
  about_paragraphs,
  contact_email,
  contact_github,
  contact_linkedin,
  skills_frontend,
  skills_backend,
  skills_tools,
  values
) VALUES (
  1,
  'Fredrik Wiking',
  'Fullstack Developer & Open Source Enthusiast',
  'Jag bygger moderna webbapplikationer med fokus på användarvänlighet, prestanda och ren kod.',
  '["Hej! Jag är en passionerad utvecklare som älskar att skapa lösningar som gör skillnad. Med en stark grund i både frontend och backend skapar jag kompletta applikationer från ide till produktion.", "Mitt fokus ligger på att skriva ren, underhållbar kod och att alltid lära mig nya teknologier. Jag tror på att dela med sig av kunskap genom open source och tekniska blogginlägg.", "När jag inte kodar hittar du mig antingen i naturen eller experimenterande med nya verktyg och ramverk."]',
  'wikingfredrik@gmail.com',
  'https://github.com/wajkie',
  'https://linkedin.com/in/fredrik-wiking',
  '[{"name":"React","icon":"⚛️","color":"blue"},{"name":"Next.js","icon":"▲","color":"slate"},{"name":"TypeScript","icon":"TS","color":"blue"},{"name":"Tailwind CSS","icon":"💨","color":"cyan"},{"name":"HTML/CSS","icon":"🎨","color":"orange"}]',
  '[{"name":"Node.js","icon":"🟢","color":"green"},{"name":"PostgreSQL","icon":"🐘","color":"blue"},{"name":"Kysely","icon":"🔍","color":"purple"},{"name":"REST APIs","icon":"🔌","color":"indigo"},{"name":"GraphQL","icon":"◈","color":"pink"}]',
  '[{"name":"Git","icon":"📦","color":"orange"},{"name":"Docker","icon":"🐳","color":"blue"},{"name":"VS Code","icon":"💻","color":"blue"},{"name":"Vercel","icon":"▲","color":"slate"},{"name":"npm","icon":"📦","color":"red"}]',
  '[{"title":"Clean Code","description":"Läsbar, underhållbar kod som andra utvecklare förstår","icon":"✨"},{"title":"Accessibility","description":"Webb för alla - WCAG 2.1 AA-standard i fokus","icon":"♿"},{"title":"Performance","description":"Snabba laddningstider och optimerad användarupplevelse","icon":"⚡"},{"title":"Continuous Learning","description":"Alltid nyfiken på nya teknologier och best practices","icon":"📚"}]'
) ON CONFLICT (id) DO NOTHING;
