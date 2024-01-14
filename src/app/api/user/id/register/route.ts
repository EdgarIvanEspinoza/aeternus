import { prisma } from '@/app/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    // Verificar si el usuario ya existe
    const existentUser = await prisma.user.findUnique({
      where: {
        Email: email,
      },
    });

    if (existentUser) {
      return new Response('El usuario ya está registrado', { status: 400 });
    }

    // Crear un nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        Name: name,
        Email: email,
        LastName: '',
      },
    });
    return new Response(`Usuario creado: ${newUser.UserID}`, { status: 201 });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    return new Response('Error interno del servidor', { status: 500 });
  }
}
