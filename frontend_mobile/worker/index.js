import isMobile from 'ismobilejs';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;

    if (
      pathname.startsWith('/open-app') ||
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/_expo/')
    ) {
      return env.ASSETS.fetch(request);
    }

    const { phone, tablet } = isMobile(request.headers.get('User-Agent') || '');

    if (phone || tablet) {
      return Response.redirect(new URL('/open-app', url).toString(), 302);
    }

    return env.ASSETS.fetch(request);
  },
};