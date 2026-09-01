import { InlineKeyboard } from "grammy";
import { responses } from "../messages/responses.js";

/**
 * ============================================================
 * ساخت Inline Keyboard
 * ============================================================
 *
 * این تابع دو نوع دکمه را پشتیبانی می‌کند:
 *
 * 1) url
 *    برای باز کردن لینک
 *
 * 2) callback_data
 *    برای اجرای action داخل خود Bot
 *
 * style: primary
 *    رنگ/استایل آبی استاندارد Telegram
 * ============================================================
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

      /**
       * --------------------------------------------------------
       * دکمه callback
       * --------------------------------------------------------
       */
      if (button.callback_data) {
        keyboard.text(
          button.text,
          button.callback_data
        );

        if (button.style) {
          keyboard.style(button.style);
        }

        buttonCount += 1;
        continue;
      }

      /**
       * --------------------------------------------------------
       * دکمه URL
       * --------------------------------------------------------
       */
      if (button.url) {
        keyboard.url(
          button.text,
          button.url
        );

        if (button.style) {
          keyboard.style(button.style);
        }

        buttonCount += 1;
      }
    }

    /**
     * اگر ردیف دیگری وجود دارد،
     * وارد ردیف جدید کیبورد می‌شویم.
     */
    if (rowIndex < buttonRows.length - 1) {
      keyboard.row();
    }
  }

  return buttonCount > 0
    ? keyboard
    : undefined;
}

/**
 * ============================================================
 * ارسال response
 * ============================================================
 */
export async function sendResponse(ctx, automation) {
  const response = responses[automation?.response];

  if (!response) {
    console.error(
      `Response not found: ${automation?.response}`
    );

    return;
  }

  switch (response.type) {
    /**
     * --------------------------------------------------------
     * پیام متنی
     * --------------------------------------------------------
     */
    case "text": {
      const keyboard = buildKeyboard(
        response.buttons
      );

      const options = {
        parse_mode: "HTML",

        ...(keyboard
          ? { reply_markup: keyboard }
          : {})
      };

      await ctx.reply(
        response.text,
        options
      );

      return;
    }

    /**
     * --------------------------------------------------------
     * لوکیشن
     * --------------------------------------------------------
     */
    case "location": {
      const keyboard = buildKeyboard(
        response.buttons
      );

      const options = keyboard
        ? { reply_markup: keyboard }
        : undefined;

      /**
       * در Business Context، grammY خودش context مربوط
       * به Business Connection را مدیریت می‌کند.
       */
      await ctx.replyWithLocation(
        response.latitude,
        response.longitude,
        options
      );

      /**
       * اگر متن هم تعریف شده باشد،
       * بعد از لوکیشن ارسال می‌شود.
       */
      if (response.text) {
        await ctx.reply(
          response.text,
          {
            parse_mode: "HTML"
          }
        );
      }

      return;
    }

    default:
      console.error(
        `Unknown response type: ${response.type}`
      );
  }
}
