import User from "../../models/User.js";

async function onProfile(msg) {
  const chatId = msg.chat.id.toString();

  let user = await User.findOne({ telegramId: chatId });
  if (!user) return;

  user = await User.findOneAndUpdate(
    { telegramId: chatId },
    { $set: { action: "profile" } },
    { new: true }
  );

  console.log(user);
}

export default onProfile;
