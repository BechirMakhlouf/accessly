import { WebClient, ConversationsCreateResponse } from '@slack/web-api';
import { env } from '../lib/env';

const token = env.SLACK_BOT_TOKEN;

export const slackClient = new WebClient(token);

type SlackResult<T> = {
  ok: boolean;
  data?: T;
  error?: unknown;
};

export async function sendSlackMessage(
  text: string,
  channel: string
): Promise<SlackResult<{ ts: string }>> {
  try {
    const res = await slackClient.chat.postMessage({ channel, text });
    return { ok: true, data: { ts: res.ts! } };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function createSlackChannel(
  name: string
): Promise<SlackResult<{ id?: string; name?: string }>> {
  try {
    const res: ConversationsCreateResponse =
      await slackClient.conversations.create({ name });
    return {
      ok: res.ok ?? false,
      data: { id: res.channel?.id, name: res.channel?.name },
      error: res.error,
    };
  } catch (error) {
    return { ok: false, error };
  }
}

export async function listSlackChannels(): Promise<
  SlackResult<{ channels?: any[] }>
> {
  try {
    const res = await slackClient.conversations.list();
    return {
      ok: res.ok ?? false,
      data: { channels: res.channels },
      error: res.error,
    };
  } catch (error) {
    return { ok: false, error };
  }
}
export async function listSlackMessages(channel: string, limit = 20) {
  try {
    const res = await slackClient.conversations.history({
      channel,
      limit,
    });
    return {
      ok: res.ok ?? false,
      data: { messages: res.messages },
      error: res.error,
    };
  } catch (error) {
    return { ok: false, error };
  }
}
