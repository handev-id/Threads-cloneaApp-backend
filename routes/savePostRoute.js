const router = require("express").Router();
const { getPost, savePost } = require("../controllers/savePostController");

router.get("/", getPost);
router.post("/create/:postId", savePost);

module.exports = router;
