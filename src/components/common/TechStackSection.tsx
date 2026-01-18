type Tech = {
  name: string;
  version?: string;
  description: string;
};

type TechStackSectionProps = {
  icon: string;
  title: string;
  items: Tech[];
  bulletColor: string;
};

export const TechStackSection = ({ icon, title, items, bulletColor }: TechStackSectionProps) => {
  return (
    <div className="border border-border rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span>
        <span>{title}</span>
      </h3>
      <ul className="space-y-2">
        {items.map((tech) => (
          <li key={tech.name} className="flex items-start gap-2">
            <span className={bulletColor}>▸</span>
            <div>
              <span className="font-medium">{tech.name}</span>
              {tech.version && <span className="text-sm text-muted-foreground ml-2">v{tech.version}</span>}
              <p className="text-sm text-muted-foreground">{tech.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
