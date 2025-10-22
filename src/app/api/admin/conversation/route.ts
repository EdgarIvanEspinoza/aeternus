import { prisma } from '@lib/prisma';
import { isAdminUser } from '../../../../config/admin-access';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getSession();
    const userEmail = session?.user?.email;

    // Check if user is an admin
    if (!isAdminUser(userEmail)) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    
    if (!conversationId) {
      return Response.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    // Get all messages for this conversation
    const messages = await prisma.chatMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' }
    });

    // Get user information if there are messages
    let user = null;
    if (messages.length > 0) {
      user = await prisma.user.findUnique({
        where: { id: messages[0].userId },
        select: {
          id: true,
          email: true,
          name: true,
          picture: true
        }
      });
    }

    return Response.json({
      conversation: {
        id: conversationId,
        user,
        messages,
        messageCount: messages.length,
        startedAt: messages.length > 0 ? messages[0].createdAt : null,
        lastMessageAt: messages.length > 0 ? messages[messages.length - 1].createdAt : null
      }
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return Response.json({ error: 'Failed to fetch conversation' }, { status: 500 });
  }
}