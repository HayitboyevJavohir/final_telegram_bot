import { config } from "dotenv";
import onStart from "./handlers/onStart.js";
import onProfile from "./handlers/onProfile.js";
import onRegister from "./handlers/onRegister.js";
import User from "../models/User.js";
config();

const TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = "@academy_100x_uz";
const ADMIN_ID = 875072364;

export const bot = new TelegramBot(TOKEN, { polling: true });



  if (text == "✍️ Ro‘yxatdan o‘tish") {
    return onRegister(msg, bot);
  }

  let user = await User.findOne({ chatId: chatId });

 

  console.log("action:::: ", user.action);

  if (user.action == "awaiting_name") {
    user = await User.findOneAndUpdate(
      { chatId: chatId },
      { action: "awaiting_phone", name: text }
    );

    bot.sendMessage(chatId, `Telefon raqamingizni kiriting:`);

    return;
  }

  if (user.action == "awaiting_phone") {
    user = await User.findOneAndUpdate(
      { chatId: chatId },
      { action: "finish_register", phone: text }
    );

    bot.sendMessage(
      chatId,
      `Tabriklaymiz, siz muvofaqiyatli ro'yhatdan o'tdingiz ✅`
    );

    bot.sendMessage(chatId, `Name: ${user.name}\nPhone:${text}`);

    bot.sendMessage(
      ADMIN_ID,
      `Yangi xabar 🔔 \n\n🔘 ismi: ${user.name}\n🔘 tel: ${text}`
    );

    return;
  }

  return bot.sendMessage(chatId, `Kutilmagan xatolik... /start bosing!`);

