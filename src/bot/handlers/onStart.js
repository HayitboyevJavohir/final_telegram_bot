
 async function onStart(msg) {
  const chatId = msg.chat.id;
  const firstname = msg.chat.first_name;

  const existingUser = await User.findOne({ chatId: chatId });
  let user = await User.findOne({ chatId: chatId });

  if (existingUser == null) {
    const newUser = new User({
  if (user == null) {
    user = new User({
      chatId: chatId,
      firstname: firstname,
      username: msg.chat.username,
    });

    newUser.save();
    user.save();
  } else {
    user = await User.findOneAndUpdate(
      { chatId: chatId },
      { firstname: firstname, username: msg.chat.username, action: "start" }
    );
  }

  console.log(existingUser);
  console.log(user);

  await bot.sendMessage(
    chatId,