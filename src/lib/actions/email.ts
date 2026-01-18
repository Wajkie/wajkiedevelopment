'use server';

import { Resend } from 'resend';

export async function sendCV(email: string) {
  if (!email || !email.includes('@')) {
    throw new Error('Ogiltig e-postadress');
  }

  // Lazy initialize Resend only when needed
  const resend = new Resend(process.env.RESEND_API_KEY);

  // TODO: Lägg dina CV och personligt brev som PDF-attachments eller HTML-innehåll
  const { data, error } = await resend.emails.send({
    from: 'CV <cv@wajkiedevelopment.se>',
    to: [email],
    subject: 'Wajkie - CV & Personligt brev',
    html: `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #333;">Tack för ditt intresse!</h1>
        <p>Här kommer mitt CV och personliga brev som du begärde.</p>
        
        <p style="margin-top: 30px;">
          Men glöm inte att kolla in min portfolio också:<br>
          <a href="https://wajkiedevelopment.se" style="color: #8b5cf6;">wajkiedevelopment.se</a>
        </p>
        
        <p style="margin-top: 30px; color: #666; font-size: 14px;">
          Där ser du min kod i praktiken, inte bara på papper 🚀
        </p>
        
        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
        
        <p style="color: #999; font-size: 12px;">
          Detta meddelande skickades från wajkiedevelopment.se
        </p>
      </div>
    `,
    // attachments: [
    //   {
    //     filename: 'CV-Wajkie.pdf',
    //     path: './public/cv/CV-Wajkie.pdf', // Lägg din PDF här
    //   },
    //   {
    //     filename: 'Personligt-Brev-Wajkie.pdf',
    //     path: './public/cv/Personligt-Brev-Wajkie.pdf',
    //   },
    // ],
  });

  if (error) {
    console.error('Resend error:', error);
    throw new Error('Kunde inte skicka e-post');
  }

  return { success: true, id: data?.id };
}
