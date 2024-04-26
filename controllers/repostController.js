const Post = require("../models/postModel");

const createRepost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const isRepost = req.query.isRepost;
    const { caption, username, avatar, captionPost } = req.body;
    const userId = req.user.id;

    if (
      !isRepost ||
      !postId ||
      !userId ||
      !username ||
      !avatar ||
      !caption ||
      !captionPost
    ) {
      return res.status(400).json({
        success: false,
        message: "Data Kuang!",
      });
    }

    const post = await Post.create({
      userId,
      isRepost,
      caption,
      repostData: {
        username,
        avatar,
        caption: captionPost,
      },
    });

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
