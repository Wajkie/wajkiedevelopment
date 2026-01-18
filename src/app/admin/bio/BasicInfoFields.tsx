'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Textarea } from '@/components/ui';
import type { BioFormData } from './types';

type BasicInfoFieldsProps = {
  register: UseFormRegister<BioFormData>;
  errors: FieldErrors<BioFormData>;
};

export const BasicInfoFields = ({ register, errors }: BasicInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Namn</Label>
        <Input
          id="name"
          {...register('name', { required: 'Namn krävs' })}
        />
        {errors.name?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="tagline">Tagline</Label>
        <Input
          id="tagline"
          {...register('tagline', { required: 'Tagline krävs' })}
        />
        {errors.tagline?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.tagline.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="shortPitch">Kort pitch</Label>
        <Textarea
          id="shortPitch"
          rows={3}
          {...register('shortPitch', { required: 'Pitch krävs' })}
        />
        {errors.shortPitch?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.shortPitch.message as string}</p>
        )}
      </div>
    </div>
  );
};
