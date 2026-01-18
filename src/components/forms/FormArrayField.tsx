'use client';

import { FieldValues } from 'react-hook-form';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';

type FormArrayFieldProps<T extends FieldValues> = {
  path: string;
  watch: (name?: string) => unknown;
  register: (name: string) => object;
  setValue: (name: string, value: unknown) => void;
  fields: {
    name: string;
    placeholder: string;
    className?: string;
  }[];
  buttonText: string;
  emptyItem: Record<string, unknown>;
};

export function FormArrayField<T extends FieldValues>({
  path,
  watch,
  register,
  setValue,
  fields,
  buttonText,
  emptyItem,
}: FormArrayFieldProps<T>) {
  const items = (watch(path as never) as unknown[]) ?? [];

  const removeItem = (itemIndex: number) => {
    const updated = [...items];
    updated.splice(itemIndex, 1);
    setValue(path, updated);
  };

  const addItem = () => {
    setValue(path, [...items, emptyItem]);
  };

  return (
    <div className="space-y-2">
      {items.map((_, itemIndex) => (
        <div key={itemIndex} className="flex gap-2">
          {fields.map((field) => (
            <Input
              key={field.name}
              {...register(`${path}.${itemIndex}.${field.name}`)}
              placeholder={field.placeholder}
              className={field.className ?? 'flex-1'}
            />
          ))}
          <Button
            type="button"
            onClick={() => removeItem(itemIndex)}
            variant="ghost"
            size="sm"
          >
            ×
          </Button>
        </div>
      ))}
      <Button type="button" onClick={addItem} variant="outline" size="sm">
        {buttonText}
      </Button>
    </div>
  );
}
