import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    await prisma.chatMessage.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
