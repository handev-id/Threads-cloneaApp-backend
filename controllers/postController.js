const router = require("express").Router();
const Post = require("../models/postModel");

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    return res.status(200).json({
      success: true,
      result: posts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPosts,
};
