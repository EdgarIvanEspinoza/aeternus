import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@lib/prisma';
import { isAdminUser } from '@config/admin-access';

export async function GET(req: Request) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Obtener todas las invitaciones
    const invitations = await prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Verificar sesión y permisos de administrador
    const session = await getSession();
    if (!session?.user || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await req.json();

    // Validar email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una invitación para este email
    const existingInvitation = await prisma.invitation.findUnique({
      where: { email },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: 'Invitation already exists for this email' },
        { status: 400 }
      );
    }

    // Crear nueva invitación
    const invitation = await prisma.invitation.create({
      data: {
        email,
        status: 'pending',
      },
    });

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to create invitation' },
      { status: 500 }
    );
  }
}