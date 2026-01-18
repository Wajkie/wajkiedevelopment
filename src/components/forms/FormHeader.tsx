'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui';

type FormHeaderProps = {
  isSubmitting: boolean;
  submitText: string;
  submittingText: string;
  onClearDraft: () => void;
  message?: string;
  extraActions?: React.ReactNode;
};

export function FormHeader({
  isSubmitting,
  submitText,
  submittingText,
  onClearDraft,
  message,
  extraActions,
}: FormHeaderProps) {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b border-border z-10 rounded-lg">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          onClick={() => router.push('/admin')}
          variant="outline"
          size="sm"
        >
          ← Dashboard
        </Button>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingText : submitText}
        </Button>
        
        {extraActions}
        
        <Button type="button" onClick={onClearDraft} variant="ghost" size="sm">
          Återställ utkast
        </Button>

        {message && (
          <p className="text-green-600">
            {message}
          </p>
        )}
      </div>

      <span className="text-sm text-muted-foreground">
        💾 Sparas automatiskt lokalt
      </span>
    </div>
  );
}
