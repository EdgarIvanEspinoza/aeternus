import { prisma } from '@lib/prisma';

export async function POST(req: Request) {
  const { userId } = await req.json();
  const messages = await prisma.chatMessage.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  });

  console.log(messages);

  return Response.json({ messages });
}
