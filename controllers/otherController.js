import { catchAsyncError } from "../middleware/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Stats } from "../models/StatsModel.js";

// Contact Form
export const contact = catchAsyncError(async (req, res, next) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return next(new ErrorHandler(`All fields are mandatory`, 400));

  const to = process.env.MY_MAIL;
  const subject = `Contact from Course Bundler`;
  const text = `Hello \nI am ${name} \nMy Email is ${email} \n${message}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: `Your Message Has Been Sent successfully`,
  });
});

// Request Form
export const courseRequest = catchAsyncError(async (req, res, next) => {
  const { name, email, course } = req.body;
  if (!name || !email || !course)
    return next(new ErrorHandler(`All fields are mandatory`, 400));

  const to = process.env.MY_MAIL;
  const subject = `Request for a course on Course Bundler`;
  const text = `Hello \nI am ${name} \nMy Email is ${email} \n${course}`;

  await sendEmail(to, subject, text);

  res.status(200).json({
    success: true,
    message: `Your Request Has Been Sent successfully`,
  });
});

// Get Admin Dashboard Stats
export const getDashboardStats = catchAsyncError(async (req, res, next) => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(12);

  const statsData = [];

  for (let i = 0; i < stats.length; i++) {
    statsData.unshift(stats[i]);
  }

  const reqiredSize = 12 - stats.length;

  for (let i = 0; i < reqiredSize; i++) {
    statsData.unshift({
      users: 0,
      subscriptions: 0,
      views: 0,
    });
  }

  const usersCount = statsData[11].users;
  const subscriptionsCount = statsData[11].subscriptions;
  const viewsCount = statsData[11].views;

  let usersProfite = true,
    subscriptionsProfite = true,
    viewsProfite = true;
  let usersPercentage = 0,
    viewsPercentage = 0,
    subscriptionsPercentage = 0;

  if (statsData[10].users === 0) usersPercentage = usersCount * 100;
  if (statsData[10].views === 0) viewsPercentage = viewsCount * 100;
  if (statsData[10].subscriptions === 0)
    subscriptionsPercentage = subscriptionsCount * 100;
  else {
    const difference = {
      users: statsData[11].users - statsData[10].users,
      views: statsData[11].views - statsData[10].views,
      subscriptions: statsData[11].subscriptions - statsData[10].subscriptions,
    };
    usersPercentage = (difference.users / statsData[10].users) * 100;
    viewsPercentage = (difference.views / statsData[10].views) * 100;
    subscriptionsPercentage =
      (difference.subscriptions / statsData[10].subscriptions) * 100;

    if (usersPercentage < 0) usersProfite = false;
    if (viewsPercentage < 0) subscriptionsProfite = false;
    if (subscriptionsPercentage < 0) viewsProfite = false;
  }

  res.status(200).json({
    success: true,
    stats: statsData,
    usersCount,
    subscriptionsCount,
    viewsCount,
    usersPercentage,
    subscriptionsPercentage,
    viewsPercentage,
    usersProfite,
    subscriptionsProfite,
    viewsProfite,
  });
});
