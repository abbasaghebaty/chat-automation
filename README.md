# chat-automation

Telegram Business chat automation running on Cloudflare Workers with grammY.

## Architecture

- `src/bot.js`: Cloudflare Worker entry point and Telegram webhook setup.
- `src/config/automation.js`: keyword/rule definitions and priorities.
- `src/handlers/businessMessageHandler.js`: processing of Telegram Business messages.
- `src/handlers/businessConnectionHandler.js`: logging Business Connection state.
- `src/handlers/messageHandler.js`: generic text handler kept compatible with the same automation pipeline.
- `src/services/keywordMatcher.js`: Persian text normalization and rule matching.
- `src/services/responseService.js`: converts response config into Telegram messages/keyboards.
- `src/messages/responses.js`: actual responses used by the automations.

## Environment variables

`BOT_TOKEN` is required.

`WEBHOOK_SECRET` is optional for backward compatibility, but production deployments should set it and configure the same value as Telegram's webhook `secret_token`.

## Local development

```bash
npm install
npm run dev
```

## Deployment

```bash
npm run deploy
```

Set the bot token as a Cloudflare Worker secret instead of committing `.env` files:

```bash
npx wrangler secret put BOT_TOKEN
```

For webhook security:

```bash
npx wrangler secret put WEBHOOK_SECRET
```

## Automation format

Each rule in `src/config/automation.js` points to one key in `src/messages/responses.js`:

```js
{
  id: "hello",
  enabled: true,
  keywords: ["سلام", "درود"],
  response: "hello",
  priority: 10
}
```

The `response` key must exist in `responses`. A missing key is treated as a configuration error and no message is sent.

## Important Business requirements

The Telegram Business account must grant the bot the `can_reply` permission. grammY uses the business message context so replies can be sent on behalf of the connected Business account.
