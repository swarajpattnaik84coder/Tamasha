import {Router} from "express"
import { asyncHandler} from "../utils/asyncHandler.js";
import {loginUser, registerUser} from "../controllers/authController.js"

const router = Router();

router.post("/register",asyncHandler(registerUser));
router.post("/login",asyncHandler(loginUser));
export default router;