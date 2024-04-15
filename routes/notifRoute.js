const router = require("express").Router();
const Notif = require("../models/notifModel");

router.get("/", async (req, res) => {
  const username = req.user.username;
  const notif = await Notif.find({ userWhoPosted: username }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    result: notif,
  });
});

module.exports = router;
