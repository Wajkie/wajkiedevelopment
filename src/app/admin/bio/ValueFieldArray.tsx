'use client';

import { UseFormRegister, FieldArrayWithId } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui';
import type { BioFormData } from './types';

type ValueFieldArrayProps = {
  fields: FieldArrayWithId[];
  register: UseFormRegister<BioFormData>;
  onAdd: () => void;
  onRemove: (index: number) => void;
};

export const ValueFieldArray = ({ 
  fields, 
  register, 
  onAdd, 
  onRemove 
}: ValueFieldArrayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">Vad driver dig som utvecklare?</p>
        <Button
          type="button"
          onClick={onAdd}
          variant="secondary"
          size="sm"
        >
          + Lägg till värdering
        </Button>
      </div>
      
      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="space-y-2 p-4 border border-border rounded-lg">
            <div className="grid grid-cols-[1fr,80px,auto] gap-2">
              <Input
                placeholder="Titel (t.ex. Clean Code)"
                {...register(`values.${index}.title` as const, { required: true })}
              />
              <Input
                placeholder="Emoji"
                {...register(`values.${index}.icon` as const, { required: true })}
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
            <Textarea
              placeholder="Beskrivning av värdering"
              rows={2}
              {...register(`values.${index}.description` as const, { required: true })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
