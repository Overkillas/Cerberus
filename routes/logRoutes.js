import express from "express"
import logController from "../src/controllers/logController.js";
import { verifyJWT } from "../src/middlewares/jwtConfig.js";

const routes = express.Router();

routes.get("/log", logController.getTrash)
routes.post("/log", logController.create)
routes.get("/log/:userId", logController.list)
routes.get("/log/redeemed/:userId", logController.listByRedeemed)
routes.get("/log/not/redeemed/:userId", logController.listByNotRedeemed)
routes.get("/log/code/:code", logController.listByCode)
routes.put("/log/:id", logController.update)
routes.put("/log/:token", logController.update)


export default routes;