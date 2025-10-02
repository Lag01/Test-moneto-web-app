import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const body = await request.json();
    const { name, email, subject, description, userAgent, url } = body;

    // Validation des données
    if (!email || !subject || !description) {
      return NextResponse.json(
        { error: 'Veuillez remplir tous les champs obligatoires' },
        { status: 400 }
      );
    }

    // Logger les informations du signalement
    console.log('=== NOUVEAU SIGNALEMENT DE BUG ===');
    console.log('Nom:', name || 'Non renseigné');
    console.log('Email:', email);
    console.log('Sujet:', subject);
    console.log('Description:', description);
    console.log('User Agent:', userAgent);
    console.log('URL:', url);
    console.log('=================================');

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'Moneto Bug Report <onboarding@resend.dev>', // Adresse d'envoi vérifiée
      to: ['erwanguezingar01@gmail.com'],
      replyTo: email,
      subject: `[Moneto Bug Report] ${subject}`,
      html: `
        <h2>Nouveau signalement de bug - Moneto</h2>
        <hr />

        <h3>Informations de contact</h3>
        <p><strong>Nom :</strong> ${name || 'Non renseigné'}</p>
        <p><strong>Email :</strong> ${email}</p>

        <h3>Détails du signalement</h3>
        <p><strong>Sujet :</strong> ${subject}</p>
        <p><strong>Description :</strong></p>
        <p>${description.replace(/\n/g, '<br />')}</p>

        <h3>Informations techniques</h3>
        <p><strong>Navigateur :</strong> ${userAgent || 'Non renseigné'}</p>
        <p><strong>URL :</strong> ${url || 'Non renseigné'}</p>

        <hr />
        <p style="font-size: 12px; color: #666;">
          Ce message a été envoyé automatiquement depuis l'application Moneto.
        </p>
      `,
    });

    console.log('Réponse Resend:', JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'envoi du signalement. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
