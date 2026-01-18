'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import type { BioFormData } from './types';

type ContactInfoFieldsProps = {
  register: UseFormRegister<BioFormData>;
  errors: FieldErrors<BioFormData>;
};

export const ContactInfoFields = ({ register, errors }: ContactInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contactEmail">Email</Label>
        <Input
          id="contactEmail"
          type="email"
          {...register('contactEmail', { required: 'Email krävs' })}
        />
        {errors.contactEmail?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.contactEmail.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contactGithub">GitHub</Label>
        <Input
          id="contactGithub"
          {...register('contactGithub', { required: 'GitHub krävs' })}
        />
        {errors.contactGithub?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.contactGithub.message as string}</p>
        )}
      </div>

      <div>
        <Label htmlFor="contactLinkedin">LinkedIn</Label>
        <Input
          id="contactLinkedin"
          {...register('contactLinkedin', { required: 'LinkedIn krävs' })}
        />
        {errors.contactLinkedin?.message && (
          <p className="text-red-500 text-sm mt-1">{errors.contactLinkedin.message as string}</p>
        )}
      </div>
    </div>
  );
};
