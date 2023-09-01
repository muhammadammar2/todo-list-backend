import express from "express";
import {
  //deleteUser,
  getAllUsers,
  getMyProfile,
  login,
  register,
  //specialFunc,
  //updateUser,
} from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router();

//create users
router.post("/new", register);
router.post("/login", login);

//get users info
router.get("/all", getAllUsers);
//router.get("/userid/special", specialFunc);

//isAuthenticated is in auth.js
router.route("/me", isAuthenticated, getMyProfile);

//router.route("/userid/:id").get(getUserDetail);
//.put(updateUser)
//.delete(deleteUser);

export default router;
