import { initBotId } from 'botid/client/core';

// Define the paths that need bot protection.
// These are paths that are routed to by your app.
// These can be:
// - API endpoints (e.g., '/api/checkout')
// - Server actions invoked from a page (e.g., '/dashboard')
// - Dynamic routes (e.g., '/api/create/*')

initBotId({
  protect:
    [
      {
        "path": "/api/*",
        "method": "*"
      },
      {
        "path": "/sign-in",
        "method": "*"
      },
      {
        "path": "/sign-up",
        "method": "*"
      },
      {
        "path": "/dashboard",
        "method": "*"
      },
      {
        "path": "/forgot-password",
        "method": "*"
      },
      {
        "path": "/auth-code-error",
        "method": "*"
      },
      {
        "path": "/confirm-email",
        "method": "*"
      },
      {
        "path": "/update-password",
        "method": "*"
      }
    ]
  ,
});
