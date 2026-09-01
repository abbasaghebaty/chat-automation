import {
  Bot,
  webhookCallback
} from "grammy";

import {
  handleBusinessMessage
} from "./handlers/businessMessageHandler.js";

import {
  handleBusinessConnection
} from "./handlers/businessConnectionHandler.js";

import {
  getStoreStatusPopup
} from "./services/storeHoursService.js";

/**
 * ساخت Bot و ثبت handlerها.
 */
function createBot(token) {
  const bot = new Bot(token);

  /**
   * Telegram Business Connection
   */
  bot.on(
    "business_connection",
    handleBusinessConnection
  );

  /**
   * Telegram Business messages
   */
  bot.on(
    "business_message",
    handleBusinessMessage
  );

  /**
   * بررسی لحظه‌ای ساعت کاری.
   *
   * پیام اصلی edit نمی‌شود.
   * وضعیت فقط هنگام کلیک محاسبه می‌شود.
   */
  bot.callbackQuery(
    "check_store_hours",
    async (ctx) => {
      try {
        const result =
          getStoreStatusPopup();

        await ctx.answerCallbackQuery(
          {
            text:
              `${result.title}\n\n${result.message}`,

            show_alert:
              true
          }
        );
      } catch (error) {
        console.error(
          "Store hours callback failed:",
          error
        );

        /**
         * حتی در صورت خطا،
         * Telegram را از حالت loading خارج کن.
         */
        try {
          await ctx.answerCallbackQuery(
            {
              text:
                "امکان بررسی ساعت کاری وجود نداشت.",

              show_alert:
                true
            }
          );
        } catch (
          callbackError
        ) {
          console.error(
            "Failed to answer store-hours callback:",
            callbackError
          );
        }
      }
    }
  );

  /**
   * خطای عمومی Bot
   */
  bot.catch((error) => {
    console.error(
      "Bot error:",
      error
    );
  });

  return bot;
}

/**
 * بررسی امنیت webhook.
 */
function isAuthorizedWebhook(
  request,
  env
) {
  if (!env.WEBHOOK_SECRET) {
    return false;
  }

  const receivedSecret =
    request.headers.get(
      "X-Telegram-Bot-Api-Secret-Token"
    );

  return (
    receivedSecret ===
    env.WEBHOOK_SECRET
  );
}

export default {
  async fetch(
    request,
    env
  ) {
    /**
     * Health check
     */
    if (
      request.method === "GET"
    ) {
      return new Response(
        "Chat Automation Worker is running."
      );
    }

    /**
     * فقط POST برای webhook
     */
    if (
      request.method !== "POST"
    ) {
      return new Response(
        "Method Not Allowed",
        {
          status: 405,

          headers: {
            Allow:
              "GET, POST"
          }
        }
      );
    }

    /**
     * BOT_TOKEN
     */
    if (!env.BOT_TOKEN) {
      console.error(
        "BOT_TOKEN is missing."
      );

      return new Response(
        "BOT_TOKEN is not configured.",
        {
          status: 500
        }
      );
    }

    /**
     * WEBHOOK_SECRET
     */
    if (
      !env.WEBHOOK_SECRET
    ) {
      console.error(
        "WEBHOOK_SECRET is missing."
      );

      return new Response(
        "WEBHOOK_SECRET is not configured.",
        {
          status: 500
        }
      );
    }

    /**
     * جلوگیری از درخواست‌های جعلی
     */
    if (
      !isAuthorizedWebhook(
        request,
        env
      )
    ) {
      return new Response(
        "Unauthorized",
        {
          status: 401
        }
      );
    }

    /**
     * ساخت Bot
     */
    const bot =
      createBot(
        env.BOT_TOKEN
      );

    /**
     * اتصال webhook به Cloudflare Workers
     */
    const handleUpdate =
      webhookCallback(
        bot,
        "cloudflare-mod"
      );

    return handleUpdate(
      request
    );
  }
};
