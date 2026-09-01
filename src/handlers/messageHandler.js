import { findAutomation } from "../services/keywordMatcher.js";
import { sendResponse } from "../services/responseService.js";

/**
 * Handler عمومی پیام متنی.
 *
 * برای استفاده‌های غیر-Business
 * یا توسعه‌های آینده نگه داشته شده است.
 */
export async function handleMessage(
  ctx
) {
  const text =
    ctx.message?.text;

  if (!text) {
    return;
  }

  const automation =
    findAutomation(text);

  if (!automation) {
    return;
  }

  await sendResponse(
    ctx,
    automation
  );
}
