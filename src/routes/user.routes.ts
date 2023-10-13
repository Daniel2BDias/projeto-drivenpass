import { Router } from "express";
import { validateBody } from "../middlewares/validation.middleware";
import { loginSchema, signUpSchema } from "../schemas/user.schema";
import { userControllers } from "../controllers/users.controller";

const userRouter = Router();

userRouter.post("/signup", validateBody(signUpSchema), userControllers.signUp)
          .post("/login", validateBody(loginSchema), userControllers.login);

export { userRouter };