import express from "express";
import {
  deleteUser,
  getAllUsers,
  getMyProfile,
  login,
  register,
  logout,
  OTP,
  otpVerification,
  //specialFunc,
  updateUser,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

//create users
router.post("/new", register);
router.post("/login", login);
router.get("/logout", logout);

//get users info
router.get("/all", getAllUsers);
//router.get("/userid/special", specialFunc);

//isAuthenticated is in auth.js
router.get("/me", isAuthenticated, getMyProfile);

router
  .route("/:id")
  .put(isAuthenticated, updateUser)
  .delete(isAuthenticated, deleteUser)
  .get(isAuthenticated, OTP)
  .post(isAuthenticated, otpVerification);

export default router;
