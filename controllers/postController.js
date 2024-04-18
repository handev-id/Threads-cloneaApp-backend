const Post = require("../models/postModel");
const Reply = require("../models/replyModel");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("userId", "username avatar").sort({
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

const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;

    if (!postId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Post Id harus diisi",
      });
    }

    const likes = await Post.findById(postId).select("likes");
    const likesArray = likes.likes;

    if (likesArray.includes(userId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
      });
    }

    return res.status(200).json({
      success: true,
      result: likesArray.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createReply = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user.id;
    const { reply } = req.body;

    if (!postId || !userId || !reply) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    const newReply = await Reply.create({
      userId,
      postId,
      reply,
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

module.exports = {
  getPosts,
  createPost,
  likePost,
  createReply,
};
