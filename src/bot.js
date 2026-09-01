import { Bot, webhookCallback } from "grammy";

import { handleBusinessMessage } from "./handlers/businessMessageHandler.js";
import { handleBusinessConnection } from "./handlers/businessConnectionHandler.js";

function createBot(token) {
  const bot = new Bot(token);

  // وقتی ربات به اکانت Business وصل/قطع یا تنظیماتش تغییر شود
  bot.on("business_connection", handleBusinessConnection);

  // پیام‌های چت‌های مدیریت‌شده توسط Business Bot
  bot.on("business_message", handleBusinessMessage);

  bot.catch((err) => {
    console.error("Bot error:", err);
  });

  return bot;
}

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Chat Automation Worker is running.");
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405
      });
    }

    if (!env.BOT_TOKEN) {
      console.error("BOT_TOKEN is missing.");

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
