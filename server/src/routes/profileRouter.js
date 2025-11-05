const express = require("express");
const profileRoutes = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateOldPassword,
  validateNewPasswordData,
} = require("../utils/validation");

profileRoutes.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      msg: "something went wrong",
      err: error.message,
    });
  }
});

profileRoutes.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const isEditAllowed = validateEditProfileData(req);
    if (!isEditAllowed) {
      throw new Error("Edit fileds are not allowed");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.status(200).json({
      message: `${loggedInUser.firstName}, your profile updated successfuly`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).json({
      msg: "something went wrong",
      err: error.message,
    });
  }
});

profileRoutes.patch("/profile/edit/password", userAuth, async (req, res) => {
  try {
    validateNewPasswordData(req);
    const isOldPasswordValid = await validateOldPassword(req);
    if (!isOldPasswordValid) {
      throw new Error("Old Password is not authenticated..!");
    }

    const { newPassword } = req.body;
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    const loggedInUser = req.user;
    loggedInUser.password = newHashedPassword;

    await loggedInUser.save();
    res.json({
      msg: `${loggedInUser.firstName}, your password is updated successfuly`,
    });
  } catch (error) {
    res.status(400).json({
      msg: "something went wrong",
      err: error.message,
    });
  }
});

module.exports = profileRoutes;
