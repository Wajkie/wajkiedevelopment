import { useLocalStorageDraft } from './useLocalStorageDraft';

type UseDraftManagerProps = {
  draftKey: string;
  clearDraft: () => void;
};

export function useDraftManager({ draftKey, clearDraft }: UseDraftManagerProps) {
  const handleClearDraft = () => {
    if (confirm('Är du säker på att du vill ta bort ditt utkast?')) {
      clearDraft();
      window.location.reload();
    }
  };

  return { handleClearDraft };
}
