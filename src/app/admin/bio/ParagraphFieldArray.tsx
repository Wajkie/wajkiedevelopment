'use client';

import { UseFormRegister, FieldArrayWithId } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Textarea } from '@/components/ui';
import type { BioFormData } from './types';

type ParagraphFieldArrayProps = {
  fields: FieldArrayWithId[];
  register: UseFormRegister<BioFormData>;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export const ParagraphFieldArray = ({ 
  fields, 
  register, 
  onAdd, 
  onRemove 
}: ParagraphFieldArrayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Lägg till stycken om dig själv</p>
        <Button
          type="button"
          onClick={onAdd}
          variant="secondary"
          size="sm"
        >
          + Lägg till stycke
        </Button>
      </div>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Textarea
              rows={3}
              placeholder={`Stycke ${index + 1}`}
              {...register(`aboutParagraphs.${index}.text` as const, { required: 'Stycke krävs' })}
            />
            <Button
              type="button"
              onClick={() => onRemove(index)}
              variant="ghost"
              size="sm"
            >
              🗑️
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
