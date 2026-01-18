'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui';
import { Accordion } from '@/components/ui';
import { FormHeader, ImageUploader, FormArrayField } from '@/components/forms';
import { Input, Label, Textarea } from '@/components/ui';
import { useFormSubmit } from '@/hooks/useFormSubmit';
import { useLocalStorageDraft } from '@/hooks/useLocalStorageDraft';
import { useDraftManager } from '@/hooks/useDraftManager';
import { updateJourneyEntries } from '@/lib/actions/journey';
import type { JourneyEntry, JourneyFormData } from '@/types';

type Props = {
  initialData: JourneyEntry[];
};

const STORAGE_KEY = 'journey-editor-draft';

const entriesToFormData = (entries: JourneyEntry[]): JourneyFormData[] => {
  return entries.map(entry => ({
    title: entry.title,
    description: entry.description,
    date: entry.date,
    period: entry.period,
    images: entry.images.map(path => ({ path })),
    learnings: entry.learnings.map(text => ({ text })),
    result: entry.result ?? '',
    tags: entry.tags.map(name => ({ name })),
    links: entry.links,
  }));
};

const formDataToEntries = (formData: JourneyFormData[]): Omit<JourneyEntry, 'id' | 'orderIndex'>[] => {
  return formData.map(entry => ({
    title: entry.title,
    description: entry.description,
    date: entry.date,
    period: entry.period,
    images: entry.images.map(img => img.path),
    learnings: entry.learnings.map(l => l.text),
    result: entry.result || undefined,
    tags: entry.tags.map(t => t.name),
    links: entry.links,
  }));
};

