import User from "../../models/User.js";

async function onRegister(msg, bot) {
  const chatId = msg.chat.id.toString();

  let user = await User.findOne({ telegramId: chatId });
  if (!user) return;

  user = await User.findOneAndUpdate(
    { telegramId: chatId },
    { $set: { action: "awaiting_name" } },
    { new: true }
  );

  bot.sendMessage(chatId, "Ismingizni kiriting");
}

export default onRegister;
