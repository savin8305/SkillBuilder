import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { User } from "../models/UserModel.js";
import { Course } from "../models/CourseModel.js";
import { Payment } from "../models/PaymentModel.js";
import { instance } from "../server.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import getDataUri from "../utils/datauri.js";
import crypto from "crypto";
import cloudinary from "cloudinary";
import { Stats } from "../models/StatsModel.js";

// To Register a new user
export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const file = req.file;
  if (!name || !email || !password || !file)
    return next(new ErrorHandler("Please enter all fields ", 400));

  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User already exists", 409));

  // Upload file on cloudinary
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(res, user, `${user.name}: Registered Successfully 😇`, 201);
});

// Login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ErrorHandler("Please enter all fields ", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Incorrent Credentials", 401));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Incorrent Credentials", 401));

  sendToken(res, user, `Welcome Back ${user.name} 🙏`, 200);
});

// Logout
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: `Logged Out Successfully👋`,
    });
});

// Get My Profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});

// Delete My Profile
export const deleteMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  // Cancel Subscription
  const subscriptionId = user.subscription.id;
  if (subscriptionId) {
    await instance.subscriptions.cancel(subscriptionId);

    const payment = await Payment.findOne({
      razorpay_subscription_id: subscriptionId,
    });
    await payment.deleteOne();
  }

  await user.deleteOne();

  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: `${user.name} Your Profile Has Been Deleted Successfully and if you had our subscription then Your Subscription has been ended`,
    });
});

// Change Password
export const changePassword = catchAsyncError(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    return next(new ErrorHandler("Please enter all fields 👎", 400));

  const user = await User.findById(req.user._id).select("+password");

  const isMatch = await user.comparePassword(oldPassword);
  if (!isMatch) return next(new ErrorHandler("Incorrent Old Password 👎", 401));

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.name}, Your Password Changed Successfully 🙈`,
  });
});

// Update Profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;

  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.name}, Your Profile Updated Successfully 👍`,
    user,
  });
});

// Update Profile Picture
export const updateProfilePicture = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  // Cloudinary to do
  const file = req.file;
  const fileUri = getDataUri(file);
  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content);

  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  user.avatar = {
    public_id: myCloud.public_id,
    url: myCloud.secure_url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: `${user.name}, Your Profile Picture Updated Successfully 👍`,
  });
});

// Forget Password
export const forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return next(new ErrorHandler("User not found", 400));

  const resetToken = await user.getResetToken();

  await user.save();

  const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  const message = `Click on the link to reset your password.
  ${url}
  If you haven't requested then please ignore`;

  // Send token via email
  await sendEmail(user.email, "SkillBuilder Reset Password", message);

  res.status(200).json({
    success: true,
    message: `Reset Token has been sent to ${user.email}`,
  });
});

// Reset Password
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: {
      $gt: Date.now(),
    },
  });

  if (!user)
    return next(
      new ErrorHandler("Reset Token is invalid or has been expired", 401)
    );

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: `Password Changed Successfully 🙈`,
  });
});

// Add To PlayList
export const addToPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("No User Found", 404));

  const course = await Course.findById(req.body.id);
  if (!course) return next(new ErrorHandler("No Course Found", 404));

  const itemExist = user.playlist.find((item) => {
    if (item.course.toString() === course._id.toString()) return true;
  });
  if (itemExist) return next(new ErrorHandler("Item already exist", 409));

  user.playlist.push({
    course: course._id,
    poster: course.poster.url,
  });

  await user.save();

  res.status(200).json({
    success: true,
    message: "Added to Playlist 👍",
  });
});

// Remove From Playlist
export const removeFromPlaylist = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (!user) return next(new ErrorHandler("No User Found", 404));

  const course = await Course.findById(req.query.id);
  if (!course) return next(new ErrorHandler("No Course Found", 404));

  const newPlaylist = user.playlist.filter((item) => {
    if (item.course.toString() !== course._id.toString()) return item;
  });

  user.playlist = newPlaylist;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Removed from Playlist",
  });
});

// Admin Controllers
// Get All Users
export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({}).lean();

  res.status(200).json({
    success: true,
    users,
  });
});

// Update User Role
export const updateUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (user.role === "user") user.role = "admin";
  else user.role = "user";

  await user.save();

  res.status(200).json({
    success: true,
    message: `Role Updated : This person is now an ${user.role}`,
  });
});

// Delete User
export const deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  await cloudinary.v2.uploader.destroy(user.avatar.public_id);

  // Cancel Subscription
  const subscriptionId = user.subscription.id;
  if (subscriptionId) {
    await instance.subscriptions.cancel(subscriptionId);

    const payment = await Payment.findOne({
      razorpay_subscription_id: subscriptionId,
    });
    await payment.deleteOne();
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: `${user.name} has been Deleted Successfully`,
  });
});

// User call when Change
User.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  const subscription = await User.find({ "subscription.status": "active" });

  stats[0].users = await User.countDocuments();
  stats[0].subscriptions = subscription.length;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});
