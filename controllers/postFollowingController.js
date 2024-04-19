const Post = require("../models/postModel");
const User = require("../models/userModel");

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
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      result: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { getPostsFollowing };
