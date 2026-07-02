import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.models.js";

const loginUser = asyncHandler(async (req, res) => {
  const { username } = req.body;
  if (!username || username.trim() === "") {
    throw new ApiError(400, "Username is required");
  }

  const trimmedUsername = username.trim();

  let user = await User.findOne({ username: trimmedUsername });

  if (!user) {
    user = await User.create({ username: trimmedUsername });
  }

  return res.status(200).json(new ApiResponse(200, user, "Login successful"));
});

const getUsers = asyncHandler(async (req, res) => {
  const { currentUserId } = req.query;
  if (!currentUserId) {
    throw new ApiError(400, "Current user id is required");
}

  const users = await User.find({
    _id: { $ne: currentUserId },
  }).select("username _id")
  .sort({ username: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { loginUser, getUsers };
