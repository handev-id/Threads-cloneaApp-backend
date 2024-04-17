const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/forgotPasswordRoute");
const userRoute = require("./routes/userRoute");
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
    newFeatures: [],
    updateCode: [
      {
        update: "model and route new",
      },
    ],
  });
});

app.use("/auth", authRoute);
app.use("/auth/forgot-password", forgotPasswordRoute);
app.use("/users", verifyToken, userRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
