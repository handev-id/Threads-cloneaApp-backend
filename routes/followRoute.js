const {
  followController,
  getFollowersList,
  getFollowingList,
} = require("../controllers/followController");

const router = require("express").Router();

router.patch("/:userIdToFollow", followController);
router.get("/followers-list", getFollowersList); // BY ID FROM TOKEN
router.get("/following-list", getFollowingList); // BY ID FROM TOKEN

module.exports = router;
