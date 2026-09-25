import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    const { firstname, surname, email, password } = req.body;

    if (!firstname || !surname || !email || !password) {
      return res.status(400).json("Please provide all the fields", error);
    }

    const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
    const passwordRegex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Provide a valid email", error });
    }

    if (!passwordRegex.test(password)) {
      return res
        .status(400)
        .json({ message: "Provide a valid password", error });
    }

    const findUser = await User.findOne({ email });

    if (findUser) {
      return res.status(400).json({ message: "User already exists", error });
    }

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(password, salt);

    const createUser = await User.create({
      firstname,
      surname,
      email,
      password: hashPassword,
    });

    res.status(201).json(createUser);
  } catch (error) {
    res.status(500).json({ message: "User not created", error });
  }
};

const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Provide email and password please", error });
    }

    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      return res
        .status(400)
        .json({ message: "This user does not exist", error });
    }

    const passwordCheck = await bcrypt.compare(password, foundUser.password);

    if (!passwordCheck) {
      return res.status(400).json({ message: "Wrong password", error });
    }
    const token = jwt.sign(
      {
        id: foundUser.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { algorithm: "HS256", expiresIn: "1h" },
    );

    delete foundUser._doc.password;

    res
      .status(200)
      .json({ message: "Logged in succesfully", token, user: foundUser });
  } catch (error) {
    res.status(500).json({ message: "Not logeed in", error });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Not data", error });
  }
};

export { register, getUsers, logIn };
