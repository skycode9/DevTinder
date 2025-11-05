const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");
const userRoutes = express.Router();

const USER_DATA = "firstName lastName photoUrl age gender about";

// Get all the pending connection request for the loggedIn user
userRoutes.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_DATA);
    if (connectionRequest.length == 0) {
      return res.status(404).json({ msg: "Data not found..!" });
    }
    res.status(200).json({ connectionRequest });
  } catch (error) {
    return res
      .status(400)
      .json({ msg: "Something went wrong", Error: error.message });
  }
});

// Get all the sending connection request for the loggedIn user
userRoutes.get("/user/view/sending/request", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      fromUserId: loggedInUser._id,
      status: "interested",
    }).populate("toUserId", USER_DATA);
    if (connectionRequest.length == 0) {
      return res.status(404).json({ msg: "Data not found" });
    }
    res
      .status(200)
      .json({ msg: "Data fetched successfully", data: connectionRequest });
  } catch (error) {
    res.status(400).json({ msg: "something went wrong", error: error.message });
  }
});

// get all the connection who accept my connection request and i accepte their connection request
userRoutes.get("/user/view/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_DATA)
      .populate("toUserId", USER_DATA);

    if (connectionRequest.length == 0) {
      return res.status(404).json({ msg: "Data not found..!" });
    }

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.status(200).json({ msg: "Data fetched successfully", data: data });
  } catch (error) {
    res.status(400).json({ msg: "something went wrong", error: error.message });
  }
});

// get all the feed data where user doesn't send any request and see in home page except himself too
userRoutes.get("/user/feed", userAuth, async (req, res) => {
  try {
    // User can see all the user cards(profiles) except
    // 0. His own card
    // 1. his connection --> accepted their reuest
    // 2. ignored card --> ignores the req
    // 3. Alredy sent the connection --> interested
    // 4. rejected card

    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    const skip = (page - 1) * limit;

    // find all the connection request (Send + Received)
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    //['A','B','C'] ---> never put a 'A in this array it will replace with Old "A"' ---> this set data structure giving us unique array

    connectionRequest.forEach((req) => {
      hideUserFromFeed.add(req.fromUserId.toString());
      hideUserFromFeed.add(req.toUserId.toString());
    });

    // console.log("set", hideUserFromFeed);

    const userFeed = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .skip(skip)
      .limit(limit);

    if (userFeed.length == 0) {
      return res.status(404).json({ msg: "Data is not found" });
    }

    res.status(200).json({ msg: "Data Fetched..!", data: userFeed });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

module.exports = userRoutes;
