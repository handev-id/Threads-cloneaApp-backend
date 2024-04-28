const {
  getPosts,
  createPost,
  likePost,
  getPostById,
  deletePost,
} = require("../controllers/postController");
const {
  createReply,
  getReplies,
  deleteReply,
} = require("../controllers/replyController");
const { createRepost } = require("../controllers/repostController");

const router = require("express").Router();

router.get("/list", getPosts);
router.get("/:postId", getPostById);
router.post("/create", createPost);
router.post("/like/:postId", likePost); // QUERY: ?recipientId= (for notifications)
router.post("/repost/:postId", createRepost); // QUERY: ?recipientId= (for notifications)
router.delete("/delete/:postId", deletePost); // QUERY: ?isReposted

router.post("/create-reply/:postId", createReply); // QUERY: ?recipientId= (for notifications)
router.get("/reply/:postId", getReplies);
router.delete("/reply/delete/:id", deleteReply);
module.exports = router;
