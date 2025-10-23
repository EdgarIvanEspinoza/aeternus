import { handleLogout } from '@auth0/nextjs-auth0';

export async function GET(req) {
  try {
    // Handle the logout request
    return handleLogout(req, { returnTo: '/' });
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
}

// Dynamic: manipulates auth cookies
export const dynamic = 'force-dynamic';