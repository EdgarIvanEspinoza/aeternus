import { NextRequest } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  const { userID } = await request.json();
  if (!userID) {
    return new Response('ID de usuario no válido', { status: 400 });
  }
  try {
    // Buscar el usuario por ID
    const user = await prisma.user.findUnique({
      where: {
        UserID: userID,
      },
    });

    if (!user) {
      return new Response('Usuario no encontrado', { status: 404 });
    }

    // Obtener mensajes del usuario
    const userMessages = await prisma.message.findMany({
      where: {
        UserID: userID,
      },
    });
    return new Response(JSON.stringify({ user, messages: userMessages }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error al obtener usuario y mensajes:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
