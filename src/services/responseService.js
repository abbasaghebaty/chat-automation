```js
import { InlineKeyboard } from "grammy";
import { responses } from "../messages/responses.js";

export async function sendResponse(ctx, automation) {
  const response = responses[automation.response];

  if (!response) {
    console.error(`Response not found: ${automation.response}`);
    return;
  }

  // پاسخ متنی
  if (response.type === "text") {
    await ctx.reply(response.text);
    return;
  }

  // پاسخ لوکیشن
  if (response.type === "location") {
    const keyboard = response.buttons?.length
      ? InlineKeyboard.from(response.buttons)
      : undefined;

    // ارسال لوکیشن به همراه دکمه‌ها
    await ctx.replyWithLocation(
      response.latitude,
      response.longitude,
      {
        reply_markup: keyboard
      }
    );

    // ارسال توضیح آدرس در پیام بعدی
    if (response.text) {
      await ctx.reply(response.text);
    }

    return;
  }

  console.error(`Unknown response type: ${response.type}`);
}
```
