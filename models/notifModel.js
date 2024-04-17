const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema(
  {
    recipientId: {
      type: String,
      required: true,
    },
    from: {
      type: String,
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
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notifSchema);

module.exports = Notifications;
