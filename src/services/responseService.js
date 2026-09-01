import { InlineKeyboard } from "grammy";
import { responses } from "../messages/responses.js";

/**
 * ساخت inline keyboard از config ساده‌ی پروژه.
 *
 * به‌جای عبور مستقیم object خام به grammY، buttonها با API رسمی InlineKeyboard
 * ساخته می‌شوند تا shape نهایی کاملاً مشخص و قابل کنترل باشد.
 */
function buildKeyboard(buttonRows = []) {
  if (!Array.isArray(buttonRows) || buttonRows.length === 0) {
    return undefined;
  }

  const keyboard = new InlineKeyboard();
  let buttonCount = 0;

  for (let rowIndex = 0; rowIndex < buttonRows.length; rowIndex += 1) {
    const row = buttonRows[rowIndex];

    if (!Array.isArray(row)) {
      continue;
    }

    for (const button of row) {
      if (!button?.text) {
        continue;
      }

      // فعلاً config فقط URL button دارد؛ این branch عمداً محدود نگه داشته شده.
      if (button.url) {
        keyboard.url(button.text, button.url);
        buttonCount += 1;

        // grammY style() همیشه روی آخرین دکمه اضافه‌شده اعمال می‌شود.
        // بنابراین باید بلافاصله بعد از url() فراخوانی شود.
        if (button.style) {
          keyboard.style(button.style);
        }
      }
    }

    if (rowIndex < buttonRows.length - 1) {
      keyboard.row();
    }
  }

  return buttonCount > 0 ? keyboard : undefined;
}

/**
 * ارسال پاسخ بر اساس نوع response.
 *
 * grammY برای business_message، context shortcutها را به business connection
 * مربوط می‌کند؛ بنابراین ctx.reply و ctx.replyWithLocation می‌توانند از طرف
 * همان Business Account ارسال شوند، مشروط به داشتن can_reply.
 */
export async function sendResponse(ctx, automation) {
  const response = responses[automation?.response];

  if (!response) {
    console.error(`Response not found: ${automation?.response}`);
    return;
  }

  switch (response.type) {
    case "text":
      await ctx.reply(response.text);
      return;

    case "location": {
      const keyboard = buildKeyboard(response.buttons);
      const options = keyboard
        ? { reply_markup: keyboard }
        : undefined;

      await ctx.replyWithLocation(
        response.latitude,
        response.longitude,
        options
      );

      if (response.text) {
        await ctx.reply(response.text);
      }
      return;
    }

    default:
      console.error(`Unknown response type: ${response.type}`);
  }
}
