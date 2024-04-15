const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { email, password, fullname } = req.body;

    if (!email || !password || !fullname) {
      return res
        .status(400)
        .json({ success: false, message: "Semua field harus diisi" });
    }

    const hashPassword = await bcrypt.hash(password, 8);

    const existingFullname = await User.findOne({ fullname });
    const existingEmail = await User.findOne({ email });

    if (existingFullname || existingEmail) {
      return res.status(400).json({
        success: false,
        message: existingFullname
          ? "Username sudah terdaftar"
          : "Email sudah terdaftar",
      });
    }

    const newUser = await User.create({
      fullname,
      username: `${fullname.toLowerCase().replace(/\s/g, "")}`,
      email,
      password: hashPassword,
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
      $or: [
        { email: identifier },
        { username: identifier },
        { fullname: identifier },
      ],
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
        avatar: existingUser.avatar,
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
