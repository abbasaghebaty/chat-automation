import "dotenv/config";
import { Bot } from "grammy";

import { handleMessage } from "./handlers/messageHandler.js";

const bot = new Bot(process.env.BOT_TOKEN);

bot.on("message:text", handleMessage);

bot.catch((error) => {
  console.error("Bot error:", error);
});

console.log("Bot is running...");

bot.start();
