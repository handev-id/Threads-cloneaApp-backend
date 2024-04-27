const Repost = require("../models/repostModel");
const Notif = require("../models/notifModel");

const createRepost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const recipientId = req.query.recipientId;
    const repostedUsername = req.user.username;
    const repostedAvatar = req.user.avatar;

    const repost = await Repost.create({
      _id: postId,
      userId,
      postId,
      reposted: {
        avatar: repostedAvatar,
        username: repostedUsername,
      },
    });

    if (recipientId !== userId) {
      await Notif.create({
        postId,
        senderId: userId,
        recipientId: recipientId,
        notifType: "repost",
        message: `${reposted} Merepost Postinganmu`,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Repost Berhasil",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { createRepost };
