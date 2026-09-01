import { Bot, webhookCallback } from "grammy";

import { handleMessage } from "./handlers/messageHandler.js";

function createBot(token) {
  const bot = new Bot(token);

  bot.on("message:text", handleMessage);

  bot.catch((error) => {
    console.error("Bot error:", error);
  });

  return bot;
}

export default {
  async fetch(request, env) {
    // Health check
    if (request.method === "GET") {
      return new Response("Chat Automation Bot is running.");
    }

    if (!env.BOT_TOKEN) {
      return new Response("BOT_TOKEN is not configured.", {
        status: 500
      });
    }

    const bot = createBot(env.BOT_TOKEN);

    const handleUpdate = webhookCallback(
      bot,
      "cloudflare-mod"
    );

    return handleUpdate(request);
  }
};
