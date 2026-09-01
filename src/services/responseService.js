import { responses } from "../messages/responses.js";

export async function sendResponse(ctx, automation) {
  const response = responses[automation.response];

  if (!response) {
    console.error(`Response not found: ${automation.response}`);
    return;
  }

  await ctx.reply(response);
}
