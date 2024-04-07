const router = require("express").Router();
const Post = require("../models/postModel");
const Notifications = require("../models/notifModel");

router.get("/", async (req, res) => {
  const posts = await Post.find();

  res.status(200).json({
    success: true,
    result: posts,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);

    if (!id) return res.status(404).json("Postingan Tidak Ditemukan");

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
});

router.post("/create", async (req, res) => {
  const { caption, image, replies, likes } = req.body;
  const username = req.user.username;

  if (!caption || !username || !image) {
    return res.status(400).json({
      message: "Semua field harus diisi!",
    });
  }

  await Post.create({
    caption,
    username,
    image,
    replies,
    likes,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
  });
});

router.post("/like", async (req, res) => {
  try {
    const { userWhoPosted, postId } = req.query;
    const sourceUsername = req.user.username;

    if (!postId || !sourceUsername || !userWhoPosted) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi!",
      });
    }

    if (userWhoPosted !== sourceUsername) {
      await Notifications.create({
        userWhoPosted,
        postId,
        username: sourceUsername,
        notifType: "like",
        message: `${sourceUsername} Menyukai Postinganmu!`,
      });
    }

    const increaseLike = await Post.findByIdAndUpdate(postId, {
      $inc: { likes: 1 },
    });

    const like = increaseLike.likes;

    return res.status(200).json({
      success: true,
      result: like,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
