'use client';

interface ValueCardProps {
  title: string;
  description: string;
  icon: string;
  index: number;
}

export const ValueCard = ({ title, description, icon, index }: ValueCardProps) => {
  return (
    <div
      className="
        group relative p-6 rounded-xl border border-border
        bg-gradient-to-br from-card to-card/50
        hover:border-primary/50 transition-all duration-300
        hover:shadow-xl hover:-translate-y-1
        animate-fade-in-up
      "
      style={{
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
