const router = require("express").Router();
const Notif = require("../models/notifModel");

router.get("/", async (req, res) => {
  const notif = await Notif.find({});

  res.status(200).json({
    success: true,
    result: notif,
  });
});

module.exports = router;
