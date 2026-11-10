import {Router} from "express"
import { asyncHandler} from "../utils/asyncHandler.js";
import {registerUser} from "../controllers/authController.js"

const router = Router();

router.post("/register",asyncHandler(registerUser));

export default router;