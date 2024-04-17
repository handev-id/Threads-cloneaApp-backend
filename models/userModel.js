const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 8,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwfwqx75z/image/upload/v1708563877/socialapps/x9idyfpnhd4lmcn91z4x.jpg",
    },
    followers: {
      type: Array,
      default: [String],
      unique: true,
    },
    following: {
      type: Array,
      default: [String],
      unique: true,
    },
    bio: {
      type: String,
      default: "",
    },
  },
  { timestamps: true, bufferTimeoutMS: 60000 }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
