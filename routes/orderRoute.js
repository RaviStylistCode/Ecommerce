import express from "express";
import {
  adminSingleOrderUpdate,
  adminSingleOrderdelete,
  allOrders,
  createOrder,
  deletesingleOrder,
  getadminsingleorder,
  getdeleteallorders,
  myallOrders,
  singleOrder,
  updateOrder,
} from "../controllers/orderController.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";
const router = express.Router();


router.route("/create").post(isAuthenticated, createOrder);
router.route("/:id")
  .get(isAuthenticated, singleOrder)
  .put(isAuthenticated,updateOrder)
  .delete(isAuthenticated,deletesingleOrder);

router.route("/order/my").get(isAuthenticated, myallOrders);
router.route("/").get(isAuthenticated, isAdmin("admin"), allOrders);
router.route("/admin/order/:id")
  .get(isAuthenticated,isAdmin("admin"),getadminsingleorder)
  .delete(isAuthenticated, isAdmin("admin"), adminSingleOrderdelete)
  .put(isAuthenticated, isAdmin("admin"), adminSingleOrderUpdate);

router.route("/order/delete/all").delete(isAuthenticated,isAdmin("admin"),getdeleteallorders);

export default router;
