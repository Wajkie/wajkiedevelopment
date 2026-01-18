import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/cn';

const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border-2 border-input bg-background/50 backdrop-blur-sm px-3 py-2 text-sm my-1',
          'placeholder:text-muted-foreground',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[box-shadow:var(--shadow-sm)]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
