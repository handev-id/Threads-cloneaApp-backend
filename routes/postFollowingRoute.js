const { getPostsFollowing } = require("../controllers/postFollowingController");
const router = require("express").Router();

router.get("/list", getPostsFollowing); // BY ID FROM TOKEN

module.exports = router;
