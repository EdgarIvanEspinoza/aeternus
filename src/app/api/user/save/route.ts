import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { sub, name, email, picture } = body;

    if (!sub || !email || !name) {
      return NextResponse.json({ error: 'Faltan datos del usuario' }, { status: 400 });
    }

    // If the user logged in with Google, Auth0 returns sub like "google-oauth2|<googleId>".
    // The requirement is to use the Google user id itself as the stored id. Extract it when present.
    let finalId = sub; // default to Auth0 'sub'
    if (typeof sub === 'string' && sub.startsWith('google-oauth2|')) {
      const parts = sub.split('|');
      if (parts.length === 2 && parts[1]) {
        finalId = parts[1];
      }
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        picture,
      },
      create: {
        id: finalId,
        name,
        email,
        picture,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('[saveUser] Error al guardar el usuario:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
