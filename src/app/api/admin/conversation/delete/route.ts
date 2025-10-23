import { getSession } from '@auth0/nextjs-auth0';
import { isAdminUser } from '../../../../../config/admin-access';
import { prisma } from '@lib/prisma';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user?.email || !isAdminUser(session.user.email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const { searchParams } = new URL(req.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');
    if (!conversationId || !userId) {
      return NextResponse.json({ error: 'conversationId and userId required' }, { status: 400 });
    }
    const result = await prisma.chatMessage.deleteMany({ where: { conversationId, userId } });
    return NextResponse.json({ success: true, deleted: result.count });
  } catch (e) {
    console.error('Delete conversation error', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}