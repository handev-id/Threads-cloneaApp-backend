const {
  getPosts,
  createPost,
  likePost,
  createReply,
  getPostById,
} = require("../controllers/postController");

const router = require("express").Router();

router.get("/list", getPosts);
router.get("/:postId", getPostById);
router.post("/create", createPost);
router.post("/like/:postId", likePost);
router.post("/reply/:postId", createReply);

module.exports = router;
