import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { etag } from 'hono/etag';
import { logger } from 'hono/logger';
import { env } from './lib/env';
import { supabaseMiddleware } from './middlewares/supabaseMiddleware';
import { slackRoute } from './routes/slack.routes';

const app = new Hono();

app.use('*', etag(), logger(), supabaseMiddleware());

app.get('/health', () => new Response(null, { status: 200 }));
app.get('/noya', c => c.text('aaa noyaaa!'));
app.route('/slack', slackRoute);

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  info => {
    console.log(
      `Server is running on port ${info.port} in ${env.NODE_ENV} environment`
    );
  }
);
