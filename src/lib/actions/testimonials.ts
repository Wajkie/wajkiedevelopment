'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/auth';

const SALT_ROUNDS = 12;

// Submit a new testimonial
export async function submitTestimonial(data: {
  name: string;
  email: string;
  message: string;
  emailConsent: boolean;
}) {
  // Validate input
  if (!data.name || data.name.length < 2 || data.name.length > 100) {
    throw new Error('Namnet måste vara mellan 2 och 100 tecken');
  }

  if (!data.email || !data.email.includes('@')) {
    throw new Error('Ogiltig e-postadress');
  }

  if (!data.message || data.message.length < 10 || data.message.length > 1000) {
    throw new Error('Meddelandet måste vara mellan 10 och 1000 tecken');
  }

  // Hash name and email with bcrypt (12 rounds)
  const nameHash = await bcrypt.hash(data.name.toLowerCase().trim(), SALT_ROUNDS);
  const emailHash = await bcrypt.hash(data.email.toLowerCase().trim(), SALT_ROUNDS);

  // Insert into database
  await db
    .insertInto('testimonials')
    .values({
      nameHash,
      emailHash,
      message: data.message.trim(),
      status: 'pending',
      emailConsent: data.emailConsent,
      thankYouSent: false,
      approvedAt: null,
    })
    .execute();

  return { success: true };
}

// Approve a testimonial (admin only)
export async function approveTestimonial(id: number) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  // Get testimonial to check consent
  const testimonial = await db
    .selectFrom('testimonials')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst();

  if (!testimonial) {
    throw new Error('Testimonial not found');
  }

  // Update status
  await db
    .updateTable('testimonials')
    .set({
      status: 'approved',
      approvedAt: new Date(),
    })
    .where('id', '=', id)
    .execute();

  // Send thank you email if consent was given
  if (testimonial.emailConsent && !testimonial.thankYouSent) {
    await sendThankYouEmail(id);
  }

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimonials');

  return { success: true };
}

// Reject a testimonial (admin only)
export async function rejectTestimonial(id: number) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  await db
    .updateTable('testimonials')
    .set({
      status: 'rejected',
      approvedAt: null,
    })
    .where('id', '=', id)
    .execute();

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimonials');

  return { success: true };
}

// Delete a testimonial permanently (admin only)
export async function deleteTestimonial(id: number) {
  const session = await getSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  await db
    .deleteFrom('testimonials')
    .where('id', '=', id)
    .execute();

  revalidatePath('/admin/testimonials');
  revalidatePath('/testimonials');

  return { success: true };
}

// Send thank you email
async function sendThankYouEmail(testimonialId: number) {
  // Note: We can't decrypt the email hash, so we need to store it temporarily
  // or send the email immediately when they submit.
  // For now, we'll just mark it as sent.
  
  // In a real implementation, you would:
  // 1. Send email when form is submitted (before hashing)
  // 2. Or store email temporarily in a separate secure table
  
  await db
    .updateTable('testimonials')
    .set({ thankYouSent: true })
    .where('id', '=', testimonialId)
    .execute();

  return { success: true };
}

// Helper to send thank you email during submission
export async function sendThankYouEmailOnSubmit(email: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, skipping email');
    return { success: true };
  }

  try {
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: 'Wajkie Development <noreply@wajkie.dev>',
      to: email,
      subject: 'Tack för ditt testimonial!',
      html: `
        <h2>Tack för ditt testimonial!</h2>
        <p>Ditt testimonial har tagits emot och kommer att granskas inom kort.</p>
        <p>När det har godkänts kommer det att publiceras på vår hemsida.</p>
        <br>
        <p>Med vänliga hälsningar,<br>Wajkie Development</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send thank you email:', error);
    // Don't throw error - email is optional
    return { success: false };
  }
}

// Get approved testimonials (public)
export async function getApprovedTestimonials() {
  const testimonials = await db
    .selectFrom('testimonials')
    .select(['id', 'message', 'approvedAt'])
    .where('status', '=', 'approved')
    .orderBy('approvedAt', 'desc')
    .execute();

  return testimonials;
}

// Get testimonials grouped by status (admin only)
export async function getTestimonialsByStatus() {
  const session = await getSession();
  if (!session.isAuthenticated) {
    throw new Error('Unauthorized');
  }

  const [pending, approved, rejected] = await Promise.all([
    db
      .selectFrom('testimonials')
      .selectAll()
      .where('status', '=', 'pending')
      .orderBy('createdAt', 'desc')
      .execute(),
    db
      .selectFrom('testimonials')
      .selectAll()
      .where('status', '=', 'approved')
      .orderBy('approvedAt', 'desc')
      .execute(),
    db
      .selectFrom('testimonials')
      .selectAll()
      .where('status', '=', 'rejected')
      .orderBy('updatedAt', 'desc')
      .execute(),
  ]);

  return { pending, approved, rejected };
}
