import { NextResponse } from 'next/server';

// Invitations feature removed. Endpoint retained to avoid 404s for stale client requests.
export async function GET() {
  return NextResponse.json({ error: 'Invitations feature removed' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: 'Invitations feature removed' }, { status: 410 });
}
