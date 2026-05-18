import { projectInfo } from '@/constants/project-info';
import { PageContainer, PageHeader } from '@/components/layout';
import { TechStackSection } from '@/components/common';
import type { Metadata } from 'next';
import { getTranslations } from '@/lib/i18n/server';

export const metadata: Metadata = {
  title: 'Project Info | Portfolio',
  description: 'Teknisk information om hur denna portfolio är byggd',
};

export default async function ProjectInfoPage() {
  const tr = await getTranslations();

  return (
    <PageContainer maxWidth="6xl">
      <PageHeader
        title={tr.projectInfo.title}
        description={tr.projectInfo.description}
      />

      {/* Hero Section */}
      <div className="mb-12 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-border rounded-lg">
        <h2 className="text-2xl font-bold mb-3">{projectInfo.name}</h2>
        <p className="text-muted-foreground mb-4">{projectInfo.description}</p>
        <a
          href={projectInfo.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <span>📦</span>
          <span>{tr.projectInfo.viewOnGithub}</span>
        </a>
      </div>

      {/* Features */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{tr.projectInfo.features}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projectInfo.features.map((feature) => (
            <div key={feature.category} className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-xl font-semibold">{feature.category}</h3>
              </div>
              <ul className="space-y-3">
                {feature.items.map((item) => (
                  <li key={item.name}>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.description}</div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{tr.projectInfo.techStack}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <TechStackSection
            icon="⚛️"
            title={tr.projectInfo.frontend}
            items={projectInfo.techStack.frontend}
            bulletColor="text-blue-600"
          />
          <TechStackSection
            icon="🔧"
            title={tr.projectInfo.backend}
            items={projectInfo.techStack.backend}
            bulletColor="text-green-600"
          />
          <TechStackSection
            icon="🔌"
            title={tr.projectInfo.integrations}
            items={projectInfo.techStack.integrations}
            bulletColor="text-purple-600"
          />
          <TechStackSection
            icon="🛠️"
            title={tr.projectInfo.devTools}
            items={projectInfo.techStack.devTools}
            bulletColor="text-orange-600"
          />
        </div>
      </section>

      {/* Architecture */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6">{tr.projectInfo.architecture}</h2>
        <p className="text-muted-foreground mb-6">{projectInfo.architecture.description}</p>

        <div className="space-y-4">
          {projectInfo.architecture.layers.map((layer, index) => (
            <div
              key={layer.name}
              className="border border-border rounded-lg p-6 hover:border-primary/50 transition-colors max-sm:!ml-0"
              style={{ marginLeft: `${index * 20}px` }}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold">{layer.name}</h3>
                <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                  {layer.path}
                </code>
              </div>
              <p className="text-muted-foreground mb-3">{layer.description}</p>
              <div className="flex flex-wrap gap-2">
                {layer.tech.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <div className="text-center p-8 bg-muted/50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">{tr.projectInfo.interestedCta}</h3>
        <p className="text-muted-foreground mb-4">
          {tr.projectInfo.interestedDescription}
        </p>
        <a
          href={projectInfo.repository}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <span>🚀</span>
          <span>{tr.projectInfo.exploreRepo}</span>
        </a>
      </div>
    </PageContainer>
  );
}
