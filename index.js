const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const userRoute = require("./routes/userRoute");
const commentRoute = require("./routes/commentRoute");
const notifRoute = require("./routes/notifRoute");
const postRoute = require("./routes/postRoute");
const followRoute = require("./routes/user/followRoute");
const verifyToken = require("./middlewares/verifyToken");
const dotenv = require("dotenv").config();
const app = express();

const connectDB = mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    newFeatures: [
      {
        name: "Send Link To Email",
        description: "nodemailer is used for sending emails",
      },
      {
        name: "Upadate Password & OTPCODE",
        description: "Update password with new password",
      },
      {
        name: "Add Followers",
        description: "AddFollowers and AddFollowing features",
      },
    ],
    updateCode: [
      {
        update: "model and route",
      },
    ],
  });
});

app.use("/auth", authRoute);
app.use("/auth/forgot-password", forgotPasswordRoute);
app.use("/users", verifyToken, userRoute);
app.use("/comment", verifyToken, commentRoute);
app.use("/post", verifyToken, postRoute);
app.use("/notifications", verifyToken, notifRoute);
app.use("/follow", verifyToken, followRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
