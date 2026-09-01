import { findAutomation } from "../services/keywordMatcher.js";
import { sendResponse } from "../services/responseService.js";

/**
 * پردازش پیام مشتری در چت Business.
 *
 * مراحل:
 * 1) فقط پیام متنی را پردازش می‌کنیم.
 * 2) Business Connection فعلی را می‌گیریم تا مالک و مجوز پاسخ مشخص باشد.
 * 3) پیام خود صاحب اکانت را نادیده می‌گیریم تا loop ایجاد نشود.
 * 4) مجوز can_reply بررسی می‌شود.
 * 5) مناسب‌ترین automation پیدا و پاسخ ارسال می‌شود.
 */
export async function handleBusinessMessage(ctx) {
  const message = ctx.businessMessage;
  const text = message?.text;

  if (!text) {
    return;
  }

  const connection = await ctx.getBusinessConnection();

  if (!connection) {
    console.error("Business connection not found.");
    return;
  }

  // پیام‌هایی که خود صاحب اکانت Business فرستاده نباید دوباره پاسخ خودکار بگیرند.
  if (ctx.from?.id === connection.user.id) {
    return;
  }

  // Telegram فقط در صورت داشتن can_reply اجازه ارسال پاسخ از طرف Business را می‌دهد.
  if (!connection.rights?.can_reply) {
    console.log(`Cannot reply on business connection: ${connection.id}`);
    return;
  }

  const automation = findAutomation(text);

  if (!automation) {
    return;
  }

  await sendResponse(ctx, automation);
}
