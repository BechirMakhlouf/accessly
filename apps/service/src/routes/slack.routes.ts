import { Hono } from "hono";

import {
  createSlackChannel,
  listSlackChannels,
  listSlackMessages,
  sendSlackMessage,
} from "../services/slack";

export const slackRoute = new Hono();

slackRoute.post("/message/:channel", async (c) => {
  const channel = c.req.param("channel");

  let body: { message?: string };
  try {
    body = await c.req.json<{ message?: string }>();
  } catch {
    return c.json({ error: "Invalid or missing JSON body" }, 400);
  }

  if (!body.message || body.message.trim() === "") {
    return c.json({ error: "Message is required" }, 400);
  }

  const result = await sendSlackMessage(body.message, channel);

  if (!result.ok) return c.json({ error: result.error }, 400);

  return c.json({ status: "Message sent", channel, ts: result.data?.ts });
});

slackRoute.get("/messages/:channel", async (c) => {
  const channel = c.req.param("channel");
  const limitParam = c.req.query("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  const result = await listSlackMessages(channel, limit);

  if (!result.ok) return c.json({ error: result.error }, 400);

  return c.json({ channel, messages: result.data?.messages });
});

slackRoute.post("/channel", async (c) => {
  const { name } = await c.req.json<{ name: string }>();
  if (!name) return c.json({ error: "Channel name is required" }, 400);

  const result = await createSlackChannel(name);
  if (!result.ok) return c.json({ error: result.error }, 400);

  return c.json({ status: "Channel created", ...result.data });
});

slackRoute.get("/channels", async (c) => {
  const result = await listSlackChannels();
  if (!result.ok) return c.json({ error: result.error }, 400);

  return c.json({ channels: result.data?.channels });
});

slackRoute.get("/callback", async (c) => {
  try {
    const code = c.req.query("code");
    if (!code) {
      return c.json({ error: "Missing code parameter" }, 400);
    }

    const supabase = c.get("supabase");
    if (!supabase || !supabase.auth) {
      return c.json({ error: "Supabase client not found in context" }, 500);
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Error while exchanging code for token:", error);
      return c.json({
        error: "Failed to exchange code for session",
        details: error.message || error,
      }, 500);
    }

    // Optionally, set a cookie with the session if needed
    // c.header('Set-Cookie', `sb-access-token=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`);

    return c.json({
      message: "Successfully exchanged code for session",
    });
  } catch (err) {
    console.error("Unexpected error in /slack/callback:", err);
    return c.json({
      error: "Internal server error",
      details: err instanceof Error ? err.message : err,
    }, 500);
  }
});
