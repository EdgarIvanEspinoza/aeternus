import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@lib/prisma';

export async function POST(req: Request) {
  try {
    // Verificar autenticación (hacemos opcional la autenticación para permitir feedback anónimo)
    const session = await getSession();

    // Obtener datos de la solicitud
    const { type, content, userId, userEmail } = await req.json();

    // Validar datos
    if (!type || !content) {
      return NextResponse.json({ error: 'Type and content are required' }, { status: 400 });
    }

    // Guardar feedback en la base de datos
    const feedback = await prisma.feedback.create({
      data: {
        type,
        content,
        userId: userId || session?.user?.sub || 'anonymous',
        userEmail: userEmail || session?.user?.email || 'anonymous',
      },
    });

    return NextResponse.json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit feedback',
      },
      { status: 500 }
    );
  }
}
