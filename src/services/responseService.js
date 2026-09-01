import { InlineKeyboard } from "grammy";
import { responses } from "../messages/responses.js";

/**
 * ساخت Inline Keyboard از تنظیمات response.
 *
 * style: primary یعنی استایل استاندارد آبی تلگرام.
 * این تابع فقط URL buttonهای فعلی پروژه را می‌سازد تا ساختار config ساده بماند.
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
      if (!button?.text || !button?.url) {
        continue;
      }

      keyboard.url(button.text, button.url);

      // style باید بلافاصله بعد از ساخت همان دکمه اعمال شود.
      if (button.style) {
        keyboard.style(button.style);
      }

      buttonCount += 1;
    }

    if (rowIndex < buttonRows.length - 1) {
      keyboard.row();
    }
  }

  return buttonCount > 0 ? keyboard : undefined;
}

/**
 * پاسخ را بر اساس نوع آن ارسال می‌کند.
 *
 * نکته مهم: برای متن‌هایی که لینک Markdown دارند، parse_mode باید Markdown باشد؛
 * وگرنه [@Shoma\_shop](...) به‌صورت متن خام نمایش داده می‌شود.
 * اگر response دکمه هم داشته باشد، همان دکمه‌ها زیر پیام قرار می‌گیرند.
 */
export async function sendResponse(ctx, automation) {
  const response = responses[automation?.response];

  if (!response) {
    console.error(`Response not found: ${automation?.response}`);
    return;
  }

  switch (response.type) {
    case "text": {
      const keyboard = buildKeyboard(response.buttons);
      const options = {
        parse_mode: "Markdown",
        ...(keyboard ? { reply_markup: keyboard } : {})
      };

      await ctx.reply(response.text, options);
      return;
    }

    case "location": {
      const keyboard = buildKeyboard(response.buttons);
      const options = keyboard ? { reply_markup: keyboard } : undefined;

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
