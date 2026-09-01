import { Bot, webhookCallback } from "grammy";

import { handleBusinessMessage } from "./handlers/businessMessageHandler.js";
import { handleBusinessConnection } from "./handlers/businessConnectionHandler.js";

import {
  getStoreStatusPopup
} from "./services/storeHoursService.js";

/**
 * ============================================================
 * ساخت Bot
 * ============================================================
 */
function createBot(token) {
  const bot = new Bot(token);

  /**
   * ----------------------------------------------------------
   * Business Connection
   * ----------------------------------------------------------
   */
  bot.on(
    "business_connection",
    handleBusinessConnection
  );

  /**
   * ----------------------------------------------------------
   * پیام‌های Business
   * ----------------------------------------------------------
   */
  bot.on(
    "business_message",
    handleBusinessMessage
  );

  /**
   * ==========================================================
   * بررسی لحظه‌ای ساعت کاری
   * ==========================================================
   *
   * این handler زمانی اجرا می‌شود که کاربر روی:
   *
   * «الان فروشگاه بازه؟»
   *
   * کلیک کند.
   *
   * وضعیت در همان لحظه محاسبه می‌شود.
   *
   * پیام اصلی دست‌کاری نمی‌شود.
   * هیچ message edit انجام نمی‌دهیم.
   *
   * answerCallbackQuery با show_alert=true باعث می‌شود
   * نتیجه به‌صورت popup روی صفحه کاربر نمایش داده شود.
   * ==========================================================
   */
  bot.callbackQuery(
    "check_store_hours",
    async (ctx) => {
      try {
        const result = getStoreStatusPopup();

        await ctx.answerCallbackQuery({
          text:
            `${result.title}\n\n${result.message}`,

          /**
           * true یعنی یک popup بزرگ‌تر به کاربر نشان بده.
           *
           * false باشد، پاسخ کوچک و موقتی بالای صفحه نمایش داده می‌شود.
           */
          show_alert: true
        });
      } catch (error) {
        console.error(
          "Store hours callback failed:",
          error
        );

        /**
         * حتی در صورت خطا هم callback باید answer شود
         * تا Telegram حالت loading را متوقف کند.
         */
        await ctx.answerCallbackQuery({
          text:
            "امکان بررسی ساعت کاری وجود نداشت.",
          show_alert: true
        });
      }
    }
  );

  /**
   * ----------------------------------------------------------
   * خطاهای Bot
   * ----------------------------------------------------------
   */
  bot.catch((err) => {
    console.error(
      "Bot error:",
      err
    );
  });

  return bot;
}

/**
 * ============================================================
 * Cloudflare Worker
 * ============================================================
 */
export default {
  async fetch(request, env) {
    /**
     * Health check
     */
    if (request.method === "GET") {
      return new Response(
        "Chat Automation Worker is running."
      );
    }

    /**
     * فقط POST برای webhook
     */
    if (request.method !== "POST") {
      return new Response(
        "Method Not Allowed",
        {
          status: 405
        }
      );
    }

    /**
     * بررسی Token
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
     * ساخت bot
     */
    const bot = createBot(
      env.BOT_TOKEN
    );

    /**
     * اتصال webhook به Cloudflare Workers
     */
    const handleUpdate = webhookCallback(
      bot,
      "cloudflare-mod"
    );

    return handleUpdate(
      request
    );
  }
};
