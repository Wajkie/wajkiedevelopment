'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import Link from 'next/link';
import { getApprovedTestimonials } from '@/lib/actions/testimonials';
import { useTranslations } from '@/lib/i18n';

type Testimonial = {
  id: number;
  message: string;
  approvedAt: Date | null;
};

export default function TestimonialsClient() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const tr = useTranslations();

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getApprovedTestimonials();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              {tr.testimonials.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {tr.testimonials.description}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-muted rounded w-1/3"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-5/6"></div>
                  <div className="h-4 bg-muted rounded w-4/6"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            {tr.testimonials.title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {tr.testimonials.description}
          </p>
          <div className="pt-4">
            <Button asChild size="lg">
              <Link href="/testimonials/submit">
                {tr.testimonials.leaveTestimonial}
              </Link>
            </Button>
          </div>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-muted-foreground text-lg">
                {tr.testimonials.noTestimonials}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {testimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className="hover:[box-shadow:var(--shadow-lg)] transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">💬</span>
                    <div className="flex-1">
                      <CardTitle className="text-sm text-muted-foreground">
                        {testimonial.approvedAt &&
                          new Date(testimonial.approvedAt).toLocaleDateString('sv-SE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        }
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <blockquote className="text-foreground whitespace-pre-wrap leading-relaxed">
                    &ldquo;{testimonial.message}&rdquo;
                  </blockquote>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      {tr.testimonials.verifiedPartner}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Card */}
        <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <CardContent className="text-center py-12 space-y-4">
            <h2 className="text-2xl font-bold">
              {tr.testimonials.cta}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {tr.testimonials.ctaDescription}
            </p>
            <Button asChild size="lg">
              <Link href="/testimonials/submit">
                {tr.testimonials.ctaButton}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
