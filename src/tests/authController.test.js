const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../app");

const User = require("../models/User");

jest.mock("../utils/sendEmail");

beforeAll(async () => {
  const MONGO_URI = "mongodb://db/ecommercetest";
  await mongoose.connect(MONGO_URI);
});

beforeEach(async () => {
  await User.deleteMany({});

  const users = [
    {
      fullname: "Mostafa aour",
      email: "m@g.com",
      password: bcrypt.hashSync("Mm@12345", 10),
    },
    {
      fullname: "Hassan jawad",
      email: "h@g.com",
      password: bcrypt.hashSync("Hh@12345", 10),
    },
    {
      fullname: "Youssef tawil",
      email: "y@g.com",
      password: bcrypt.hashSync("Yy@12345", 10),
    },
  ];

  await User.insertMany(users);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("POST /register", () => {
  it("should register user if data is valid", async () => {
    const newUser = {
      fullname: "Ahmed adil",
      email: "a@g.com",
      password: "Afdf@4343",
    };

    const res = await request(app).post("/register").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User registered");

    const storedUser = await User.findOne({ email: newUser.email });

    expect(storedUser).not.toBeNull();
    expect(storedUser.fullname).toBe(newUser.fullname);

    const isPasswordMatch = await bcrypt.compare(
      newUser.password,
      storedUser.password
    );

    expect(isPasswordMatch).toBe(true);
  });

  it("should return validation errors when data is not valid", async () => {
    const data = {
      fullname: "",
      email: "fdfsdfsf",
      password: "12345",
    };

    const res = await request(app).post("/register").send(data);

    const errors = res.body.errors;

    expect(res.statusCode).toBe(400);
    expect(errors).not.toBeNull();

    expect(errors.fullname).not.toBeNull();
    expect(errors.fullname).toBe("Full name is required.");

    expect(errors.email).not.toBeNull();
    expect(errors.email).toBe("Invalid email address");

    expect(errors.password).not.toBeNull();
    expect(errors.password.length).toBeGreaterThan(2);
    expect(errors.password[0].length).toBeGreaterThan(5);
    expect(errors.password[1].length).toBeGreaterThan(5);
  });

  it("should return error if email has already taken", async () => {
    const data = {
      fullname: "Test",
      email: "m@g.com",
      password: "A@232343",
    };

    const res = await request(app).post("/register").send(data);

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.email).toBe("Invalid email address");
  });
});

describe("POST /login", () => {
  it("should login user if exists", async () => {
    const data = {
      email: "m@g.com",
      password: "Mm@12345",
    };

    const res = await request(app).post("/login").send(data);

    expect(res.statusCode).toBe(200);
    expect(res.body.token).not.toBeNull();
  });

  it("should return error when user not exists", async () => {
    // Either email and password is not correct
    const data1 = {
      email: "notexist@g.com",
      password: "Not@012345",
    };

    // email is correct but not password
    const data2 = {
      email: "m@g.com",
      password: "Notcorrect@12345",
    };

    const res1 = await request(app).post("/login").send(data1);

    expect(res1.statusCode).toBe(401);
    expect(res1.body).toHaveProperty("error", "Invalid credentials");

    const res2 = await request(app).post("/login").send(data2);

    expect(res2.statusCode).toBe(401);
    expect(res2.body).toHaveProperty("error", "Invalid credentials");
  });
});

describe("POST /password-reset-email-request", () => {
  it("should send reset email if user exists", async () => {
    const email = "m@g.com";

    const res = await request(app)
      .post("/password-reset-email-request")
      .send({ email });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Password reset link sent");
  });

  it("should return 404 error if user not exists", async () => {
    const email = "notexist@gm.com";

    const res = await request(app)
      .post("/password-reset-email-request")
      .send({ email });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error", "User not found");
  });
});

describe("POST /reset-password", () => {
  it("should reset password if token is valid", async () => {
    const user = await User.findOne({ email: "m@g.com" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10m",
    });

    const password = "Test@12345";

    const res = await request(app)
      .post("/reset-password")
      .send({ token, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Password has been reset");
  });

  it("should return 500 error if token not valid", async () => {
    const token = jwt.sign({ id: 1 }, "Notcorrect@12345", {
      expiresIn: "5m",
    });

    const password = "Password@12345";

    const res = await request(app)
      .post("/reset-password")
      .send({ token, password });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "invalid signature");
  });
});
