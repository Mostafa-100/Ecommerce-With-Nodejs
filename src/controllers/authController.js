const path = require("path");

const {
  registerUser,
  getUserToken,
  sendResetPasswordEmail,
  updatePassword,
} = require("../services/authService");

const ejs = require("ejs");

exports.register = async (req, res, next) => {
  try {
    const userData = req.body;
    await registerUser(userData);
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const userData = req.body;
    const token = await getUserToken(userData);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;

    const emailTemplatePath = path.join(
      __dirname,
      "../emails/resetPasswordEmail.ejs"
    );

    await sendResetPasswordEmail(email, emailTemplatePath);

    res.json({ message: "Password reset link sent" });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token, password } = req.body;
  try {
    await updatePassword(token, password);
    res.json({ message: "Password has been reset" });
  } catch (error) {
    next(error);
  }
};
