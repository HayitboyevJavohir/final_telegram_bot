import { config } from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";

import onStart from "./src/bot/handlers/onStart.js";
import onProfile from "./src/bot/handlers/onProfile.js";
import onRegister from "./src/bot/handlers/onRegister.js";
import User from "./src/models/User.js";

config();

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = 875072364;

export const bot = new TelegramBot(TOKEN, { polling: true });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected..."))
  .catch((err) => console.log("DB connection error:", err));

bot.on("message", async (msg) => {
  const chatId = msg.chat.id.toString();
  const text = msg.text;

  if (text === "/start") return onStart(msg, bot);
  if (text === "✍️ Ro‘yxatdan o‘tish") return onRegister(msg, bot);

  const user = await User.findOne({ telegramId: chatId });
  if (!user) return bot.sendMessage(chatId, "Iltimos /start bosing!");

  console.log("action:", user.action);

  if (user.action === "awaiting_name") {
    await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { action: "awaiting_phone", name: text } },
      { new: true }
    );
    return bot.sendMessage(chatId, "Telefon raqamingizni kiriting:");
  }

  if (user.action === "awaiting_phone") {
    await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { action: "finish_register", phone: text } },
      { new: true }
    );

    bot.sendMessage(chatId, `Tabriklaymiz, siz muvaffaqiyatli ro'yhatdan o'tdingiz ✅`);
    bot.sendMessage(chatId, `Name: ${user.name}\nPhone: ${text}`);
    bot.sendMessage(
      ADMIN_ID,
      `Yangi xabar 🔔 \n\n🔘 ismi: ${user.name}\n🔘 tel: ${text}`
    );
    return;
  }

  return bot.sendMessage(chatId, "Kutilmagan xatolik... /start bosing!");
});

console.log("Bot ishga tushdi");
