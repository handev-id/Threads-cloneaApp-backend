const Post = require("../models/postModel");
const User = require("../models/userModel");
const Repost = require("../models/repostModel");

const getPostsFollowing = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    const following = await User.findById(userId).select("following");
    const posts = await Post.find({
      userId: { $in: following.following },
    })
      .sort({
        createdAt: -1,
      })
      .populate("userId", "username avatar");

    const reposts = await Repost.find({ userId: { $in: following.following } })
      .populate("userId", "username avatar")
      .populate("postId", "caption image likes replies createdAt")
      .sort({
        createdAt: -1,
      });

    const repost = reposts.map((repost) => {
      return {
        userId: {
          _id: repost.userId._id,
          username: repost.userId.username,
          avatar: repost.userId.avatar,
        },
        _id: repost.postId._id,
        postId: repost.postId._id,
        caption: repost.postId.caption,
        image: repost.postId.image,
        likes: repost.postId.likes,
        replies: repost.postId.replies,
        createdAt: repost.createdAt,
        reposted: repost.reposted,
      };
    });

    const result = [...posts, ...repost];

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getPostsFollowing };
