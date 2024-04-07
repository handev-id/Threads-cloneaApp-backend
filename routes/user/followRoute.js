const router = require("express").Router();
const User = require("../../models/userModel");

router.patch("/add-followers?userId=:", async (req, res) => {
  try {
    const userIdToFollow = req.query.userId;
    const follower = req.user.username;
    const { following } = req.body;

    if (!userIdToFollow || !follower || !following) {
      return res.status(400).json({
        message: "Semua field harus diisi!",
      });
    }

    const addFollowers = await User.findByIdAndUpdate(userIdToFollow, {
      $push: { followers: follower },
    });

    const addFollowing = await User.findOneAndUpdate(follower, {
      $push: { following: addFollowers.username },
    });

    return res.status(200).json({
      message: "Add Followers Berhasil!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
