import { prisma } from '@lib/prisma';

export async function POST(req: Request) {
  try {
    const { userId, conversationId } = await req.json();
    if (!userId || !conversationId) {
      return Response.json({ error: 'Missing userId or conversationId' }, { status: 400 });
    }
    // Support both forms for userId: the pure provider id (e.g. '12345') and
    // the Auth0 'provider|id' form (e.g. 'google-oauth2|12345'). This helps when
    // some records were saved with the prefixed form and others with the pure id.
    const userIdIsPrefixed = typeof userId === 'string' && userId.includes('|');

    const whereClause: Record<string, unknown> = { conversationId };
    if (userIdIsPrefixed) {
      // If the client already sent the prefixed form, query directly
      whereClause.userId = userId;
    } else {
      // If client sent a pure id, look for either pure id OR google-oauth2|<id>
      whereClause.OR = [{ userId }, { userId: `google-oauth2|${userId}` }];
    }

    const messages = await prisma.chatMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'asc' },
    });
    return Response.json({ messages });
  } catch (e) {
    console.error('loadMessages error', e);
    return Response.json({ error: 'Server error' }, { status: 500 });
  }
}
