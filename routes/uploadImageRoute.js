const router = require("express").Router();
const upload = require("../middlewares/multer");
const cloudinary = require("../utils/cloudinary");

router.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const image = req.file.path;
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    const result = await cloudinary.uploader.upload(image, options);
    return res.status(200).json({
      success: true,
      result: result.secure_url,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
module.exports = router;
