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

export { getUserProfile };