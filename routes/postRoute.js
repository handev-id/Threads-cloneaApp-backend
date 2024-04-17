const { getPosts } = require("../controllers/postController");

const router = require("express").Router();

router.get("/list", getPosts);

module.exports = router;
