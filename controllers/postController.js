const Post = require("../models/postModel");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username avatar");

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

const createPost = async (req, res) => {
  try {
    const { caption, image } = req.body;
    const userId = req?.user?.id;

    if (!caption || !userId) {
      return res.status(400).json({
        success: false,
        message: "Caption harus diisi",
      });
    }

    const newPost = await Post.create({
      userId,
      caption,
      image: image ? image : null,
    });

    return res.status(200).json({
      success: true,
      result: newPost,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPosts,
  createPost,
};
