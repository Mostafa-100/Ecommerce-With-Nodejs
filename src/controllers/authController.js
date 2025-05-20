const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");

exports.register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, 10);

    const user = new User({ fullname, email, password: hashedPassword });

    await user.save();

    res.json({ message: "User registered" });
  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      error: "something went wrong, please try again later",
    });
  }
};

exports.login = async (req, res) => {
  return res.json(req.body);

  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const hasSamePassword = await bcrypt.compare(password, user.password);

  if (!hasSamePassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({ token });
};

exports.requestPasswordReset = async () => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ error: "User not found" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  const resetLink = `http://localhost:3000/reset-password?token=${token}`;

  // Send password reset email
  const emailContent = `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 10 minutes.</p>
    `;

  sendEmail("Password Reset", emailContent);

  res.json({ message: "Password reset link sent" });
};

/*
  I think you should make tests, even with chatgpt
*/
exports.resetPassword = async () => {
  const { token, password } = req.body;
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findOne({ email: decode.email });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.password = bcrypt.hash(password, 10);

    await user.save();

    res.json({ message: "Password has been reset" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
