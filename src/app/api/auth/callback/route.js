import { handleCallback } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // Handle the callback from Auth0
    const res = await handleCallback(req);
    
    // Extract the cookies to pass to the redirect
    const cookieHeader = res.headers.get('set-cookie');
    
    // Redirect to the chat page
    const redirectResponse = NextResponse.redirect(new URL('/chat', req.url));
    
    // Transfer cookies from the Auth0 response to our redirect
    if (cookieHeader) {
      redirectResponse.headers.set('set-cookie', cookieHeader);
    }
    
    return redirectResponse;
  } catch (error) {
    console.error('Error handling Auth0 callback:', error);
    return NextResponse.redirect(
      new URL('/error?error=' + encodeURIComponent(error.message), req.url)
    );
  }
}

// Dynamic: uses cookies/session (Auth0)
export const dynamic = 'force-dynamic';