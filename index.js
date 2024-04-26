const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const postFollowingRoute = require("./routes/postFollowingRoute");
const followRoute = require("./routes/followRoute");
const uploadImageRoute = require("./routes/uploadImageRoute");
const verifyToken = require("./middlewares/verifyToken");
const dotenv = require("dotenv").config();
const app = express();

// SWAGGER
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

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
        name: "Posts",
        desc: "clear post features",
      },
      {
        name: "Follow system",
        desc: "Follow system is ready",
      },
      {
        name: "Post Following",
        desc: "Post following list is ready",
      },
      {
        name: "Upload Image",
        desc: "Upload image with cloudinary and multer",
      },
      {
        name: "Repost and reply",
        desc: "Repost is on and clear reply",
      },
    ],
  });
});

app.use("/auth", authRoute);
app.use("/auth/forgot-password", forgotPasswordRoute);
app.use("/users", verifyToken, userRoute);

app.use("/post", verifyToken, postRoute);
app.use("/post-following", verifyToken, postFollowingRoute);

app.use("/follow", verifyToken, followRoute);
app.use(uploadImageRoute);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
