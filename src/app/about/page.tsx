import { PageContainer } from '@/components/layout';
import { SkillCard } from '@/components/bio/SkillCard';
import { ValueCard } from '@/components/bio/ValueCard';
import { Button } from '@/components/ui';
import { getBio } from '@/lib/actions/bio';
import { getTranslations } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Om mig | Portfolio',
  description: 'Lär känna mig och mina färdigheter',
};

export const revalidate = 300;

export default async function AboutPage() {
  const tr = await getTranslations();

  let bioData;
  try {
    bioData = await getBio();
  } catch {
    return (
      <PageContainer maxWidth="6xl">
        <div className="text-center py-12">
          <p className="text-muted-foreground">{tr.about.missingBio}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="6xl">
      {/* Hero Section */}
      <div className="text-center mb-16 space-y-6 animate-fade-in">
        <div className="inline-block">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl py-5 font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent animate-gradient">
            {bioData.name}
          </h1>
        </div>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium">
          {bioData.tagline}
        </p>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {bioData.shortPitch}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Button asChild>
            <a href={`mailto:${bioData.contactEmail}`}>
              {tr.about.contact}
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={bioData.contactGithub} target="_blank" rel="noopener noreferrer">
              {tr.about.githubLink}
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={bioData.contactLinkedin} target="_blank" rel="noopener noreferrer">
              {tr.about.linkedinLink}
            </a>
          </Button>
        </div>
      </div>

      {/* About Section */}
      <section className="mb-20 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <h2 className="text-3xl font-bold mb-8 text-center">{tr.about.title}</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          {bioData.aboutParagraphs.map((paragraph, index) => (
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
          {tr.about.skillsTitle}
        </h2>

        <div className="space-y-12">
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              {tr.about.frontend}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bioData.skillsFrontend.map((skill, index) => (
                <SkillCard key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">⚙️</span>
              {tr.about.backend}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bioData.skillsBackend.map((skill, index) => (
                <SkillCard key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-2xl">🛠️</span>
              {tr.about.tools}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {bioData.skillsTools.map((skill, index) => (
                <SkillCard key={skill.name} {...skill} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-12 text-center animate-fade-in-up">
          {tr.about.valuesTitle}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {bioData.values.map((value, index) => (
            <ValueCard key={value.title} {...value} index={index} />
          ))}
        </div>
      </section>
    </PageContainer>
  );
}
