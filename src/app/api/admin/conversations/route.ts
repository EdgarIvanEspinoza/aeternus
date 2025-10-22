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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');
    
    const skip = (page - 1) * limit;

    // Get all messages grouped by conversationId
    const whereClause = userId ? { userId } : {};
    
    // Get all messages and group them by conversation
    const allMessages = await prisma.chatMessage.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    // Group by conversation and get relevant data
    const conversationsMap = new Map();
    
    allMessages.forEach(message => {
      if (!conversationsMap.has(message.conversationId)) {
        conversationsMap.set(message.conversationId, {
          conversationId: message.conversationId,
          userId: message.userId,
          startedAt: message.createdAt,
          lastMessageAt: message.createdAt,
          messageCount: 1,
          messages: [message]
        });
      } else {
        const conversation = conversationsMap.get(message.conversationId);
        conversation.messageCount++;
        conversation.messages.push(message);
        
        // Update start and end times
        if (message.createdAt < conversation.startedAt) {
          conversation.startedAt = message.createdAt;
        }
        if (message.createdAt > conversation.lastMessageAt) {
          conversation.lastMessageAt = message.createdAt;
        }
      }
    });
    
    // Convert map to array and sort by lastMessageAt
    let conversationsArray = Array.from(conversationsMap.values())
      .sort((a, b) => b.lastMessageAt.getTime() - a.lastMessageAt.getTime());
    
    // Calculate pagination
    const total = conversationsArray.length;
    const paginatedConversations = conversationsArray.slice(skip, skip + limit);

    // Get user data for all conversations
    const userIds = [...new Set(paginatedConversations.map(c => c.userId))];
    const users = await prisma.user.findMany({
      where: {
        id: { in: userIds }
      },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true
      }
    });
    
    // If no users found, try to find them by using the userId as Auth0 sub
    if (users.length === 0) {
      console.log("No users found in database. This could happen if users haven't been properly synced.");
    }

    // Map users to conversations
    const conversationsWithUsers = paginatedConversations.map(conv => {
      const user = users.find(u => u.id === conv.userId) || null;
      return {
        ...conv,
        user
      };
    });

    // For each conversation, get the first user message and first AI response
    const conversationsWithSamples = conversationsWithUsers.map(conv => {
      const userMessage = conv.messages.find(m => m.role === 'user');
      const aiMessage = conv.messages.find(m => m.role === 'assistant');
      
      return {
        ...conv,
        sampleUserMessage: userMessage ? userMessage.content : null,
        sampleAIMessage: aiMessage ? aiMessage.content : null,
        // Remove full messages from response to reduce payload size
        messages: undefined
      };
    });

    return Response.json({
      conversations: conversationsWithSamples,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return Response.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}