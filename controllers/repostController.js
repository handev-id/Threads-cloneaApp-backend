const Post = require("../models/postModel");
const Notif = require("../models/notifModel");

const createRepost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const recipientId = req.query.recipientId;
    const reposted = req.user.username;
    const repostedAvatar = req.user.avatar;

    const post = await Post.findById(postId);
    await Post.create({
      postId: postId,
      image: post.image,
      userId: post.userId,
      caption: post.caption,
      reposted: {
        username: reposted,
        avatar: repostedAvatar,
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
