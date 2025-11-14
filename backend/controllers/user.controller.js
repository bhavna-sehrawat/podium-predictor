import asyncHandler from "express-async-handler";
import User from "../model/user.model.js";

//Private route
const getUserProfile = asyncHandler(async(req, res) => {
  // Protect middleware already ran so we have req.user
  const user = req.user;

  if(user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      totalScore: user.totalScore,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getLeaderboard = asyncHandler(async(req,res) => {

  const users = await User.find({}).sort({ totlaScore: -1 }).limit(100);

  const leaderboard = users.map(user => ({
    _id: user._id,
    username: user.username,
    totalScore: user.totalScore,
  }));

  res.status(200).json(leaderboard);
})


export { getUserProfile, getLeaderboard };