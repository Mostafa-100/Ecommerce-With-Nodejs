const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.json({ token });
};
