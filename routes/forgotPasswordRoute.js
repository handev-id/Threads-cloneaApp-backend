const router = require("express").Router();
const { hash } = require("bcrypt");
const User = require("../models/userModel");
const nodemailer = require("nodemailer");

router.get("/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    const user = await User.findOne().or([
      { email: identifier },
      { username: identifier },
    ]);
    if (!user) {
      return res.status(404).json({
        message: "User Tidak Ditemukan",
      });
    }
    return res.status(200).json({
      success: true,
      result: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || !id) {
      return res.status(400).json({
        message: "Data Kurang!",
      });
    }

    const hashPassword = await hash(password, 8);

    await User.findByIdAndUpdate(id, {
      password: hashPassword,
    });

    return res.status(200).json({
      message: "Password Berhasil Di Update!",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

router.post("/send-code", async (req, res) => {
  try {
    function generateOTP() {
      return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const generatedOTP = generateOTP();

    const { email: destEmail } = req.body;

    if (!destEmail) {
      return res.status(400).json({
        message: "Data Kurang!",
      });
    }

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GOOGLE_SMTP_EMAIL,
        pass: process.env.GOOGLE_SMTP_PASSWORD,
      },
    });

    const status = await transport.verify();

    const sendEmail = await transport.sendMail({
      from: process.env.GOOGLE_SMTP_EMAIL,
      to: destEmail,
      subject: "Threads - Verification Code",
      html: `Your Verification Code: <b>${generatedOTP}</b>`,
    });

    return res.status(200).json({
      success: status,
      result: sendEmail,
      otpCode: generatedOTP,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;
