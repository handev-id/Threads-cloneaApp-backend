const Post = require("../models/postModel");
const Notif = require("../models/notifModel");

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

const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "Post Id harus diisi",
      });
    }

    const post = await Post.findById(postId).populate(
      "userId",
      "username avatar"
    );

    return res.status(200).json({
      success: true,
      result: post,
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
    const username = req?.user?.username;
    const recipientId = req.query.recipientId;

    if (!postId || !userId || !username || !recipientId) {
      return res.status(400).json({
        success: false,
        message: "Post Id harus diisi",
      });
    }

    const likes = await Post.findById(postId).select("likes");
    const likesArray = likes.likes;

    // Check if the user has already liked the post
    if (likesArray.includes(userId)) {
      await Post.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { likes: userId },
      });
    }

    const existingNotifications = await Notif.findOne({
      postId,
      recipientId,
      senderId: userId,
      notifType: "like",
    });

    if (existingNotifications) {
      return res.status(200).json({
        success: true,
        result: likesArray.length,
      });
    }

    const newNotif = await Notif.create({
      recipientId,
      senderId: userId,
      notifType: "like",
      postId,
      message: `${username} menyukai postinganmu`,
    });

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

const deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ success: false, message: "Data Kurang" });
    }

    await Post.findByIdAndDelete({ _id: postId });

    return res.status(200).json({
      success: true,
      message: "Postingan Berhasil Di Hapus",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      messge: error.message,
    });
  }
};

module.exports = {
  getPosts,
  createPost,
  likePost,
  getPostById,
  deletePost,
};
