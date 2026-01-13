'use client';

import { ReactNode } from 'react';
import Button from './ui/Button';

interface MarkdownToolbarProps {
  onInsert: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}

interface ButtonConfig {
  label: string;
  icon: ReactNode;
  before: string;
  after?: string;
  placeholder?: string;
}

const BUTTON_CONFIGS: ButtonConfig[] = [
  {
    label: 'H1',
    icon: <span className="font-bold text-lg">H1</span>,
    before: '# ',
    placeholder: 'Rubrik',
  },
  {
    label: 'H2',
    icon: <span className="font-bold">H2</span>,
    before: '## ',
    placeholder: 'Underrubrik',
  },
  {
    label: 'H3',
    icon: <span className="font-bold text-sm">H3</span>,
    before: '### ',
    placeholder: 'Rubrik 3',
  },
  {
    label: 'Fet',
    icon: <span className="font-bold">B</span>,
    before: '**',
    after: '**',
    placeholder: 'fet text',
  },
  {
    label: 'Kursiv',
    icon: <span className="italic">I</span>,
    before: '*',
    after: '*',
    placeholder: 'kursiv text',
  },
  {
    label: 'Kod',
    icon: <span className="font-mono text-sm">{`</>`}</span>,
    before: '`',
    after: '`',
    placeholder: 'kod',
  },
  {
    label: 'Kodblock',
    icon: <span className="font-mono text-xs">{`{}`}</span>,
    before: '```javascript\n',
    after: '\n```',
    placeholder: 'din kod här',
  },
  {
    label: 'Lista',
    icon: <span>☰</span>,
    before: '- ',
    placeholder: 'listpunkt',
  },
  {
    label: 'Numrerad lista',
    icon: <span className="text-sm">1.</span>,
    before: '1. ',
    placeholder: 'listpunkt',
  },
  {
    label: 'Länk',
    icon: <span>🔗</span>,
    before: '[',
    after: '](url)',
    placeholder: 'länktext',
  },
  {
    label: 'Citat',
    icon: <span className="text-lg">&quot;</span>,
    before: '> ',
    placeholder: 'citat',
  },
];

export default function MarkdownToolbar({ onInsert, textareaRef }: MarkdownToolbarProps) {
  const handleClick = (config: ButtonConfig) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const textToInsert = selectedText || config.placeholder || '';
    
    const newText = config.before + textToInsert + (config.after || '');
    const newValue = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    onInsert(newValue);
    
    // Återställ focus och selection
    setTimeout(() => {
      textarea.focus();
      if (selectedText) {
        textarea.setSelectionRange(start, start + newText.length);
      } else {
        textarea.setSelectionRange(
          start + config.before.length, 
          start + config.before.length + (config.placeholder?.length || 0)
        );
      }
    }, 0);
  };

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-750 border-b border-gray-600 rounded-t-lg">
      {BUTTON_CONFIGS.map((config) => (
        <Button
          key={config.label}
          type="button"
          onClick={() => handleClick(config)}
          variant="secondary"
          size="sm"
          className="min-w-[2.5rem] flex items-center justify-center"
          title={config.label}
        >
          {config.icon}
        </Button>
      ))}
    </div>
  );
}
