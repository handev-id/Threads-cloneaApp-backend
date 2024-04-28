const express = require("express");
const router = express.Router();
const Notif = require("../models/notifModel");

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID harus diisi" });
    }

    const notifs = await Notif.find({ recipientId: userId }).populate(
      "senderId",
      "username avatar"
    );
    const result = notifs.filter((notif) => notif.senderId._id != userId);
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

module.exports = router;
