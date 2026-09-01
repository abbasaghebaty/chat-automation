import { Bot, webhookCallback } from "grammy";

import { handleBusinessMessage } from "./handlers/businessMessageHandler.js";
import { handleBusinessConnection } from "./handlers/businessConnectionHandler.js";

/**
 * ساخت نمونه Bot.
 *
 * این تابع همه handlerهای مربوط به Telegram Business را ثبت می‌کند.
 * چون Worker ممکن است روی چند درخواست اجرا شود، ساخت bot عمداً بدون
 * نگهداری state حساس انجام می‌شود و توکن فقط از env خوانده می‌شود.
 */
function createBot(token) {
  const bot = new Bot(token);

  // رویداد ایجاد/ویرایش/فعال یا غیرفعال شدن Business Connection.
  bot.on("business_connection", handleBusinessConnection);

  // پیام‌های ورودی چت‌هایی که توسط Business Bot مدیریت می‌شوند.
  bot.on("business_message", handleBusinessMessage);

  // جلوگیری از سقوط پردازش به‌دلیل خطاهای handlerها.
  bot.catch((err) => {
    console.error("Bot error:", err);
  });

  return bot;
}

export default {
  /**
   * ورودی اصلی Cloudflare Worker.
   *
   * GET: health check ساده برای تست Worker.
   * POST: فقط webhook تلگرام.
   * متدهای دیگر: 405.
   */
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Chat Automation Worker is running.");
    }

    if (request.method !== "POST") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, POST" }
      });
    }

    // BOT_TOKEN تنها secret اجباری برنامه است.
    if (!env.BOT_TOKEN) {
      console.error("BOT_TOKEN is missing.");

      return new Response("BOT_TOKEN is not configured.", {
        status: 500
      });
    }

    // ساخت bot برای هر request در Worker قابل‌قبول است و با مدل اجرای
    // stateless Cloudflare سازگار است.
    const bot = createBot(env.BOT_TOKEN);

    // Secret Token اختیاری است تا deploymentهای فعلی بدون تغییر نشکنند.
    // در محیط production توصیه می‌شود WEBHOOK_SECRET تنظیم و در setWebhook
    // هم همین secret استفاده شود.
    if (env.WEBHOOK_SECRET) {
      const receivedSecret = request.headers.get("X-Telegram-Bot-Api-Secret-Token");

      if (receivedSecret !== env.WEBHOOK_SECRET) {
        return new Response("Unauthorized", { status: 401 });
      }
    }

    const handleUpdate = webhookCallback(bot, "cloudflare-mod");
    return handleUpdate(request);
  }
};
