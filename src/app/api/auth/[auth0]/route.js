import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  async login(req, res) {
    return handleLogin(req, res, {
      returnTo: '/chat',
    });
  },
});
