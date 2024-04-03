const router = require("express").Router();
const User = require("../models/userModel");

router.get("/:id", async (req, res) => {
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
