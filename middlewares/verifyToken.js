const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken?.split(" ").pop();

  if (!token)
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  try {
    const verfyToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verfyToken;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = verifyToken;
