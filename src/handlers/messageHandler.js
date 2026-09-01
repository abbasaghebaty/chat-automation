import { findResponse } from "../services/keywordMatcher.js";
import { responses } from "../messages/responses.js";

export async function handleMessage(ctx) {
  const text = ctx.message?.text;

  if (!text) {
    return;
  }

  const responseKey = findResponse(text);

  if (!responseKey) {
    return;
  }

  const response = responses[responseKey];

  if (!response) {
    console.error(`Response not found: ${responseKey}`);
    return;
  }

  await ctx.reply(response);
}
