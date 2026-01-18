'use client';

import Button from '@/components/ui/Button';

interface MarkdownGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GuideSection {
  title: string;
  items: { syntax: string; description: string; example?: string }[];
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: 'Rubriker',
    items: [
      { syntax: '# Rubrik 1', description: 'Största rubriken' },
      { syntax: '## Rubrik 2', description: 'Underrubrik' },
      { syntax: '### Rubrik 3', description: 'Mindre rubrik' },
    ],
  },
  {
    title: 'Textformatering',
    items: [
      { syntax: '**fet text**', description: 'Fet text', example: 'fet text' },
      { syntax: '*kursiv text*', description: 'Kursiv text', example: 'kursiv text' },
      { syntax: '~~struken text~~', description: 'Struken text', example: 'struken text' },
      { syntax: '`inline kod`', description: 'Inline kod', example: 'inline kod' },
    ],
  },
  {
    title: 'Listor',
    items: [
      { syntax: '- Punkt 1\n- Punkt 2', description: 'Punktlista' },
      { syntax: '1. Första\n2. Andra', description: 'Numrerad lista' },
    ],
  },
  {
    title: 'Länkar och Bilder',
    items: [
      { syntax: '[länktext](https://...)', description: 'Länk' },
      { syntax: '![alt text](https://...)', description: 'Bild' },
    ],
  },
  {
    title: 'Kodblock',
    items: [
      { syntax: '```javascript\ncode här\n```', description: 'Kodblock med syntax highlighting' },
    ],
  },
  {
    title: 'Övrigt',
    items: [
      { syntax: '> Citat', description: 'Blockquote' },
      { syntax: '---', description: 'Horisontell linje' },
    ],
  },
];

export default function MarkdownGuide({ isOpen, onClose }: MarkdownGuideProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-title"
    >
      <div 
        className="bg-card border rounded-lg max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 id="guide-title" className="text-2xl font-semibold tracking-tight">Markdown Guide</h3>
          <button
            onClick={onClose}
            className="rounded-md p-2 hover:bg-accent transition-colors"
            aria-label="Stäng guide"
            type="button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {GUIDE_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-3">{section.title}</h4>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div 
                    key={idx}
                    className="bg-muted/50 rounded-md p-3 border border-border/50"
                  >
                    <code className="text-sm font-mono text-primary block whitespace-pre">
                      {item.syntax}
                    </code>
                    <p className="text-xs text-muted-foreground mt-1">
                      → {item.description}
                      {item.example && (
                        <span className="ml-2">
                          {item.example === 'inline kod' ? (
                            <code className="bg-accent px-1.5 py-0.5 rounded text-xs">{item.example}</code>
                          ) : item.example === 'fet text' ? (
                            <strong>{item.example}</strong>
                          ) : item.example === 'kursiv text' ? (
                            <em>{item.example}</em>
                          ) : item.example === 'struken text' ? (
                            <del>{item.example}</del>
                          ) : null}
                        </span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            onClick={onClose}
            variant="default"
            className="w-full"
          >
            Stäng
          </Button>
        </div>
      </div>
    </div>
  );
}
