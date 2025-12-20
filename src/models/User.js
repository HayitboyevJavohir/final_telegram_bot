import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    unique: true,
    required: true,
  },
  balance: {
    type: Number,
    default: 2000,
  },
  action: {
    type: String,
    default: "start",
  },
  name: String,
  phone: String,
});

const User = mongoose.model("User", userSchema);
export default User;
