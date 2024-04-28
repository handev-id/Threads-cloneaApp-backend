const router = require("express").Router();
const User = require("../models/userModel");

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      success: true,
      result: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const keyword = req.query.username;
    const users = await User.find();
    const me = req.user.id;

    if (!keyword || keyword === "") {
      const result = users.filter((user) => {
        return user._id != me;
      });
      return res.status(200).json({
        success: true,
        result,
      });
    }

    const result = users.filter((user) => {
      return user._id != me && user.username.includes(keyword.toLowerCase());
    });

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
});

router.get("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    const userById = await User.findById(id);
    const { password, ...rest } = userById._doc;

    res.status(200).json({
      success: true,
      result: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
