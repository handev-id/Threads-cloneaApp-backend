const Save = require("../models/saveModel");
const User = require("../models/userModel");

const savePost = async (req, res) => {
  try {
    const userId = req.user.id;
    const postId = req.params.postId;
    const { username, avatar } = req.body;

    if (!userId || !postId || !username || !avatar) {
      return res.status(400).json({ success: false, message: "Data Kurang" });
    }
    const savePost = await Save.create({
      userId,
      postId,
      username,
      avatar,
    });

    return res.status(200).json({ success: true, result: savePost });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPost = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(400).json({ success: false, message: "Data Kurang" });
    }

    const posts = await Save.find({ userId }).populate(
      "postId",
      "caption image"
    );

    return res.status(200).json({ success: true, result: posts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  savePost,
  getPost,
};
