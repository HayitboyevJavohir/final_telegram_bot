import { config } from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import mongoose from "mongoose";

import onStart from "./src/bot/handlers/onStart.js";
import onRegister from "./src/bot/handlers/onRegister.js";
import User from "./src/models/User.js";

config();

const TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID || "875072364";

export const bot = new TelegramBot(TOKEN, { polling: true });

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected..."))
  .catch((err) => console.log("DB connection error:", err));


async function handleBroadcast(msg) {
  const chatId = msg.chat.id.toString();
  const text = msg.text;

  if (chatId !== ADMIN_ID) return false;

  if (text.toLowerCase() === "broadcast") {
    await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { action: "broadcast" } },
      { new: true, upsert: true }
    );

    await bot.sendMessage(chatId, "Endi yozgan matningiz barcha foydalanuvchilarga yuboriladi. Matn kiriting:");
    return true;
  }

  const adminUser = await User.findOne({ telegramId: chatId });
  if (adminUser?.action === "broadcast") {
    const allUsers = await User.find({});
    for (const u of allUsers) {
      if (u.telegramId === chatId) continue;
      try {
        await bot.sendMessage(u.telegramId, text);
      } catch (err) {
        console.log(`Xabar yuborilmadi: ${u.telegramId}`, err.message);
      }
    }

    await bot.sendMessage(chatId, "Xabar barcha foydalanuvchilarga yuborildi ✅");

    await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { action: "start" } }
    );
    return true;
  }

  return false;
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id.toString();
  const text = msg.text;
  const firstName = msg.chat.first_name;


  const broadcastHandled = await handleBroadcast(msg);
  if (broadcastHandled) return;


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
      `Yangi xabar 🔔 \n\n🔘 Ismi: ${user.name}\n🔘 Tel: ${text}`
    );
    return;
  }

  return bot.sendMessage(chatId, "Kutilmagan xatolik... /start bosing!");
});

console.log("Bot ishga tushdi");
