import { PageContainer } from '@/components/layout';
import { SkillCard } from '@/components/bio/SkillCard';
import { ValueCard } from '@/components/bio/ValueCard';
import { db } from '@/lib/db';
import { Button } from '@/components/ui';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om mig | Portfolio',
  description: 'Lär känna mig och mina färdigheter',
};

// Revalidate every 5 minutes
export const revalidate = 300;

export default async function AboutPage() {
  // Hämta bio från databas
  const bioData = await db
    .selectFrom('bio')
    .selectAll()
    .executeTakeFirst();

  // Fallback till constants om DB är tom
  if (!bioData) {
    return (
      <PageContainer maxWidth="6xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Bio-data saknas. Vänligen logga in som admin för att lägga till.</p>
        </div>
      </PageContainer>
    );
  }

  const bio = {
    name: bioData.name,
    tagline: bioData.tagline,
    shortPitch: bioData.shortPitch,
    about: bioData.aboutParagraphs,
    contact: {
      email: bioData.contactEmail,
      github: bioData.contactGithub,
      linkedin: bioData.contactLinkedin,
    },
    skills: {
      frontend: bioData.skillsFrontend,
      backend: bioData.skillsBackend,
      tools: bioData.skillsTools,
    },
    values: bioData.values,
  };

  return (
    <PageContainer maxWidth="6xl">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6 animate-fade-in">
        <div className="inline-block">
          <h1 className="text-5xl md:text-6xl py-5 font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            {bio.name}
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          {bio.tagline}
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {bio.shortPitch}
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Button asChild>
            <a href={`mailto:${bio.contact.email}`}>
              📧 Kontakta mig
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={bio.contact.github} target="_blank" rel="noopener noreferrer">
              💻 GitHub
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={bio.contact.linkedin} target="_blank" rel="noopener noreferrer">
              🔗 LinkedIn
            </a>
          </Button>
        </div>
      </div>

      {/* About Section */}
      <section className="mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-3xl font-bold mb-8 text-center">Om mig</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {bio.about.map((paragraph, index) => (
            <p 
              key={index} 
              className="text-lg text-muted-foreground leading-relaxed animate-fade-in-up"
              style={{ animationDelay: `${400 + index * 100}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-12 text-center animate-fade-in-up">
          Färdigheter & Teknologier
        </h2>
        
        <div className="space-y-12">
          {/* Frontend */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              Frontend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bio.skills.frontend.map((skill, index) => (
                <SkillCard key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>

          {/* Backend */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              Backend
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bio.skills.backend.map((skill, index) => (
                <SkillCard key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              Tools & Workflow
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bio.skills.tools.map((skill, index) => (
                <SkillCard key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-12 text-center animate-fade-in-up">
          Vad jag värdesätter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bio.values.map((value, index) => (
            <ValueCard key={value.title} {...value} index={index} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
