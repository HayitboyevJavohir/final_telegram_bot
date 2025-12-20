import User from "./models/User.js";
import { bot } from "./index.js";


const ADMIN_ID = process.env.ADMIN_ID || "875072364";

export async function checkBroadcast(msg) {
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


  const user = await User.findOne({ telegramId: chatId });
  if (user?.action === "broadcast") {
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
