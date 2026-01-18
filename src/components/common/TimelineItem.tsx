import type { JourneyEntry } from '@/types';
import Image from 'next/image';

type Props = {
  entry: JourneyEntry;
  isLeft: boolean;
};

export const TimelineItem = ({ entry, isLeft }: Props) => {
  return (
    <div className={`flex gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
      {/* Content */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
        <div className="inline-block bg-card border border-border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center gap-2 justify-between mb-2">
              <span className="text-sm text-muted-foreground">{entry.period}</span>
              {entry.result && (
                <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded">
                  {entry.result}
                </span>
              )}
            </div>
            <h3 className="text-2xl font-bold mb-1">{entry.title}</h3>
            <time className="text-sm text-muted-foreground">{entry.date}</time>
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-4">{entry.description}</p>

          {/* Images */}
          {entry.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {entry.images.slice(0, 4).map((image, idx) => (
                <div key={idx} className="relative aspect-video rounded overflow-hidden">
                  <Image
                    src={image}
                    alt={`${entry.title} screenshot ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Learnings */}
          {entry.learnings.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold mb-2">💡 Lärdomar:</h4>
              <ul className="space-y-1">
                {entry.learnings.map((learning, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    • {learning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {entry.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-muted text-xs rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Links */}
          {entry.links.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {entry.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  🔗 {link.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-background border-2 border-primary" />
        <div className="w-0.5 h-full bg-border" />
      </div>

      {/* Spacer */}
      <div className="flex-1" />
    </div>
  );
};
