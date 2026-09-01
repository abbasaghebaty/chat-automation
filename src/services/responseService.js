
import { InlineKeyboard } from "grammy";
import { responses } from "../messages/responses.js";

export async function sendResponse(ctx, automation) {
  const response = responses[automation.response];

  if (!response) {
    console.error(`Response not found: ${automation.response}`);
    return;
  }

  if (response.type === "text") {
    await ctx.reply(response.text);
    return;
  }

  if (response.type === "location") {
    const keyboard = response.buttons?.length
      ? InlineKeyboard.from(response.buttons)
      : undefined;

    await ctx.replyWithLocation(
      response.latitude,
      response.longitude,
      {
        reply_markup: keyboard
      }
    );

    if (response.text) {
      await ctx.reply(response.text);
    }

    return;
  }

  console.error(`Unknown response type: ${response.type}`);
}
```
