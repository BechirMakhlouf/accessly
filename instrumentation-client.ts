import { initBotId } from 'botid/client/core';

initBotId({
  protect: [
    //TODO: deal with bot checks on api routes
    // {
    //   path: '/api/(?!auth/callback).*',
    //   method: '*',
    // },
    { path: '/sign-in', method: '*' },
    { path: '/sign-up', method: '*' },
    { path: '/dashboard', method: '*' },
    { path: '/forgot-password', method: '*' },
    { path: '/auth-code-error', method: '*' },
    { path: '/confirm-email', method: '*' },
    { path: '/update-password', method: '*' },
  ],
});
