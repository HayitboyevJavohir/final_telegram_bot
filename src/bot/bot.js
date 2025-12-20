import { config } from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import onStart from "./handlers/onStart.js";
import onProfile from "./handlers/onProfile.js";
import onRegister from "./handlers/onRegister.js";
import User from "../models/User.js";

config();

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = 875072364;

export const bot = new TelegramBot(TOKEN, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id.toString();
  const text = msg.text;

  // Ro'yxatdan o'tish
  if (text == "✍️ Ro‘yxatdan o‘tish") {
    return onRegister(msg, bot);
  }

  let user = await User.findOne({ telegramId: chatId });
  if (!user) return bot.sendMessage(chatId, "Iltimos /start bosing!");

  console.log("action:::: ", user.action);

  if (user.action == "awaiting_name") {
    user = await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { action: "awaiting_phone", name: text } },
      { new: true }
    );

    return bot.sendMessage(chatId, `Telefon raqamingizni kiriting:`);
  }

  if (user.action == "awaiting_phone") {
    user = await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { action: "finish_register", phone: text } },
      { new: true }
    );

    bot.sendMessage(
      chatId,
      `Tabriklaymiz, siz muvaffaqiyatli ro'yhatdan o'tdingiz ✅`
    );

    bot.sendMessage(chatId, `Name: ${user.name}\nPhone: ${text}`);

    bot.sendMessage(
      ADMIN_ID,
      `Yangi xabar 🔔 \n\n🔘 ismi: ${user.name}\n🔘 tel: ${text}`
    );

    return;
  }

  return bot.sendMessage(chatId, `Kutilmagan xatolik... /start bosing!`);
});

