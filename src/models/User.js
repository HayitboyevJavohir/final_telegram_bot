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

const User = new mongoose.model("User", userSchema);