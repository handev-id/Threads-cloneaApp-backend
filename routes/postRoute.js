const {
  getPosts,
  createPost,
  likePost,
  getPostById,
  deletePost,
} = require("../controllers/postController");
const { createReply, getReplies } = require("../controllers/replyController");
const { createRepost } = require("../controllers/repostController");

const router = require("express").Router();

router.get("/list", getPosts);
router.get("/:postId", getPostById);
router.post("/create", createPost);
router.post("/like/:postId", likePost); // QUERY: ?recipientId= (for notifications)
router.post("/repost/:postId", createRepost); // QUERY: ?recipientId= (for notifications)
router.delete("/delete/:postId", deletePost);

router.post("/create-reply/:postId", createReply); // QUERY: ?recipientId= (for notifications)
router.get("/reply/:postId", getReplies);
module.exports = router;
