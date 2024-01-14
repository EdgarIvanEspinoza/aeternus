import { prisma } from '@/app/lib/prisma';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { userID, conversationID, content } = await req.json();

  // Guardar el mensaje en la base de datos
  const newMessage = await prisma.message.create({
    data: {
      UserID: userID,
      ConversationID: conversationID,
      SendDate: new Date(),
      Content: content,
    },
  });

  // Puedes realizar otras acciones aquí, como enviar notificaciones o procesar el mensaje de alguna manera.
  return new Response(`Mensaje guardado ${newMessage}`, { status: 200 });
}
