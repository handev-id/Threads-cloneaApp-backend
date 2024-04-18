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
router.post("/like/:postId", likePost); // QUERY: ?recipientId=
router.post("/reply/:postId", createReply); // QUERY: ?recipientId=

module.exports = router;
