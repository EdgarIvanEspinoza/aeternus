import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

// Delete all messages for a user, optionally restricted to a conversationId
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, conversationId } = body;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const where: { userId: string; conversationId?: string } = { userId };
    if (conversationId) where.conversationId = conversationId;
    const result = await prisma.chatMessage.deleteMany({ where });
    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
