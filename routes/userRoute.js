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
    const username = req.query.username;
    const user = await User.find({
      $or: [
        { username: { $regex: username, $options: "i" } },
        { fullname: { $regex: username, $options: "i" } },
      ],
    });
    return res.status(200).json({
      success: true,
      result: user,
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
      throw new Error("Id is required");
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
