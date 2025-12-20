import User from "../../models/User.js";

async function onStart(msg, bot) {
  const chatId = msg.chat.id.toString();
  const firstname = msg.chat.first_name;

  let user = await User.findOne({ telegramId: chatId });

  if (!user) {
    user = new User({
      telegramId: chatId,
      firstname: firstname,
      username: msg.chat.username,
    });

    await user.save();
  } else {
    user = await User.findOneAndUpdate(
      { telegramId: chatId },
      { $set: { firstname: firstname, username: msg.chat.username, action: "start" } },
      { new: true }
    );
  }

  console.log(user);

  await bot.sendMessage(chatId, "Botga xush kelibsiz!");
}

export default onStart;
