import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { email: string } }) {
  const email = params.email;
  if (!email) {
    return new Response('Correo electrónico no válido', { status: 400 });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    if (!user) {
      return new Response('Usuario no encontrado', { status: 404 });
    }
    return new Response(`Usuario encontrado: ${user.UserID}`, { status: 200 });
  } catch (error) {
    console.error('Error al obtener usuario por correo electrónico:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
