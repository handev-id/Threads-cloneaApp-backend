const router = require("express").Router();
const Post = require("../models/postModel");

router.get("/", async (req, res) => {
  try {
    const userId = req.user._id;
    const postByUserid = Post.findById(userId);

    if (!userId) return res.status(400).json({ message: "Data is Required" });

    return res.status(200).json({
      success: true,
      result: postByUserid,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
