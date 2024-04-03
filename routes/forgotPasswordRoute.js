const router = require("express").Router();
const User = require("../models/userModel");

router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = await User.findOne().or([
      { email: identifier },
      { username: identifier },
    ]);
    if (!user) {
      return res.status(404).json({
        message: "User Tidak Ditemukan",
      });
    }
    return res.status(200).json({
      success: true,
      result: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
