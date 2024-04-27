const mongoose = require("mongoose");

const repostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
    reposted: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Repost = mongoose.model("Repost", repostSchema);

module.exports = Repost;
