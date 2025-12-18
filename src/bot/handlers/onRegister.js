import User from "../../models/User.js";

async function onRegister(msg, bot) {
  const chatId = msg.chat.id;
  const text = msg.text;

  let user = await User.findOne({ chatId: chatId });

  if (!user) return;

  user = await User.findOneAndUpdate(
    { chatId: chatId },
    { action: "awaiting_name" }
  );

  bot.sendMessage(chatId, "Ismingizni kiriting");
}

export default onRegister;