// app/api/notifications/route.ts
import { NextRequest } from 'next/server';
import { notificationEmitter } from '@lib/events/notifications';

export async function GET(req: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const listener = (data: { message: string }) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      notificationEmitter.on('notify', listener);

      const keepAlive = setInterval(() => {
        controller.enqueue(':\n\n'); // Keep connection alive
      }, 15_000);

      req.signal.addEventListener('abort', () => {
        notificationEmitter.off('notify', listener);
        clearInterval(keepAlive);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache',
    },
  });
}
