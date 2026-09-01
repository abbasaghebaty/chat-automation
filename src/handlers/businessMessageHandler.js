import { findAutomation } from "../services/keywordMatcher.js";
import { sendResponse } from "../services/responseService.js";

export async function handleBusinessMessage(ctx) {
  const message = ctx.businessMessage;

  if (!message) {
    return;
  }

  const text = message.text;

  if (!text) {
    return;
  }

  // اطلاعات اتصال Business
  const connection = await ctx.getBusinessConnection();

  if (!connection) {
    console.error("Business connection not found.");
    return;
  }

  // اگر پیام را خود صاحب اکانت فرستاده،
  // نباید Automation اجرا شود.
  if (ctx.from?.id === connection.user.id) {
    return;
  }

  // بررسی اینکه Bot اجازه پاسخ دارد یا نه
  if (!connection.rights?.can_reply) {
    console.log(
      `Cannot reply on business connection: ${connection.id}`
    );

    return;
  }

  const automation = findAutomation(text);

  if (!automation) {
    return;
  }

  await sendResponse(ctx, automation);
}
