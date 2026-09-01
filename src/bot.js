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
   * Telegram Business Messages
   */
  bot.on(
    "business_message",
    handleBusinessMessage
  );


  /**
   * بررسی لحظه‌ای ساعت کاری
   */
  bot.callbackQuery(
    "check_store_hours",
    async (ctx) => {

      try {

        const result =
          getStoreStatusPopup();


        await ctx.answerCallbackQuery({
          text:
            `${result.title}\n\n${result.message}`,

          show_alert: true
        });


      } catch (error) {

        console.error(
          "Store hours callback error:",
          error
        );


        await ctx.answerCallbackQuery({
          text:
            "خطا در بررسی ساعت کاری",

          show_alert: true
        });

      }
    }
  );


  bot.catch((error) => {

    console.error(
      "Bot error:",
      error
    );

  });


  return bot;
}



/**
 * بررسی Secret فقط اگر تنظیم شده باشد
 *
 * اگر WEBHOOK_SECRET وجود نداشت:
 * ربات همچنان کار می‌کند.
 *
 * اگر وجود داشت:
 * درخواست‌های جعلی رد می‌شوند.
 */
function isAuthorizedWebhook(
  request,
  env
) {

  if (!env.WEBHOOK_SECRET) {

    return true;

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
     * فقط POST
     */
    if (
      request.method !== "POST"
    ) {

      return new Response(
        "Method Not Allowed",
        {
          status: 405
        }
      );

    }



    if (!env.BOT_TOKEN) {

      console.error(
        "BOT_TOKEN missing"
      );


      return new Response(
        "BOT_TOKEN missing",
        {
          status: 500
        }
      );

    }



    /**
     * بررسی webhook secret
     *
     * فقط وقتی Secret فعال شده باشد.
     */
    if (
      !isAuthorizedWebhook(
        request,
        env
      )
    ) {

      console.error(
        "Unauthorized webhook request"
      );


      return new Response(
        "Unauthorized",
        {
          status: 401
        }
      );

    }



    const bot =
      createBot(
        env.BOT_TOKEN
      );



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