export default function JourneyEditor({ initialData }: Props) {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<{ entries: JourneyFormData[] }>({
    defaultValues: {
      entries: entriesToFormData(initialData),
    },
  });

  const formValues = watch();
  const { clearDraft } = useLocalStorageDraft({
    key: STORAGE_KEY,
    data: formValues,
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'entries',
  });

  const { isSubmitting, message, handleSubmit: submitForm } = useFormSubmit<{ entries: JourneyFormData[] }>({
    action: async (data) => {
      const entries = formDataToEntries(data.entries).map((entry, index) => ({
        ...entry,
        id: initialData[index]?.id ?? 0,
        orderIndex: index,
      }));
      return await updateJourneyEntries(entries as JourneyEntry[]);
    },
    onSuccess: () => {
      clearDraft();
    },
  });

  const { handleClearDraft } = useDraftManager({ draftKey: STORAGE_KEY, clearDraft });

  const addEntry = () => {
    append({
      title: '',
      description: '',
      date: '',
      period: '',
      images: [],
      learnings: [],
      result: '',
      tags: [],
      links: [],
    });
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
      <FormHeader
        isSubmitting={isSubmitting}
        submitText="Spara resa"
        submittingText="Sparar..."
        onClearDraft={handleClearDraft}
        message={message ?? undefined}
        extraActions={
          <Button type="button" onClick={addEntry} variant="outline">
            + Lägg till händelse
          </Button>
        }
      />

      {fields.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-4">Ingen data ännu</p>
          <Button type="button" onClick={addEntry} variant="outline">
            Skapa din första händelse
          </Button>
        </div>
      )}

      {fields.map((field, index) => (
        <Accordion
          key={field.id}
          title={`📅 ${watch(`entries.${index}.title`) || `Händelse ${index + 1}`}`}
          defaultOpen={index === 0}
        >
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`entries.${index}.title`}>Titel *</Label>
                <Input
                  {...register(`entries.${index}.title`, { required: true })}
                  placeholder="T.ex. Webbapplikation med React"
                />
                {errors.entries?.[index]?.title && (
                  <p className="text-sm text-red-600 mt-1">Titel krävs</p>
                )}
              </div>

              <div>
                <Label htmlFor={`entries.${index}.period`}>Period *</Label>
                <Input
                  {...register(`entries.${index}.period`, { required: true })}
                  placeholder="T.ex. Year 1 - Web Development"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`entries.${index}.date`}>Datum *</Label>
                <Input
                  {...register(`entries.${index}.date`, { required: true })}
                  type="month"
                  placeholder="2024-01"
                />
              </div>

              <div>
                <Label htmlFor={`entries.${index}.result`}>Resultat/Betyg</Label>
                <Input
                  {...register(`entries.${index}.result`)}
                  placeholder="T.ex. VG, Godkänd, 90%"
                />
              </div>
            </div>

            <div>
              <Label htmlFor={`entries.${index}.description`}>Beskrivning *</Label>
              <Textarea
                {...register(`entries.${index}.description`, { required: true })}
                placeholder="Beskriv uppgiften, vad du byggde, vilka teknologier du använde..."
                rows={4}
              />
            </div>

            {/* Image Upload */}
            <div>
              <Label>Bilder</Label>
              <ImageUploader
                images={watch(`entries.${index}.images`)?.map(img => img.path) ?? []}
                onImagesChange={(urls) => {
                  const entries = watch('entries');
                  entries[index].images = urls.map(url => ({ path: url }));
                  formValues.entries = [...entries];
                }}
              />
            </div>

            {/* Learnings */}
            <div>
              <Label>Lärdomar</Label>
              <FormArrayField
                path={`entries.${index}.learnings` as never}
                watch={watch as never}
                register={register as never}
                setValue={(path, value) => {
                  const entries = watch('entries');
                  entries[index].learnings = value as Array<{ text: string }>;
                  formValues.entries = [...entries];
                }}
                fields={[{ name: 'text', placeholder: 'T.ex. Lärde mig React Hooks' }]}
                buttonText="+ Lägg till lärdom"
                emptyItem={{ text: '' }}
              />
            </div>

            {/* Tags */}
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {watch(`entries.${index}.tags`)?.map((_, tagIndex) => (
                  <div key={tagIndex} className="flex items-center gap-1 bg-muted px-2 py-1 rounded">
                    <Input
                      {...register(`entries.${index}.tags.${tagIndex}.name`)}
                      placeholder="React"
                      className="w-24 h-6 px-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const entries = watch('entries');
                        entries[index].tags.splice(tagIndex, 1);
                        formValues.entries = [...entries];
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                )) ?? []}
                <Button
                  type="button"
                  onClick={() => {
                    const entries = watch('entries');
                    if (!entries[index].tags) entries[index].tags = [];
                    entries[index].tags.push({ name: '' });
                    formValues.entries = [...entries];
                  }}
                  variant="outline"
                  size="sm"
                >
                  + Tag
                </Button>
              </div>
            </div>

            {/* Links */}
            <div>
              <Label>Länkar</Label>
              <FormArrayField
                path={`entries.${index}.links` as never}
                watch={watch as never}
                register={register as never}
                setValue={(path, value) => {
                  const entries = watch('entries');
                  entries[index].links = value as Array<{ title: string; url: string }>;
                  formValues.entries = [...entries];
                }}
                fields={[
                  { name: 'title', placeholder: 'Titel', className: 'w-1/3' },
                  { name: 'url', placeholder: 'https://...' },
                ]}
                buttonText="+ Lägg till länk"
                emptyItem={{ title: '', url: '' }}
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex gap-2">
                {index > 0 && (
                  <Button
                    type="button"
                    onClick={() => move(index, index - 1)}
                    variant="ghost"
                    size="sm"
                  >
                    ↑ Flytta upp
                  </Button>
                )}
                {index < fields.length - 1 && (
                  <Button
                    type="button"
                    onClick={() => move(index, index + 1)}
                    variant="ghost"
                    size="sm"
                  >
                    ↓ Flytta ner
                  </Button>
                )}
              </div>

              <Button
                type="button"
                onClick={() => remove(index)}
                variant="destructive"
                size="sm"
              >
                🗑️ Ta bort
              </Button>
            </div>
          </div>
        </Accordion>
      ))}

      <div className="flex items-center justify-between gap-4 p-4 border-t border-border">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? 'Sparar...' : 'Spara resa'}
        </Button>
        
        {message && (
          <p className="text-green-600">{message}</p>
        )}
      </div>
    </form>
  );
}
