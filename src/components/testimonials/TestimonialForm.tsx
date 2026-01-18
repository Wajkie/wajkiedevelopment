'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import { Input } from '@/components/ui';
import { Label } from '@/components/ui';
import { Textarea } from '@/components/ui';
import { submitTestimonial, sendThankYouEmailOnSubmit } from '@/lib/actions/testimonials';
import { getFormFieldAriaAttributes, generateId } from '@wajkie/a11y-core';
import { useAnnouncer } from '@wajkie/react-a11y';

export default function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    emailConsent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const announce = useAnnouncer();
  const nameErrorId = generateId('name-error');
  const emailErrorId = generateId('email-error');
  const messageErrorId = generateId('message-error');

  // Announce messages to screen readers
  useEffect(() => {
    if (message) {
      const isSuccess = message.includes('✅');
      announce(message.replace(/✅|❌/g, '').trim(), isSuccess ? 'polite' : 'assertive');
    }
  }, [message, announce]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.name.length < 2 || formData.name.length > 100) {
      newErrors.name = 'Namnet måste vara mellan 2-100 tecken';
    }
    
    if (!formData.email.includes('@')) {
      newErrors.email = 'Ange en giltig e-postadress';
    }
    
    if (formData.message.length < 10 || formData.message.length > 1000) {
      newErrors.message = 'Meddelandet måste vara mellan 10-1000 tecken';
    }
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      announce(`Formuläret innehåller ${Object.keys(newErrors).length} fel. Kontrollera fälten.`, 'assertive');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage('');

    try {
      // Send thank you email if consent given (before hashing)
      if (formData.emailConsent) {
        await sendThankYouEmailOnSubmit(formData.email);
      }

      // Submit testimonial (name and email will be hashed)
      await submitTestimonial(formData);
      
      setMessage('✅ Tack för ditt testimonial! Vi granskar det inom kort.');
      setFormData({ name: '', email: '', message: '', emailConsent: false });
      setErrors({});
    } catch (error) {
      setMessage(`❌ Något gick fel: ${error instanceof Error ? error.message : 'Okänt fel'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle as="h1" className="text-3xl">
              Lämna ett testimonial
            </CardTitle>
            <CardDescription>
              Har vi jobbat tillsammans? Dela gärna dina tankar och upplevelser!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Namn <span className="text-destructive" aria-label="obligatoriskt fält">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) {
                      setErrors({ ...errors, name: '' });
                    }
                  }}
                  placeholder="Ditt namn"
                  required
                  minLength={2}
                  maxLength={100}
                  {...getFormFieldAriaAttributes('name', !!errors.name, false)}
                />
                {errors.name && (
                  <p id={nameErrorId} className="text-sm text-destructive" role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  E-post <span className="text-destructive" aria-label="obligatoriskt fält">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: '' });
                    }
                  }}
                  placeholder="din.email@example.com"
                  required
                  {...getFormFieldAriaAttributes('email', !!errors.email, true)}
                  aria-describedby="email-help"
                />
                <p id="email-help" className="text-xs text-muted-foreground">
                  Din e-post krypteras och används endast för att kontakta dig vid behov
                </p>
                {errors.email && (
                  <p id={emailErrorId} className="text-sm text-destructive" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">
                  Ditt testimonial <span className="text-destructive" aria-label="obligatoriskt fält">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (errors.message) {
                      setErrors({ ...errors, message: '' });
                    }
                  }}
                  placeholder="Berätta om din upplevelse av att jobba med mig..."
                  required
                  minLength={10}
                  maxLength={1000}
                  rows={6}
                  {...getFormFieldAriaAttributes('message', !!errors.message, true)}
                  aria-describedby="message-help message-count"
                />
                <p id="message-count" className="text-xs text-muted-foreground" aria-live="polite">
                  {formData.message.length}/1000 tecken
                </p>
                {errors.message && (
                  <p id={messageErrorId} className="text-sm text-destructive" role="alert">
                    {errors.message}
                  </p>
                )}
              </div>

              {/* Email Consent */}
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
                <input
                  id="emailConsent"
                  type="checkbox"
                  checked={formData.emailConsent}
                  onChange={(e) => setFormData({ ...formData, emailConsent: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-border"
                />
                <div className="flex-1">
                  <Label htmlFor="emailConsent" className="cursor-pointer text-sm">
                    Skicka ett tackmeddelande via e-post
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Om du kryssar i denna ruta kommer vi att skicka ett kort tackmeddelande till din e-post när ditt testimonial har granskats.
                  </p>
                </div>
              </div>

              {/* GDPR Notice */}
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 text-sm">
                <h3 className="font-semibold text-accent mb-2">🔒 Integritet & GDPR</h3>
                <ul className="text-muted-foreground space-y-1 text-xs">
                  <li>• Ditt namn och e-post krypteras</li>
                  <li>• Vi sparar ingen personlig data i klartext</li>
                  <li>• Ditt meddelande publiceras endast efter godkännande</li>
                  <li>• Du kan när som helst kontakta oss för att ta bort ditt testimonial</li>
                </ul>
              </div>

              {/* Message */}
              {message && (
                <div
                  role="alert"
                  aria-live="polite"
                  className={`rounded-lg border p-4 ${
                    message.includes('✅')
                      ? 'bg-accent/10 text-accent border-accent/20'
                      : 'bg-destructive/10 text-destructive border-destructive/20'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  {isSubmitting ? 'Skickar...' : 'Skicka testimonial'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFormData({ name: '', email: '', message: '', emailConsent: false });
                    setErrors({});
                    announce('Formuläret har rensats', 'polite');
                  }}
                  disabled={isSubmitting}
                  aria-label="Rensa formuläret"
                >
                  Rensa
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle as="h2">Vad händer sen?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">1. Granskning:</span> Jag läser igenom alla testimonials personligen för att säkerställa autenticitet
            </p>
            <p>
              <span className="font-semibold text-foreground">2. Godkännande:</span> När ditt testimonial är godkänt publiceras det på sidan
            </p>
            <p>
              <span className="font-semibold text-foreground">3. Tack:</span> Om du valt att få ett tackmeddelande skickar vi ett kort tack via e-post
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
