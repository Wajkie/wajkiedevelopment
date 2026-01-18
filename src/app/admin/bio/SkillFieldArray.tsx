'use client';

import { UseFormRegister, FieldArrayWithId } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import type { BioFormData } from './types';

type SkillFieldArrayProps = {
  fields: FieldArrayWithId[];
  register: UseFormRegister<BioFormData>;
  onAdd: () => void;
  onRemove: (index: number) => void;
  fieldName: 'skillsFrontend' | 'skillsBackend' | 'skillsTools';
  placeholder?: string;
};

export const SkillFieldArray = ({ 
  fields, 
  register, 
  onAdd, 
  onRemove, 
  fieldName,
  placeholder = "Namn"
}: SkillFieldArrayProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{placeholder}</p>
        <Button
          type="button"
          onClick={onAdd}
          variant="secondary"
          size="sm"
        >
          + Lägg till
        </Button>
      </div>
      
      <div className="space-y-3">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-[1fr,80px,100px,auto] gap-2">
            <Input
              placeholder={placeholder}
              {...register(`${fieldName}.${index}.name` as const, { required: true })}
            />
            <Input
              placeholder="Emoji"
              {...register(`${fieldName}.${index}.icon` as const, { required: true })}
            />
            <Input
              placeholder="Färg"
              {...register(`${fieldName}.${index}.color` as const, { required: true })}
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
