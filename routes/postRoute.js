const router = require("express").Router();
const Post = require("../models/postModel");
const Notifications = require("../models/notifModel");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).exec();
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
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({ message: "Postingan Tidak Ditemukan" });
    }

    const post = await Post.findById(id);
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
  const { caption, image } = req.body;
  const username = req.user.username;
  const avatar = req.user.avatar;

  if (!caption || !username || !avatar) {
    return res.status(400).json({
      message: "Semua field harus diisi!",
    });
  }

  await Post.create({
    username,
    caption,
    avatar,
    image: image ? image : null,
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
    const sourceAvatar = req.user.avatar;

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
        from: sourceUsername,
        notifType: "like",
        message: `${sourceUsername} Menyukai Postinganmu!`,
      });
    }

    const existingActivity = await Post.findOne({
      likes: {
        $elemMatch: {
          username: sourceUsername,
        },
      },
    });

    if (existingActivity) {
      return res.status(400).json({
        success: false,
        message: "Anda sudah menyukai postingan ini",
      });
    }

    const increaseLike = await Post.findByIdAndUpdate(postId, {
      $push: { likes: { username: sourceUsername, avatar: sourceAvatar } },
    });

    const like = increaseLike.likes.length;

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
