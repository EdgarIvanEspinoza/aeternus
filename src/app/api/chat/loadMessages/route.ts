import { prisma } from '@lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, conversationId } = await req.json();
    if (!userId || !conversationId) {
      return Response.json({ error: 'Missing userId or conversationId' }, { status: 400 });
    }
    const messages = await prisma.chatMessage.findMany({
      where: { userId, conversationId },
      orderBy: { createdAt: 'asc' },
    });
    return Response.json({ messages });
  } catch (e) {
    console.error('loadMessages error', e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
