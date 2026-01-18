'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { Button } from '@/components/ui';
import {
  getTestimonialsByStatus,
  approveTestimonial,
  rejectTestimonial,
  deleteTestimonial
} from '@/lib/actions/testimonials';

type Testimonial = {
  id: number;
  nameHash: string;
  emailHash: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  emailConsent: boolean;
  thankYouSent: boolean;
  approvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function TestimonialsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [processing, setProcessing] = useState<number | null>(null);
  const [testimonials, setTestimonials] = useState<{
    pending: Testimonial[];
    approved: Testimonial[];
    rejected: Testimonial[];
  }>({ pending: [], approved: [], rejected: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const data = await getTestimonialsByStatus();
      setTestimonials(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setProcessing(id);
    try {
      await approveTestimonial(id);
      await loadTestimonials();
    } catch (error) {
      console.error('Error approving:', error);
      alert('Kunde inte godkänna testimonial');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: number) => {
    setProcessing(id);
    try {
      await rejectTestimonial(id);
      await loadTestimonials();
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Kunde inte avvisa testimonial');
    } finally {
      setProcessing(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Är du säker på att du vill ta bort detta testimonial permanent?')) {
      return;
    }
    
    setProcessing(id);
    try {
      await deleteTestimonial(id);
      await loadTestimonials();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Kunde inte ta bort testimonial');
    } finally {
      setProcessing(null);
    }
  };

  const currentTestimonials = testimonials[activeTab];

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Laddar testimonials...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle as="h1" className="text-3xl">
                  Hantera Testimonials
                </CardTitle>
                <CardDescription>
                  Granska och godkänn inkomna testimonials
                </CardDescription>
              </div>
              <Button onClick={() => router.push('/admin')} variant="outline">
                ← Dashboard
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardDescription>Väntar på granskning</CardDescription>
              <CardTitle className="text-3xl">{testimonials.pending.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Godkända</CardDescription>
              <CardTitle className="text-3xl">{testimonials.approved.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Avvisade</CardDescription>
              <CardTitle className="text-3xl">{testimonials.rejected.length}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <div className="flex gap-2">
              <Button
                onClick={() => setActiveTab('pending')}
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                size="sm"
              >
                Pending ({testimonials.pending.length})
              </Button>
              <Button
                onClick={() => setActiveTab('approved')}
                variant={activeTab === 'approved' ? 'default' : 'outline'}
                size="sm"
              >
                Godkända ({testimonials.approved.length})
              </Button>
              <Button
                onClick={() => setActiveTab('rejected')}
                variant={activeTab === 'rejected' ? 'default' : 'outline'}
                size="sm"
              >
                Avvisade ({testimonials.rejected.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {currentTestimonials.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Inga testimonials i denna kategori</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentTestimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Message */}
                        <div className="prose prose-sm max-w-none">
                          <p className="text-foreground whitespace-pre-wrap">{testimonial.message}</p>
                        </div>

                        {/* Metadata */}
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          <span>ID: {testimonial.id}</span>
                          <span>•</span>
                          <span>Namn (hash): {testimonial.nameHash.substring(0, 12)}...</span>
                          <span>•</span>
                          <span>E-post (hash): {testimonial.emailHash.substring(0, 12)}...</span>
                          <span>•</span>
                          <span>
                            Skickat: {new Date(testimonial.createdAt).toLocaleString('sv-SE')}
                          </span>
                          {testimonial.approvedAt && (
                            <>
                              <span>•</span>
                              <span>
                                Godkänt: {new Date(testimonial.approvedAt).toLocaleString('sv-SE')}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Consent badges */}
                        <div className="flex gap-2">
                          {testimonial.emailConsent && (
                            <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-300">
                              📧 Vill ha tackmail
                            </span>
                          )}
                          {testimonial.thankYouSent && (
                            <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-300">
                              ✓ Tackmail skickat
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          {activeTab === 'pending' && (
                            <>
                              <Button
                                onClick={() => handleApprove(testimonial.id)}
                                disabled={processing === testimonial.id}
                                size="sm"
                              >
                                ✓ Godkänn
                              </Button>
                              <Button
                                onClick={() => handleReject(testimonial.id)}
                                disabled={processing === testimonial.id}
                                variant="destructive"
                                size="sm"
                              >
                                ✗ Avvisa
                              </Button>
                            </>
                          )}
                          {activeTab === 'approved' && (
                            <Button
                              onClick={() => handleReject(testimonial.id)}
                              disabled={processing === testimonial.id}
                              variant="outline"
                              size="sm"
                            >
                              Ta bort från publika sidan
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDelete(testimonial.id)}
                            disabled={processing === testimonial.id}
                            variant="ghost"
                            size="sm"
                            className="text-destructive"
                          >
                            🗑️ Radera permanent
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
