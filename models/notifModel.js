const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    notifType: {
      type: String,
      required: true,
    },
    postId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notifSchema);

module.exports = Notifications;
