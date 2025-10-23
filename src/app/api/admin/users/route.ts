import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';
import { Prisma } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';
import { isAdminUser } from '@config/admin-access';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    const email = session?.user?.email;
    if (!isAdminUser(email)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const search = req.nextUrl.searchParams.get('q')?.trim();
    const take = Number(req.nextUrl.searchParams.get('take') || 50);
    const cursor = req.nextUrl.searchParams.get('cursor');

    let where: Prisma.UserWhereInput | undefined = undefined;
    if (search) {
      where = {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      };
    }

    const users = await prisma.user.findMany({
      where,
      take: take + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, picture: true },
    });

    let nextCursor: string | null = null;
    if (users.length > take) {
      const next = users.pop();
      nextCursor = next!.id;
    }

    return NextResponse.json({ users, nextCursor });
  } catch (e) {
    console.error('Error listing users', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
