const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const path = require("path");
const AppError = require("../utils/AppError");

const ejs = require("ejs");

exports.register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    const isEmailTaken = await User.findOne({ email });

    if (isEmailTaken) {
      throw new AppError("Invalid credentials", 401);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({ fullname, email, password: hashedPassword });

    await newUser.save();

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const hasSamePassword = await bcrypt.compare(password, user?.password);

    if (!hasSamePassword) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

// TODO: Add rate limiter to this function and others
exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const emailPath = path.join(__dirname, "../emails/resetPasswordEmail.ejs");

    const resetPasswordEmail = await ejs.renderFile(emailPath, {
      resetLink,
    });

    sendEmail(user.email, "Password Reset", resetPasswordEmail);

    res.json({ message: "Password reset link sent" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (error) {
    next(error);
  }
};
