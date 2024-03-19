import express from "express";
import {
  addtoCart,
  allProduct,
  allcartproduct,
  deleteProduct,
  deleteallproducts,
  getCategories,
  getlatestproduct,
  newProduct,
  productCreatedByMe,
  reviewProduct,
  singleProduct,
  updateProduct,
} from "../controllers/productController.js";
import fileupload from "../utils/multer.js";
import { isAuthenticated, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.route("/").get(allProduct);
router.route("/:id")
.get(singleProduct)
.put(isAuthenticated, isAdmin("admin"), fileupload, updateProduct)
.delete(isAuthenticated, isAdmin("admin"), deleteProduct);
router.route("/delete/all").delete(isAuthenticated,isAdmin("admin"),deleteallproducts);

router.route("/cart/add/:id").post(isAuthenticated, addtoCart);
router.route("/cart/all").get(isAuthenticated,allcartproduct);
router.route("/review/:id").post(isAuthenticated, reviewProduct);
router.route("/created/me").get(isAuthenticated, isAdmin("admin"), productCreatedByMe);
router.route("/new").post(isAuthenticated, isAdmin("admin"), fileupload, newProduct);
router.route("/latest/product").get(getlatestproduct);
router.route("/categories/product").get(getCategories);

export default router;