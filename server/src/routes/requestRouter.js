const express = require("express");
const requestRoutes = express.Router();

const { userAuth } = require("../middlewares/auth");
const User = require("../models/User");
const ConnectionRequestModel = require("../models/ConnectionRequest");
const ConnectionRequest = require("../models/ConnectionRequest");

requestRoutes.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const isValidToUserId = await User.findById(toUserId);
      if (!isValidToUserId) {
        throw new Error("User Not Found..!");
      }

      const allowedStatus = ["ignored", "interested"];
      const isStatusValid = allowedStatus.includes(status);
      if (!isStatusValid) {
        throw new Error("invalid status type" + status);
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("Connection Request Already Exists!!");
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(200).json({
        msg: `${req.user.firstName} successfully sent the request to ${isValidToUserId.firstName}`,
      });
    } catch (error) {
      res.status(400).json({
        msg: "something went wrong",
        err: error.message,
      });
    }
  }
);

requestRoutes.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ msg: "status is not valid " + status });
      }

      const checkConnectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: loggedInUser._id,
      });

      if (!checkConnectionRequest) {
        return res
          .status(404)
          .json({ msg: "Connection request is not found.." });
      }

      checkConnectionRequest.status = status;
      const data = await checkConnectionRequest.save();

      res.status(200).json({ msg: "connection request is" + status, data });
    } catch (error) {
      res.status(400).json({
        msg: "Something went wrong",
        error: error.message,
      });
    }
  }
);

module.exports = requestRoutes;
