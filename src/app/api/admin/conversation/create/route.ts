import { getSession } from '@auth0/nextjs-auth0';
import { isAdminUser } from '../../../../../config/admin-access';
import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { userId, systemPrompt } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 });
    }
    const conversationId = uuidv4();
    let systemMessage = null;
    if (systemPrompt) {
      systemMessage = await prisma.chatMessage.create({
        data: {
          userId,
          conversationId,
          role: 'system',
          content: systemPrompt,
        },
      });
    }
    return NextResponse.json({ success: true, conversationId, systemMessage });
  } catch (e) {
    console.error('Create conversation error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}