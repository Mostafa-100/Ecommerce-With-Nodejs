const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
const AppError = require("../utils/AppError");

const ejs = require("ejs");

exports.registerUser = async (userData) => {
  const hashedPassword = bcrypt.hashSync(userData.password, 10);

  const newUser = new User({ ...userData, password: hashedPassword });

  await newUser.save();
};

exports.getUserToken = async (userData) => {
  const user = await User.findOne({ email: userData.email });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const hasSamePassword = await bcrypt.compare(
    userData.password,
    user?.password
  );

  if (!hasSamePassword) {
    throw new AppError("Invalid credentials", 401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return token;
};

exports.sendResetPasswordEmail = async (email, emailTemplatePath) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  const resetPasswordEmail = await ejs.renderFile(emailTemplatePath, {
    resetLink,
  });

  sendEmail(email, "Password Reset", resetPasswordEmail);
};

exports.updatePassword = async (token, password) => {
  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.password = await bcrypt.hash(password, 10);

  await user.save();
};
