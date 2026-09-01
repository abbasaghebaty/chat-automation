import { findAutomation } from "../services/keywordMatcher.js";
import { sendResponse } from "../services/responseService.js";

/**
 * Handler عمومی پیام متنی.
 *
 * این فایل قبلاً findResponse را import می‌کرد، درحالی‌که چنین exportای
 * در keywordMatcher وجود نداشت. حالا همان pipeline اصلی automation را
 * استفاده می‌کند تا این handler هم با معماری فعلی سازگار باشد.
 *
 * نکته: در bot.js فعلاً business_message handler ثبت شده است؛ بنابراین
 * این handler برای استفاده‌های آینده نگه داشته شده و dead import ندارد.
 */
export async function handleMessage(ctx) {
  const text = ctx.message?.text;

  if (!text) {
    return;
  }

  const automation = findAutomation(text);

  if (!automation) {
    return;
  }

  await sendResponse(ctx, automation);
}
