import { handleLogin } from '@auth0/nextjs-auth0';

export async function GET(req) {
  const host = req.headers.get("host") || "";
  const protocol = host.includes("localhost") ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth/callback`;

  // Get invitation parameter if exists
  const url = new URL(req.url);
  const invitation = url.searchParams.get('invitation');

  console.log("Login request:", { host, protocol, redirectUri, invitation });

  try {
    return handleLogin(req, {
      returnTo: "/chat",
      redirectUri,
      authorizationParams: {
        // Pass invitation code to state if present
        ...(invitation && { state: invitation }),
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
}