import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import { sendCookie } from "../utils/features.js";

//get info pf all users
export const getAllUsers = async (req, res) => {};
//login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (!user)
    return res.status(404).json({
      success: false,
      message: "Inavlid Email or Password",
    });

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(404).json({
      success: false,
      message: "Invalid Email or Password",
    });

  sendCookie(user, res, `Welcome back,${user.name}`, 200);
};
//create new user
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user)
    return res.status(404).json({
      success: false,
      message: "User already exists",
    });

  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({ name, email, password: hashedPassword });

  //made function in utils
  sendCookie(user, res, "Registered Successfully", 201);
};

//my details
export const getMyProfile = (req, res) => {
  res.status(200).json({
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

//update user
// export const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const user = await User.findById(id);
//   res.json({
//     success: true,
//     message: "Updated",
//   });
// };

//delete user
// export const deleteUser = async (req, res) => {
//   const { id } = req.params;
//   const user = await User.findById(id);

//   //await user.remove();

//   res.json({
//     success: true,
//     message: "Deleted",
//   });
// };
