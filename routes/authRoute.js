const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Semua field harus diisi" });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    const existingUsername = await User.findOne({ username }).exec();
    const existingEmail = await User.findOne({ email }).exec();

    if (existingUsername || existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Username / Email sudah terdaftar",
      });
    }

    const newUser = await User.create({
      username,
      email,
      password: hashPassword,
      image:
        "https://res.cloudinary.com/dwfwqx75z/image/upload/v1708563877/socialapps/x9idyfpnhd4lmcn91z4x.jpg",
    });

    const { password: pass, ...rest } = newUser._doc;

    return res.status(201).json({
      success: true,
      result: rest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Semua field harus diisi",
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    });

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User Tidak Terdaftar",
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Password Salah!",
      });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        username: existingUser.username,
        image: existingUser.image,
      },
      process.env.JWT_SECRET_KEY
    );

    const { password: pass, ...rest } = existingUser._doc;

    return res.status(200).json({
      success: true,
      result: {
        user: rest,
        token: token,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
