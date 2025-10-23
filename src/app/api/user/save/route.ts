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

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        picture,
      },
      create: {
        id: sub,
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
