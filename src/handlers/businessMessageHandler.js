import { findAutomation } from "../services/keywordMatcher.js";
import { sendResponse } from "../services/responseService.js";

/**
 * پردازش پیام مشتری در Telegram Business.
 */
export async function handleBusinessMessage(
  ctx
) {
  const message =
    ctx.businessMessage;

  const text =
    message?.text;

  /**
   * فقط پیام متنی.
   */
  if (!text) {
    return;
  }

  /**
   * دریافت Business Connection فعلی.
   */
  const connection =
    await ctx.getBusinessConnection();

  if (!connection) {
    console.error(
      "Business connection not found."
    );

    return;
  }

  /**
   * اتصال غیرفعال است.
   */
  if (!connection.is_enabled) {
    console.log(
      `Business connection disabled: ${connection.id}`
    );

    return;
  }

  /**
   * پیام صاحب اکانت Business را پاسخ نده.
   */
  if (
    ctx.from?.id ===
    connection.user.id
  ) {
    return;
  }

  /**
   * ربات باید مجوز can_reply داشته باشد.
   */
  if (
    !connection.rights?.can_reply
  ) {
    console.log(
      `Cannot reply on business connection: ${connection.id}`
    );

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
