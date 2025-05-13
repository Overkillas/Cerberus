import express from "express"
import productController from "../src/controllers/productController.js"
import { upload } from "../src/middlewares/multerController.js"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/product", verifyJWT, upload.single("img"), productController.create);
routes.get("/product", verifyJWT,  productController.list);
routes.get("/product/data", verifyJWT, productController.listData);
routes.get("/product/inactive", verifyJWT,  productController.listInactive);
routes.get("/product/:id", verifyJWT, productController.listOne);
routes.put("/product/:id", verifyJWT, productController.update);
routes.delete("/product/:id", verifyJWT, productController.delete)

export default routes;