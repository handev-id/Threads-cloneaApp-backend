const User = require("../models/userModel");
const Notif = require("../models/notifModel");

const followController = async (req, res) => {
  try {
    const userIdToFollow = req.params.userIdToFollow;
    const userIdToFollowing = req.user.id;
    const username = req.user.username;

    if (!userIdToFollow || !userIdToFollowing) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    if (userIdToFollow === userIdToFollowing) {
      return res.status(400).json({
        success: false,
        message: "Tidak bisa mengikuti diri sendiri!",
      });
    }

    const user = await User.findById(userIdToFollow);
    const userFollowers = user.followers;

    if (userFollowers.includes(userIdToFollowing)) {
      await User.findByIdAndUpdate(userIdToFollow, {
        $pull: { followers: userIdToFollowing },
      });

      await User.findByIdAndUpdate(userIdToFollowing, {
        $pull: { following: userIdToFollow },
      });
    } else {
      await User.findByIdAndUpdate(userIdToFollow, {
        $push: { followers: userIdToFollowing },
      });

      await User.findByIdAndUpdate(userIdToFollowing, {
        $push: { following: userIdToFollow },
      });

      await Notif.create({
        senderId: userIdToFollowing,
        recipientId: userIdToFollow,
        notifType: "follow",
        message: `${username} Mulai Mengikuti Kamu`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Success ${
        userFollowers.includes(userIdToFollowing) ? "unfollow" : "follow"
      }`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFollowersList = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    const followers = await User.findById(userId).select("followers");

    const result = await User.find({
      _id: { $in: followers.followers },
    }).select("username avatar");

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
};

const getFollowingList = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Data Kurang!",
      });
    }

    const following = await User.findById(userId).select("following");

    const result = await User.find({
      _id: { $in: following.following },
    }).select("username avatar");

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
};

module.exports = {
  followController,
  getFollowersList,
  getFollowingList,
};
