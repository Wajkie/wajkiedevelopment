'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Accordion } from '@/components/ui';
import { FormHeader } from '@/components/forms';
import { BasicInfoFields } from './BasicInfoFields';
import { ContactInfoFields } from './ContactInfoFields';
import { ParagraphFieldArray } from './ParagraphFieldArray';
import { SkillFieldArray } from './SkillFieldArray';
import { ValueFieldArray } from './ValueFieldArray';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { useLocalStorageDraft } from '@/hooks/useLocalStorageDraft';
import { useDraftManager } from '@/hooks/useDraftManager';
import { updateBio } from '@/lib/actions/bio';
import type { BioTable } from '@/lib/db';
import type { Selectable } from 'kysely';
import type { BioFormData } from './types';

type Props = {
  initialData: Selectable<BioTable>;
};

const STORAGE_KEY = 'bio-editor-draft';

const getDefaultValues = (initialData: Selectable<BioTable>): BioFormData => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as BioFormData;
      } catch {
        // Fallback to initial data
      }
    }
  }
  return {
    name: initialData.name,
    tagline: initialData.tagline,
    shortPitch: initialData.shortPitch,
    aboutParagraphs: initialData.aboutParagraphs.map(text => ({ text })),
    contactEmail: initialData.contactEmail,
    contactGithub: initialData.contactGithub,
    contactLinkedin: initialData.contactLinkedin,
    skillsFrontend: initialData.skillsFrontend,
    skillsBackend: initialData.skillsBackend,
    skillsTools: initialData.skillsTools,
    values: initialData.values,
  };
};

export default function BioEditor({ initialData }: Props) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<BioFormData>({
    defaultValues: getDefaultValues(initialData),
  });

  const formValues = watch();
  const { clearDraft } = useLocalStorageDraft({
    key: STORAGE_KEY,
    data: formValues,
  });

  const { fields: aboutFields, append: appendAbout, remove: removeAbout } = useFieldArray({
    control,
    name: 'aboutParagraphs',
  });

  const { fields: frontendFields, append: appendFrontend, remove: removeFrontend } = useFieldArray({
    control,
    name: 'skillsFrontend',
  });

  const { fields: backendFields, append: appendBackend, remove: removeBackend } = useFieldArray({
    control,
    name: 'skillsBackend',
  });

  const { fields: toolsFields, append: appendTools, remove: removeTools } = useFieldArray({
    control,
    name: 'skillsTools',
  });

  const { fields: valuesFields, append: appendValue, remove: removeValue } = useFieldArray({
    control,
    name: 'values',
  });

  const { isSubmitting, message, handleSubmit: submitForm } = useFormSubmit<BioFormData>({
    action: async (data) => {
      return await updateBio({
        ...data,
        aboutParagraphs: data.aboutParagraphs.map(p => p.text),
      });
    },
    onSuccess: () => {
      clearDraft();
    },
  });

  const { handleClearDraft } = useDraftManager({ draftKey: STORAGE_KEY, clearDraft });

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <FormHeader
        isSubmitting={isSubmitting}
        submitText="Spara bio"
        submittingText="Sparar..."
        onClearDraft={handleClearDraft}
        message={message ?? undefined}
      />

      <Accordion title="📝 Grundinformation" defaultOpen={true}>
        <BasicInfoFields register={register} errors={errors} />
      </Accordion>

      <Accordion title="📧 Kontaktinfo">
        <ContactInfoFields register={register} errors={errors} />
      </Accordion>

      <Accordion title="✍️ Om mig stycken">
        <ParagraphFieldArray
          fields={aboutFields}
          register={register}
          onAdd={() => appendAbout({ text: '' })}
          onRemove={removeAbout}
        />
      </Accordion>

      <Accordion title="⚛️ Frontend Skills">
        <SkillFieldArray
          fields={frontendFields}
          register={register}
          onAdd={() => appendFrontend({ name: '', icon: '', color: '' })}
          onRemove={removeFrontend}
          fieldName="skillsFrontend"
          placeholder="React, TypeScript, CSS, etc."
        />
      </Accordion>

      <Accordion title="🔧 Backend Skills">
        <SkillFieldArray
          fields={backendFields}
          register={register}
          onAdd={() => appendBackend({ name: '', icon: '', color: '' })}
          onRemove={removeBackend}
          fieldName="skillsBackend"
          placeholder="Node.js, PostgreSQL, APIs, etc."
        />
      </Accordion>

      <Accordion title="🛠️ Tools & DevOps">
        <SkillFieldArray
          fields={toolsFields}
          register={register}
          onAdd={() => appendTools({ name: '', icon: '', color: '' })}
          onRemove={removeTools}
          fieldName="skillsTools"
          placeholder="Git, Docker, CI/CD, etc."
        />
      </Accordion>

      <Accordion title="💎 Värderingar">
        <ValueFieldArray
          fields={valuesFields}
          register={register}
          onAdd={() => appendValue({ title: '', description: '', icon: '' })}
          onRemove={removeValue}
        />
      </Accordion>

      <div className="flex items-center justify-between gap-4 p-4 border-t border-border">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Sparar...' : 'Spara bio'}
        </Button>
        
        {message && (
          <p className="text-green-600">
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
