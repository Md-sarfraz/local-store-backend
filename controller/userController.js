const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const httpStatusCode = require("../constant/httpStatusCode");
const UserModel = require("../models/userModel");
const AdminModel = require("../models/adminModel");
const RetailerModel = require("../models/storeModel");
const { getToken } = require("../middleware/authMiddleware");
const {SendEmail}=require('../services/emailServices');

const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { firstname, lastname, email, password, phone, role } = req.body;

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    const existingRetailer = await RetailerModel.findOne({ email });

    if (existingUser || existingRetailer) {
      return res.status(httpStatusCode.CONFLICT).json({
        success: false,
        message:
          "User is already registered with this email or phone. Please sign in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === "student") {
      newUser = await UserModel.create({
        firstname,
        lastname,
        username: firstname + " " + lastname,
        email,
        password: hashedPassword,
        phone,
        role: "student",
      });
    } else if (role === "retailer") {
      newUser = await RetailerModel.create({
        firstname,
        lastname,
        username: firstname + " " + lastname,
        email,
        password: hashedPassword,
        phone,
        role: "retailer",
      });
    } else {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "Invalid role specified",
      });
    }

     // Send a congratulatory email to the user
     SendEmail(email,newUser.username);
    return res.status(httpStatusCode.CREATED).json({
      success: true,
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password, phone } = req.body;

    // Check if user exists in any of the relevant collections
    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await AdminModel.findOne({ email });
      if (!user) {
        user = await RetailerModel.findOne({ email });
      }
    }

    if (!user) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid email or user not registered!",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(httpStatusCode.UNAUTHORIZED).json({
        success: false,
        message: "Invalid password",
      });
    }

    // SendEmail(email,user.username);
    const token = await getToken(user);

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "Successfully logged in!",
      data: { user, token, role: user.role },
    });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Something went wrong!",
      error: error.message,
    });
  }
};

const ViewUsers = async (req, res) => {
  try {
    const Users = await UserModel.find();
    if (!Users) {
      return res.status(httpStatusCode.BAD_REQUEST).json({
        success: false,
        message: "users are not found",
      });
    }

    return res.status(httpStatusCode.OK).json({
      success: true,
      message: "viewd successfully",
      data: Users,
    });
  } catch (error) {
    return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "something went wrong !!",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  ViewUsers,
};
