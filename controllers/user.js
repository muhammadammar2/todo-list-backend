import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";
import { application } from "express";
import otpGenerator from "otp-generator";
//get info pf all users
export const getAllUsers = async (req, res, next) => {};
//login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email or Password", 400));
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Email or Password", 400));

    sendCookie(user, res, `Welcome back,${user.name}`, 200);
  } catch (error) {
    next();
  }
};
//create new user
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User already exists", 400));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword });

    //made function in utils
    sendCookie(user, res, "Registered Successfully", 201);
  } catch (error) {
    next(error);
  }
};

//my details
export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

//logout
export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? "false" : true,
    })
    .json({
      success: true,
      user: req.user,
    });
};

//export const getUserDetails = async (req, res) => {};

// export const specialFunc = (req, res) => {
//     res.json({
//       success: true,
//       message: "Just Joking",
//     });
//   };

//updateUser
export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  //sending the new data to body
  const newUserData = req.body.newUserData;

  //{new:true} returns the updated info
  try {
    const updateUser = await User.findByIdAndUpdate(id, newUserData, {
      new: true,
    });
    if (!updateUser) return next(new ErrorHandler("User not Found", 404));

    return res.json({
      success: true,
      message: "User details Updated",
      user: updateUser,
    });
  } catch (error) {
    next(error);
  }
};

//delete user;
export const deleteUser = async (req, res) => {
  //const { id } = req.params;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new ErrorHandler("User not Found", 404));

    await user.deleteOne();

    res.json({
      success: true,
      message: "Deleted",
    });
  } catch (error) {
    next();
  }
};

//OTP
export const OTP = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler("User not Found", 404));

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: true,
      specialChars: false,
    });

    user.otp = otp;
    await user.save();

    res.json({
      success: true,
      message: "OTP generated and stored successfully",
      otp: otp,
    });
  } catch (error) {
    next(error);
  }
};

//OTP verification
export const otpVerification = async (req, res, next) => {
  const { enteredOTP } = req.body;
  try {
    const user = await User.findById(req.params.id);

    if (!user) return next(new ErrorHandler("User not Found", 404));

    if (enteredOTP === user.otp) {
      return res.json({
        success: true,
        message: "OTP verification successful",
      });
    } else {
      return next(new ErrorHandler("Invalid OTP", 400));
    }
  } catch (error) {
    next(error);
  }
};
