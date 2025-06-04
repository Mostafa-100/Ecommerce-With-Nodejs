const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");

exports.register = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

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

    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const hasSamePassword = await bcrypt.compare(password, user?.password);

    if (!hasSamePassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const resetPasswordEmail = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    sendEmail("Password Reset", resetPasswordEmail);

    res.json({ message: "Password reset link sent" });
  } catch (error) {
    next(error);
  }
};

/*
  I think you should make tests, even with chatgpt
*/
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (error) {
    next(error);
  }
};
