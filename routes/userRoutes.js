import express from "express"
import userController from "../src/controllers/userController.js"
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.post("/user", userController.create)
routes.post("/user/login", userController.login);
routes.post("/user/login/:cpf", userController.loginCPF);
routes.post("/user/forgot-password", userController.forgotPassword)
routes.get("/user/forgot-password/:token", userController.resetPassword)
routes.post("/user/new-password/:token", userController.updatePassword)
routes.get("/user",  userController.list);
routes.get("/user/:id", userController.listOne);
routes.put("/user/:id", userController.update);
routes.delete("/user/:id", userController.delete);

export default routes;