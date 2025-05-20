import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { userId, content, role } = await req.json();

  try {
    const savedMessage = await prisma.message.create({
      data: {
        userId,
        content,
        timestamp: new Date(),
        role,
      },
    });

    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error('Error al guardar los mensajes:', error);
    return NextResponse.error();
  }
}
