import { InlineKeyboard } from "grammy";
import { responses } from "../messages/responses.js";

function buildKeyboard(
  buttonRows = []
) {
  if (
    !Array.isArray(buttonRows) ||
    buttonRows.length === 0
  ) {
    return undefined;
  }

  const keyboard =
    new InlineKeyboard();

  let buttonCount = 0;

  for (
    let rowIndex = 0;
    rowIndex < buttonRows.length;
    rowIndex += 1
  ) {
    const row =
      buttonRows[rowIndex];

    if (!Array.isArray(row)) {
      continue;
    }

    for (const button of row) {
      if (!button?.text) {
        continue;
      }

      /**
       * callback button
       */
      if (button.callback_data) {
        keyboard.text(
          button.text,
          button.callback_data
        );

        if (button.style) {
          keyboard.style(
            button.style
          );
        }

        buttonCount += 1;
        continue;
      }

      /**
       * URL button
       */
      if (button.url) {
        keyboard.url(
          button.text,
          button.url
        );

        if (button.style) {
          keyboard.style(
            button.style
          );
        }

        buttonCount += 1;
      }
    }

    if (
      rowIndex <
      buttonRows.length - 1
    ) {
      keyboard.row();
    }
  }

  return buttonCount > 0
    ? keyboard
    : undefined;
}

export async function sendResponse(
  ctx,
  automation
) {
  const response =
    responses[
      automation?.response
    ];

  if (!response) {
    console.error(
      `Response not found for automation: ${
        automation?.id ?? "unknown"
      }`
    );

    return;
  }

  switch (response.type) {
    case "text": {
      const keyboard =
        buildKeyboard(
          response.buttons
        );

      const options = {
        parse_mode: "HTML",

        ...(keyboard
          ? {
              reply_markup:
                keyboard
            }
          : {})
      };

      await ctx.reply(
        response.text,
        options
      );

      return;
    }

    case "location": {
      const keyboard =
        buildKeyboard(
          response.buttons
        );

      const options = keyboard
        ? {
            reply_markup:
              keyboard
          }
        : undefined;

      await ctx.replyWithLocation(
        response.latitude,
        response.longitude,
        options
      );

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
