import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
import {
  Allusers,
  adminRegister,
  deletemyProfile,
  deletesingleUser,
  forgetPassword,
  login,
  logout,
  myprofile,
  register,
  resetPassword,
  singleUser,
  updateMyPassword,
  updateMyProfile,
  updateSingleUser,
} from "../controllers/userController.js";
import fileupload from "../utils/multer.js";

const router = express.Router();

//Only for User
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(isAuthenticated, logout);
router.route("/me").get(isAuthenticated, myprofile);
router.route("/update/me").put(isAuthenticated, fileupload, updateMyProfile);
router.route("/delete/me").delete(isAuthenticated, deletemyProfile);
//password change for user
router.route("/forget/password").post(forgetPassword);
router.route("/reset/password").put(resetPassword);
router.route("/update/password").put(isAuthenticated,updateMyPassword);

// Only for Admin
router.route("/admin/alluser").get(isAuthenticated, isAdmin("admin"), Allusers);
router.route("/admin/register").post(isAuthenticated, isAdmin("admin"), adminRegister);
router.route("/admin/alluser/:id")
.get(isAuthenticated, isAdmin("admin"), singleUser)
.put(isAuthenticated, isAdmin("admin"), fileupload, updateSingleUser)
.delete(isAuthenticated, isAdmin("admin"), deletesingleUser);

export default router;
