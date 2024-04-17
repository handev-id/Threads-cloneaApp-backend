const { getPosts, createPost } = require("../controllers/postController");

const router = require("express").Router();

router.get("/list", getPosts);
router.post("/create", createPost);

module.exports = router;
