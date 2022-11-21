import { Router } from "express";

import { SignIn, SignUp, WalletN, WalletP, WalletNegative, WalletPositive} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", SignUp);

authRouter.post("/signin", SignIn);

authRouter.post("/negativewallet", WalletN)

authRouter.post("/positivewallet", WalletP)

authRouter.get("/negativewallet", WalletNegative)

authRouter.get("/positivewallet", WalletPositive)
export default authRouter;