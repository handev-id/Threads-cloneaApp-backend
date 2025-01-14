const Repost = require("../models/repostModel");
const Notif = require("../models/notifModel");

const createRepost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const recipientId = req.query.recipientId;
    const repostedId = req.user.id;
    const repostedUsername = req.user.username;

    const repost = await Repost.create({
      userId: recipientId,
      postId,
      reposted: repostedId,
    });

    if (recipientId !== repostedId) {
      await Notif.create({
        postId,
        senderId: repostedId,
        recipientId: recipientId,
        notifType: "repost",
        message: `${repostedUsername} Merepost Postinganmu`,
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
