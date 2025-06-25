import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, conversationId, role, content } = body;

    if (!userId || !conversationId || !role || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    await prisma.chatMessage.create({
      data: {
        userId,
        conversationId,
        role,
        content,
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
