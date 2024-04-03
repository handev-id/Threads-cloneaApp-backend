const router = require("express").Router();
const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const Notifications = require("../models/notifModel");

router.get("/list", async (req, res) => {
  try {
    const postId = req.query.postId;

    if (!postId) {
      return res.status(404).json({
        success: false,
        message: "Post Tidak Ditemukan",
      });
    }

    const comment = await Comment.find({ postId: postId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      result: comment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { comment } = req.body;
    const { username, image } = req.user;
    const { userWhoPosted, postId } = req.query;

    if (!postId || !username || !comment || !image) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi!",
      });
    }

    const addReplies = await Post.findByIdAndUpdate(postId, {
      $push: {
        replies: {
          username: username,
          image: image,
        },
      },
    });

    if (userWhoPosted !== username) {
      await Notifications.create({
        userWhoPosted,
        postId,
        username,
        notifType: "comment",
        message: `${username} Membalas Postinganmu!`,
      });
    }

    if (!addReplies) {
      return res.status(404).json({
        success: false,
        message: "Post Tidak Ditemukan",
      });
    }

    const newComment = await Comment.create({
      postId,
      username,
      comment,
      image,
    });

    return res.status(201).json({
      success: true,
      result: newComment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
