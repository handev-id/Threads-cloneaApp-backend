const Reply = require("../models/replyModel");
const Post = require("../models/postModel");
const Notif = require("../models/notifModel");

const createReply = async (req, res) => {
  try {
    const postId = req.params.postId;
    const recipientId = req.query.recipientId;
    const userId = req.user.id;
    const username = req?.user?.username;
    const { reply } = req.body;

    if (!postId || !userId || !reply || !username || !recipientId) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    await Post.findByIdAndUpdate(postId, {
      $push: { replies: userId },
    });

    const newReply = await Reply.create({
      userId,
      postId,
      reply,
    });

    const existingNotifications = await Notif.findOne({
      postId,
      senderId: userId,
      recipientId,
      notifType: "reply",
    });

    if (existingNotifications) {
      return res.status(200).json({
        success: true,
        result: newReply,
      });
    }

    await Notif.create({
      recipientId: recipientId,
      senderId: userId,
      notifType: "reply",
      postId,
      message: `${username} membalas postinganmu`,
    });

    return res.status(200).json({
      success: true,
      result: newReply,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getReplies = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(404).json({
        success: false,
        message: "Post tidak ditemukan",
      });
    }

    const replies = await Reply.find({ postId });

    return res.status(200).json({
      success: true,
      result: replies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createReply,
  getReplies,
};
