const request = require("supertest");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = require("../app");

const User = require("../models/User");

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
      password: "fdfsdfsdfsdfsdfsd",
    },
    {
      fullname: "Hassan jawad",
      email: "h@g.com",
      password: "fdfsdfsdfsdfsdfdfsdfsd",
    },
    {
      fullname: "Youssef tawil",
      email: "y@g.com",
      password: "fdfsdfsdfsdfs94343dfsd",
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
    isPasswordMatch = await bcrypt.compare(
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
    expect(errors.password).toBe("");
  });
});

describe("POST /login", () => {
  it("should login user if data is valid", async () => {
    const user = {};
  });
});
