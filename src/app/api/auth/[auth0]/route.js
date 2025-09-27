import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  async login(req, res) {
    const host = req.headers.get("host") || "";

    const protocol = host.includes("localhost") ? "http" : "https";
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    console.log("REDIRECT_URI:", redirectUri);

    return handleLogin(req, res, {
      returnTo: "/chat",
      redirectUri,
    });
  },
});
