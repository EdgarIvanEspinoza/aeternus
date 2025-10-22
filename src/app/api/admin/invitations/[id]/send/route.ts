import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@lib/prisma';
import { isAdminUser } from '@config/admin-access';
import { sendMail } from '@utils/mail';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    // Buscar la invitación
    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation) {
      return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
    }

    // Generar enlace de invitación
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const encodedEmail = Buffer.from(invitation.email).toString('base64');
    const invitationLink = `${baseUrl}/api/auth/login?invitation=${encodedEmail}`;

    // Plantilla de correo
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #6366F1; margin-bottom: 20px;">Invitación a Aeternus Alpha</h2>
        <p>Has sido invitado a participar en la versión alpha de Aeternus.</p>
        <p>Aeternus es una plataforma de conversación con IA diseñada para ofrecerte experiencias de diálogo profundas y significativas.</p>
        <p style="margin: 30px 0;">
          <a href="${invitationLink}" style="background-color: #6366F1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Acceder a Aeternus
          </a>
        </p>
        <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
        <p style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
          ${invitationLink}
        </p>
        <p style="font-size: 0.9em; color: #666; margin-top: 30px;">
          Si recibiste este correo por error, por favor ignóralo.
        </p>
      </div>
    `;

    // Enviar correo
    await sendMail({
      to: invitation.email,
      subject: 'Tu invitación a Aeternus Alpha',
      html: emailHtml,
    });

    // Actualizar estado de la invitación
    const updatedInvitation = await prisma.invitation.update({
      where: { id },
      data: {
        status: 'sent',
        lastSentAt: new Date(),
      },
    });

    return NextResponse.json({ invitation: updatedInvitation });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error sending invitation:', error);
    return NextResponse.json(
      {
        error: 'Failed to send invitation',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
