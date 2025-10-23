import { handleLogin } from '@auth0/nextjs-auth0';

export async function GET(req) {
  const host = req.headers.get('host') || '';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/callback`;

  try {
    return handleLogin(req, {
      returnTo: '/chat',
      redirectUri,
    });
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
}