// import TelegramBot from "node-telegram-bot-api";
import TelegramBot from "node-telegram-bot-api";
import { config } from "dotenv";
import mongoose from "mongoose";


config();

const TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(TOKEN, { polling: true });


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("db is connected...");
  })
  .catch(() => {
    console.log(`Error: db is not connected...!`);
  });

bot.on("message", (msg) => {
  // console.log(msg);
  const chatId = msg.chat.id;
  const text = msg.text;
  const firstName = msg.chat.first_name;

  if (text == "/start") {
    onStart(chatId, firstName);
  } else if (text == "📚 Kurslar") {
    onCourses(chatId);
  } else if (text == "✍️ Ro‘yxatdan o‘tish") {
    onRegister(chatId);
  } else if (text == "/users") {
    onUsers(chatId);
  } else {
    onElse(chatId);
  }
});

bot.on("callback_query", (query) => {
  console.log(query);
  const chatId = query.message.chat.id;
  const firstName = query.message.chat.first_name;
  const data = query.data;

  if (data == "course_english") {
    bot.sendMessage(
      chatId,
      `
    🇬🇧 Ingliz tili kursi haqida:

📆 Davomiyligi: 3 oy  
⏰ Darslar: Haftasiga 3 marta (1,5 soatdan)  
👨‍🏫 O‘qituvchi: Tajribali filologlar  
💰 Narxi: 450 000 so‘m / oy

✍️ Agar sizni bu kurs qiziqtirsa, “Ro‘yxatdan o‘tish” tugmasini bosing.

    `,
      {
        reply_markup: {
          keyboard: [
            [{ text: "✍️ Ro‘yxatdan o‘tish" }],
            [{ text: "⬅️ Orqaga" }],
          ],
          resize_keyboard: true,
        },
      }
    );
  }

  // bot.sendMessage(chatId, data);
});

console.log("Bot ishga tushdi");

export { bot };