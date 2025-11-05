const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies; // ---> for this we need to parser the cookie
    const { token } = cookie;
    if (!token) {
      return res.status(401).json({ msg: "You're not Authorized..!" });
    }

    const decodedData = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedData;

    const user = await User.findById(_id);

    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials..!" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({
      msg: "something went wrong",
      err: error.message,
    });
  }
};

module.exports = { userAuth };
