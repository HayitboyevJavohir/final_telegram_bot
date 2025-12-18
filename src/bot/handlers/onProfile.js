async function onProfile(msg) {
  const chatId = msg.chat.id;

  const user = await User.findOne({ chatId: chatId });
  let user = await User.findOne({ chatId: chatId });

  if (!user) return;

  user = await User.findOneAndUpdate({ chatId: chatId }, { action: "profile" });

  console.log(user);